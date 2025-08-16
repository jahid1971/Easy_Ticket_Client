import { authKey, refreshKey } from "@/constants/authKey";
import { baseUrl } from "@/constants/common";

import { TResponse } from "@/types/general.types";

import { deleteCookies, getCookie, setCookie } from "@/utils/cookies";

import axios, { AxiosResponse } from "axios";

const instance = axios.create({ baseURL: baseUrl });
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

// Note: Response interceptor returns the JSON body so callers always get parsed data

instance.interceptors.request.use(
    function (config) {
        const accessToken = getCookie(authKey);

        if (accessToken) {
            config.headers.Authorization = accessToken;
        }
        return config;
    },
    function (error) {
        console.log(error, "error in axios instance request");
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    function (response): unknown {
        // Always return the JSON body so callers don't have to access `.data`
        return response.data;
    },

    async function (error) {
        console.log(error?.response?.data, "error in axios instance response");
        const originalRequest = error.config;

        if (error?.response?.status === 401 && !originalRequest._retry) {
            console.log("refresh req sentttttttttttttttttttttttttttt-------");

            originalRequest._retry = true;
            try {
                // Try to refresh the access token (client-side)
                const accessToken = await refreshAccessToken();

                if (accessToken) {
                    try {
                        // This call goes through interceptors and will return the JSON body
                        const res = await instance(originalRequest);
                        return res;
                    } catch (retryError) {
                        console.log("retryError", retryError);

                        return Promise.reject(retryError);
                    }
                } else {
                    deleteCookies([authKey, refreshKey]);
                }
            } catch (refreshError) {
                console.log(
                    refreshError,
                    "Token refresh failed in refresh catch block"
                );
                deleteCookies([authKey, refreshKey]);

                return Promise.reject(refreshError);
            }
        }

        console.warn(
            error,
            " outside 401 handling, returning original error !"
        );

        return Promise.reject(error);
    }
);

export { instance };

//==============================================================================================================
// --------------------------utils for client-side token management --------------------------

// Client-side token refresh using refreshToken cookie

export async function refreshAccessToken(): Promise<string | null> {
    try {
        const res = await fetch(`${baseUrl}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!res.ok) {
            deleteCookies([authKey, refreshKey]);
            return null;
        }

        type RefreshResponse =
            | { data?: { accessToken?: string } }
            | { accessToken?: string };

        const json = (await res.json()) as RefreshResponse;
        const newAccessToken: string | undefined =
            (json as { data?: { accessToken?: string } })?.data?.accessToken ??
            (json as { accessToken?: string })?.accessToken;

        if (newAccessToken) {
            setCookie(authKey, newAccessToken);
            return newAccessToken;
        }

        deleteCookies([authKey, refreshKey]);
        return null;
    } catch (e) {
        console.log(e, "Error refreshing access token (client)");
        deleteCookies([authKey, refreshKey]);
        return null;
    }
}

// Exported helper to clear tokens on the client
export function deleteToken() {
    deleteCookies([authKey, refreshKey]);
}

export default instance;
