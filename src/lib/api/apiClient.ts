import { authKey, refreshKey } from "@/constants/authKey";
import { baseUrl } from "@/constants/common";

import { TResponse } from "@/types/general.types";

import axios, { AxiosResponse } from "axios";

const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

type TAxiosResponse<T> = AxiosResponse<T> & TResponse<T>;

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
    function (response): TAxiosResponse<unknown> {
        console.log(response?.data, "response in axios instance");

        return response;
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
                        const res = await instance(originalRequest);

                        const resObject = {
                            data: res?.data,
                            meta: res?.data?.meta,
                        };

                        return resObject;
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

function getCookie(name: string) {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

// Browser-only: set cookie (non-HttpOnly) so axios can read it
function setCookie(name: string, value: string, days = 1) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
}

// Browser-only: delete a list of cookies by expiring them
function deleteCookies(keys: string[]) {
    keys.forEach((key) => {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
    });
}

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
