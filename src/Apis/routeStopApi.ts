import { 
    TRouteStop, 
    RouteStopBulkCreateInput 
} from "@/types/RouteStop";
import { QO, MO, TObj } from "@/types/Query";
import { TQueryParam } from "@/types/general.types";
import { createResourceApi } from "@/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import  apiClient  from "@/lib/api/apiClient";

// Configure unified API for route stops
const routeStopsApi = createResourceApi<TRouteStop>({
    key: "routeStops",
    url: "/route-stops",
});



/* React Query hooks for UI components */
export const useGetRouteStops = (params?: TQueryParam[] | TObj, options?: QO<TRouteStop[]>) => {
    return routeStopsApi.useGetAll(params, options);
};

export const useGetRouteStop = (id?: string, options?: QO<TRouteStop>) =>
    routeStopsApi.useGetById(id, options);

export const useCreateRouteStop = (
    options?: MO<TRouteStop>
) => routeStopsApi.useCreateMutation(options);

export const useUpdateRouteStop = (
    options?: MO<TRouteStop>
) => routeStopsApi.useUpdateMutation(options);

export const useDeleteRouteStop = (options?: MO<unknown>) =>
    routeStopsApi.useDeleteMutation(options);

// Get route stops for a specific route (ordered)
export const useGetRouteStopsByRoute = (routeId?: string, options?: QO<TRouteStop[]>) => {
    return routeStopsApi.useGetAll(
        { routeId, sortBy: "order", sortOrder: "asc" },
        options && {
            ...options,
            enabled: !!routeId && (options?.enabled !== false),
        }
    );
};

// Bulk create route stops for a route
export const useBulkCreateRouteStops = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: RouteStopBulkCreateInput) => {
            const response = await apiClient.post(`/route-stops/bulk`, data);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ["routeStops"] });
            queryClient.invalidateQueries({ queryKey: ["routes"] });
        },
    });
};

// Reorder route stops
export const useReorderRouteStops = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: { routeId: string; stopOrders: { id: string; order: number }[] }) => {
            const response = await apiClient.patch(`/route-stops/reorder`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["routeStops"] });
        },
    });
};

// Delete all route stops for a route
export const useDeleteRouteStopsByRoute = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (routeId: string) => {
            const response = await apiClient.delete(`/route-stops/route/${routeId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["routeStops"] });
            queryClient.invalidateQueries({ queryKey: ["routes"] });
        },
    });
};

// Direct API methods (for use outside React components)
export const getRouteStops = routeStopsApi.getAll;
export const getRouteStop = routeStopsApi.getById;
export const createRouteStop = routeStopsApi.createOne;
export const updateRouteStop = routeStopsApi.updateOne;
export const deleteRouteStop = routeStopsApi.deleteOne;