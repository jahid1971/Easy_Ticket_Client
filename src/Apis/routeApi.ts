import { createResourceApi } from "@/lib/apiBuilders";
import { TRoute } from "@/types/Route";
import { QO, MO } from "@/types/Query";

const ROUTES_PATH = "/api/v1/routes";

// Configure unified API for routes
const routesApi = createResourceApi<TRoute, Partial<TRoute>, Partial<TRoute>, string>({
    key: "routes",
    url: ROUTES_PATH,
    defaultStaleTime: 60_000,
    defaultRetry: 1,
});

/* Plain fetchers (server-side/tests/prefetch) */
export const fetchBusRoutes = routesApi.getAll;
export const fetchBusRoute = routesApi.getById;
export const createBusRoute = routesApi.createOne;
export const updateBusRoute = routesApi.updateOne;
export const removeBusRoute = routesApi.deleteOne;

/* React Query hooks for UI components */
export const useGetBusRoutes = (options?: QO<TRoute[]>) =>
    routesApi.useGetAll(options);

export const useGetBusRoutesWithParams = (
    params?: Record<string, unknown>,
    options?: QO<TRoute[]>
) => routesApi.useGetAllWithParams(params, options);

export const useGetBusRoute = (
    id?: string,
    options?: QO<TRoute>
) => routesApi.useGetById(id, options);

export const useCreateBusRoute = (
    options?: MO<TRoute, Partial<TRoute>, unknown>
) => routesApi.useCreateMutation(options);

export const useUpdateBusRoute = (
    options?: MO<
        TRoute,
        { id: string; data: Partial<TRoute> },
        unknown
    >
) => routesApi.useUpdateMutation(options);

export const useDeleteBusRoute = (
    options?: MO<unknown, string, unknown>
) => routesApi.useDeleteMutation(options);
