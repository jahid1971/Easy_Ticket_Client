import { TRoute } from "@/types/Route";
import { QO, MO, TObj } from "@/types/Query";
import { createResourceApi } from "@/lib";
import { UseQueryOptions } from "@tanstack/react-query";

// Configure unified API for routes
const busRoutesApi = createResourceApi<TRoute>({
    key: "routes",
    url: "/routes",
});

/* React Query hooks for UI components */
export const useGetBusRoutes = (params?: TObj, options?:QO<TRoute>) =>
    busRoutesApi.useGetAll(params, options);

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
