import { TRoute } from "@/types/Route";
import { QO, MO, TObj } from "@/types/Query";
import { TQueryParam } from "@/types/general.types";
import { createResourceApi } from "@/lib";
// no extra react-query imports needed here

// Configure unified API for routes
const busRoutesApi = createResourceApi<TRoute>({
    key: "routes",
    url: "/routes",
});



/* React Query hooks for UI components */
export const useGetBusRoutes = (params?: TQueryParam[] | TObj, options?: QO<TRoute[]>) => {
    return busRoutesApi.useGetAll(params, options);
};

export const useGetBusRoute = (id?: string, options?: QO<TRoute>) =>
    busRoutesApi.useGetById(id, options);

export const useCreateBusRoute = (
    options?: MO<TRoute>
) => busRoutesApi.useCreateMutation(options);

export const useUpdateBusRoute = (
    options?: MO<TRoute>
) => busRoutesApi.useUpdateMutation(options);

export const useDeleteBusRoute = (options?: MO<unknown>) =>
    busRoutesApi.useDeleteMutation(options);
