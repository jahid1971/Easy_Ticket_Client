import { TBus } from "@/types/Bus";
import { QO, MO, TObj } from "@/types/Query";
import { TQueryParam } from "@/types/general.types";
import { createResourceApi } from "@/lib";

// Configure unified API for buses
const busApi = createResourceApi<TBus>({
    key: "buses",
    url: "/buses",
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
export const useGetBuses = (params?: TQueryParam[] | TObj, options?: QO<TBus>) => {
    const queryParams = Array.isArray(params) 
        ? convertParamsToObject(params) 
        : params;
    return busApi.useGetAll(queryParams, options);
};

export const useGetBus = (id?: string, options?: QO<TBus>) =>
    busApi.useGetById(id, options);

export const useCreateBus = (
    options?: MO<TBus, Partial<TBus>, unknown>
) => busApi.useCreateMutation(options);

export const useUpdateBus = (
    options?: MO<TBus, { id: string; data: Partial<TBus> }, unknown>
) => busApi.useUpdateMutation(options);

export const useDeleteBus = (options?: MO<unknown, string, unknown>) =>
    busApi.useDeleteMutation(options);

// Direct API methods (for use outside React components)
export const getBuses = busApi.getAll;
export const getBus = busApi.getById;
export const createBus = busApi.createOne;
export const updateBus = busApi.updateOne;
export const deleteBus = busApi.deleteOne;