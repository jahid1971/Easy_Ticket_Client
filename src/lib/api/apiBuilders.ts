/* eslint-disable @typescript-eslint/no-explicit-any */
import { TApiResponse, TQueryParam } from "@/types/general.types";
import apiClient from "./apiClient";
import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
    UseMutationOptions,
    QueryClient,
} from "@tanstack/react-query";
import { useDebouncedValue } from "./clientHooks";
import React from "react";

export type BuildPath<TId = string> = (
    base: string,
    id?: TId,
    id2?: TId
) => string;

export type CreateRQApiConfig<TId = string> = {
    key: string; // base query key e.g. "routes"
    url: string; // base url e.g. "/api/v1/routes"
    buildPath?: BuildPath<TId>; // optional path builder for nested ids
    defaultStaleTime?: number;
    defaultRetry?: number | false;
};

const makeQueryKey = (key: string, params?: unknown) => {
    return params !== undefined ? [key, params] : [key];
};

// normalize TQueryParam[] to an object for axios/query usage
export const convertParamsToObject = (params?: TQueryParam[]) => {
    if (!params) return {} as Record<string, unknown>;
    return params.reduce((acc, param) => {
        acc[param.name] = param.value;
        return acc;
    }, {} as Record<string, unknown>);
};

export function createResourceApi<
    T,
    TCreate = Partial<T>,
    TUpdate = Partial<T>,
    TId = string
