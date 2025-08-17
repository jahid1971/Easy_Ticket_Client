import { TBusStop, BusStopCreateInput, BusStopUpdateInput } from "@/types/BusStop";
import { QO, MO, TObj } from "@/types/Query";
import { TQueryParam } from "@/types/general.types";
import { createResourceApi } from "@/lib";

// Configure unified API for bus stops
const busStopsApi = createResourceApi<TBusStop>({
    key: "busStops",
    url: "/bus-stops",
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
export const useGetBusStops = (params?: TQueryParam[] | TObj, options?: QO<TBusStop>) => {
    const queryParams = Array.isArray(params) 
        ? convertParamsToObject(params) 
        : params;
    return busStopsApi.useGetAll(queryParams, options);
};

export const useGetBusStop = (id?: string, options?: QO<TBusStop>) =>
    busStopsApi.useGetById(id, options);

export const useCreateBusStop = (
    options?: MO<TBusStop, BusStopCreateInput, unknown>
) => busStopsApi.useCreateMutation(options);

export const useUpdateBusStop = (
    options?: MO<TBusStop, { id: string; data: BusStopUpdateInput }, unknown>
) => busStopsApi.useUpdateMutation(options);

export const useDeleteBusStop = (options?: MO<unknown, string, unknown>) =>
    busStopsApi.useDeleteMutation(options);

// Search bus stops by name or city
export const useSearchBusStops = (searchTerm?: string, options?: QO<TBusStop>) => {
    return busStopsApi.useGetAll(
        { searchTerm, sortBy: "name", sortOrder: "asc" },
        options
    );
};

// Direct API methods (for use outside React components)
export const getBusStops = busStopsApi.getAll;
export const getBusStop = busStopsApi.getById;
export const createBusStop = busStopsApi.createOne;
export const updateBusStop = busStopsApi.updateOne;
export const deleteBusStop = busStopsApi.deleteOne;