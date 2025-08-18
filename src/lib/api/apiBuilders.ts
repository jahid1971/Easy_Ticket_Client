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
        const normalized = Array.isArray(params)
            ? convertParamsToObject(params)
            : params;

        // Auto-detect if searchTerm is present and apply default debounce (300ms)
        const hasSearchTerm = normalized && 'searchTerm' in normalized && normalized.searchTerm;
        const autoDebounceMs = hasSearchTerm ? 300 : 0;
        const debounced = useDebouncedValue(normalized, autoDebounceMs);
        const effectiveParams = autoDebounceMs > 0 ? debounced : normalized;

        return useQuery({
            queryKey: makeQueryKey(key, effectiveParams), // ex: ["students", {category:"boys"}]
            queryFn: () => getAll(effectiveParams),
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
            queryKey: makeQueryKey(key, id),
            queryFn: () => getById(id),
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
        options?: UseMutationOptions<unknown, Error, TId, unknown> & {
            invalidateKeys?: string[];
        }
    ) => {
        const qc = useQueryClient();
        const { invalidateKeys, ...mutationOptions } = options ?? {};
        
        return useMutation<unknown, Error, TId, unknown>({
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
