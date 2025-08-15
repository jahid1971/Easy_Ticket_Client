import apiClient from "./apiClient";

export const makeQueryKey = (key: string, params?: unknown) => {
    return params !== undefined ? [key, params] : [key];
};

export const makeFetcher = <T = unknown>(
    url: string,
    config?: Record<string, unknown>
) => {
    return async (params?: unknown): Promise<T> => {
        const res = await apiClient.get<T>(url, { params: params ?? config });
        return res.data as T;
    };
};

export default makeQueryKey;
