import { TRoute } from "@/types/Route";
import { QO, MO, TObj } from "@/types/Query";
import { TQueryParam } from "@/types/general.types";
import { createResourceApi } from "@/lib";
import { UseQueryOptions } from "@tanstack/react-query";

// Configure unified API for routes
const busRoutesApi = createResourceApi<TRoute>({
    key: "routes",
    url: "/routes",
});

// Helper function to convert params array to object
const convertParamsToObject = (params?: TQueryParam[]) => {
    if (!params) return {};
    return params.reduce((acc, param) => {
        acc[param.name] = param.value;
        return acc;
    }, {} as Record<string, any>);
};

/* React Query hooks for UI components */
export const useGetBusRoutes = (params?: TQueryParam[] | TObj, options?: QO<TRoute>) => {
    const queryParams = Array.isArray(params) 
        ? convertParamsToObject(params) 
        : params;
    return busRoutesApi.useGetAll(queryParams, options);
};

export const useGetBusRoute = (id?: string, options?: QO<TRoute>) =>
    busRoutesApi.useGetById(id, options);

export const useCreateBusRoute = (
    options?: MO<TRoute, Partial<TRoute>, unknown>
) => busRoutesApi.useCreateMutation(options);

export const useUpdateBusRoute = (
    options?: MO<TRoute, { id: string; data: Partial<TRoute> }, unknown>
) => busRoutesApi.useUpdateMutation(options);

export const useDeleteBusRoute = (options?: MO<unknown, string, unknown>) =>
    busRoutesApi.useDeleteMutation(options);
