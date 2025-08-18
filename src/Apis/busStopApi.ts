import { TBusStop } from "@/types/BusStop";
import { QO, MO, TParams } from "@/types/Query";
import { createResourceApi } from "@/lib";

// Configure unified API for bus stops
const busStopsApi = createResourceApi<TBusStop>({
    key: "busStops",
    url: "/bus-stops",
});

/* React Query hooks for UI components */
export const useGetBusStops = (
    params?: TParams,
    options?: QO<TBusStop[]>
) => {
    return busStopsApi.useGetAll(params, options);
};

export const useGetBusStop = (id?: string, options?: QO<TBusStop>) =>
    busStopsApi.useGetById(id, options);

export const useCreateBusStop = (options?: MO<TBusStop>) =>
    busStopsApi.useCreateMutation(options);

export const useUpdateBusStop = (options?: MO<TBusStop>) =>
    busStopsApi.useUpdateMutation(options);

export const useDeleteBusStop = (options?: MO<unknown>) =>
    busStopsApi.useDeleteMutation(options);

// Direct API methods (for use outside React components)
export const getBusStops = busStopsApi.getAll;
export const getBusStop = busStopsApi.getById;
export const createBusStop = busStopsApi.createOne;
export const updateBusStop = busStopsApi.updateOne;
export const deleteBusStop = busStopsApi.deleteOne;