>(config: CreateRQApiConfig<TId>) {
    const {
        key,
        url,
        buildPath,
        defaultStaleTime = 60_000,
        defaultRetry = 1,
        
    } = config;

    const path: BuildPath<TId> =
        buildPath ??
        ((base, id?: TId, id2?: TId) => {
            if (id && id2) return `${base}/${String(id)}/${String(id2)}`;
            if (id) return `${base}/${String(id)}`;
            return base;
        });

    
    const getAll = async (
        params?: Record<string, unknown> | TQueryParam[]
    ) => {
        const normalized = Array.isArray(params)
            ? convertParamsToObject(params)
            : params;
        const res = await apiClient.get<TApiResponse<T[]>>(url, {
            params: normalized,
        });
        
        return res as unknown as TApiResponse<T[]>;
    };

    const getById = async (id?: TId, id2?: TId) => {
        const p = path(url, id, id2);
        const res = await apiClient.get<TApiResponse<T>>(p);
        return res as unknown as TApiResponse<T>;
    };

    const createOne = async (payload: TCreate): Promise<T> => {
        // Support sending FormData (for file uploads). axios will set the
        // correct multipart boundary header when Content-Type is set to
        // multipart/form-data here (overriding the json default).
        // We detect FormData at runtime to avoid changing the function signature.
        if (typeof FormData !== "undefined" && payload instanceof FormData) {
            const res = await apiClient.post<TApiResponse<T>>(url, payload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            return res as unknown as T;
        }

        const res = await apiClient.post<TApiResponse<T>>(url, payload);
        return res as unknown as T;
    };

    const updateOne = async (id: TId, data: TUpdate): Promise<T> => {
        const p = path(url, id);
        const res = await apiClient.patch<TApiResponse<T>>(p, data);
        return res as unknown as T;
    };

    const deleteOne = async (id: TId): Promise<unknown> => {
        const p = path(url, id);
        const res = await apiClient.delete<TApiResponse<unknown>>(p);
        return res;
    };

    // Hooks
  
    const useGetAll = <TResult = TApiResponse<T[]>>(
        params?: Record<string, unknown> | TQueryParam[],
        options?: UseQueryOptions<TApiResponse<T[]>, Error, TResult>
    ) => {
        // IMPORTANT: memoize normalization so the reference stays stable across renders
        const normalized = React.useMemo(() => {
            return Array.isArray(params)
                ? convertParamsToObject(params)
                : params;
        }, [params]);

        // Extract only the primitive searchTerm and debounce that primitive.
        // Debouncing the whole `normalized` object can cause reference churn when
        // parent components recreate objects on each render.
        const searchTerm = React.useMemo(() => {
            if (!normalized) return undefined;
            const v = (normalized as Record<string, unknown>)["searchTerm"];
            return typeof v === "string" ? v : undefined;
        }, [normalized]);

        const debouncedSearch = useDebouncedValue(searchTerm, searchTerm ? 300 : 0);

        // Build effectiveParams by merging debounced searchTerm into normalized.
        // This produces a stable object reference when nothing changes.
        const effectiveParams = React.useMemo(() => {
            if (!normalized) return normalized;
            if (debouncedSearch === undefined) return normalized;
            return { ...(normalized as Record<string, unknown>), searchTerm: debouncedSearch };
        }, [normalized, debouncedSearch]);

    const queryKey = React.useMemo(() => makeQueryKey(key, effectiveParams), [effectiveParams]);
        const queryFn = React.useCallback(() => getAll(effectiveParams), [effectiveParams]);

        return useQuery({
            queryKey,
            queryFn,
            staleTime: defaultStaleTime,
            retry: defaultRetry,
            ...(options ?? {}),
        });
    };



    const useGetById = <TResult = TApiResponse<T>>(
        id?: TId,
        options?: UseQueryOptions<TApiResponse<T>, Error, TResult>
    ) => {
        return useQuery({
            queryKey: React.useMemo(() => makeQueryKey(key, id), [id]),
            queryFn: React.useCallback(() => getById(id), [id]),
            enabled: !!id,
            staleTime: defaultStaleTime,
            retry: defaultRetry,
            ...(options ?? {}),
        });
    };

    const useCreateMutation = (
        options?: UseMutationOptions<T, Error, TCreate, unknown> & {
            invalidateKeys?: string[];
        }
    ) => {
        const qc = useQueryClient();
        const { invalidateKeys, ...mutationOptions } = options ?? {};
        
        return useMutation<T, Error, TCreate, unknown>({
            mutationFn: (payload: TCreate) => createOne(payload),
            onSuccess: (data, variables, context) => {
                // Invalidate the main resource key
                qc.invalidateQueries({ queryKey: makeQueryKey(key) });
                
                // Invalidate additional keys if provided
                if (invalidateKeys) {
                    invalidateKeys.forEach(invalidateKey => {
                        qc.invalidateQueries({ queryKey: makeQueryKey(invalidateKey) });
                    });
                }
                
                // Call original onSuccess if provided
                if (mutationOptions.onSuccess) {
                    mutationOptions.onSuccess(data, variables, context);
                }
            },
            ...mutationOptions,
        });
    };

    const useUpdateMutation = (
        options?: UseMutationOptions<
            T,
            Error,
            { id: TId; data: TUpdate },
            unknown
        > & {
            invalidateKeys?: string[];
        }
    ) => {
        const qc = useQueryClient();
        const { invalidateKeys, ...mutationOptions } = options ?? {};
        
        return useMutation<T, Error, { id: TId; data: TUpdate }, unknown>({
            mutationFn: ({ id, data }: { id: TId; data: TUpdate }) =>
                updateOne(id, data),
            onSuccess: (data, variables, context) => {
                // Invalidate the main resource key
                qc.invalidateQueries({ queryKey: makeQueryKey(key) });
                
                // Invalidate additional keys if provided
                if (invalidateKeys) {
                    invalidateKeys.forEach(invalidateKey => {
                        qc.invalidateQueries({ queryKey: makeQueryKey(invalidateKey) });
                    });
                }
                
                // Call original onSuccess if provided
                if (mutationOptions.onSuccess) {
                    mutationOptions.onSuccess(data, variables, context);
                }
            },
            ...mutationOptions,
        });
    };

    const useDeleteMutation = (
        options?: UseMutationOptions<any, Error, TId, unknown> & {
            invalidateKeys?: string[];
        }
    ) => {
        const qc = useQueryClient();
        const { invalidateKeys, ...mutationOptions } = options ?? {};
        
        return useMutation<any, Error, TId, unknown>({
            mutationFn: (id: TId) => deleteOne(id),
            onSuccess: (data, variables, context) => {
                // Invalidate the main resource key
                qc.invalidateQueries({ queryKey: makeQueryKey(key) });
                
                // Invalidate additional keys if provided
                if (invalidateKeys) {
                    invalidateKeys.forEach(invalidateKey => {
                        qc.invalidateQueries({ queryKey: makeQueryKey(invalidateKey) });
                    });
                }
                
                // Call original onSuccess if provided
                if (mutationOptions.onSuccess) {
                    mutationOptions.onSuccess(data, variables, context);
                }
            },
            ...mutationOptions,
        });
    };

    // Prefetch helpers
    const prefetchGetAll = async (
        qc: QueryClient,
        params?: Record<string, unknown> | TQueryParam[]
    ) => {
        const normalized = Array.isArray(params)
            ? convertParamsToObject(params)
            : params;
        return qc.prefetchQuery({
            queryKey: makeQueryKey(key, normalized),
            queryFn: () => getAll(normalized),
            staleTime: defaultStaleTime,
        });
    };

    const prefetchGetById = async (qc: QueryClient, id: TId) => {
        return qc.prefetchQuery({
            queryKey: makeQueryKey(key, id as unknown),
            queryFn: () => getById(id),
            staleTime: defaultStaleTime,
        });
    };

    return {
        // plain fetchers (primary - conventional)
        getAll,
        getById,
        createOne,
        updateOne,
        deleteOne,

        // hooks (primary - conventional)
        useGetAll,
        useGetById,
        useCreateMutation,
        useUpdateMutation,
        useDeleteMutation,

        // prefetch (primary)
        prefetchGetAll,
        prefetchGetById,

        // metadata
        key,
        url,
    } as const;
}

// backward compatible alias
export const createRQApi = createResourceApi;

export default createResourceApi;
