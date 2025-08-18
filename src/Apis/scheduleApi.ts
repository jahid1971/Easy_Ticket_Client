import { 
    TSchedule, 
    ScheduleCreateInput, 
    ScheduleSearchParams 
} from "@/types/Schedule";
import { QO, MO, TObj } from "@/types/Query";
import { TQueryParam } from "@/types/general.types";
import { createResourceApi } from "@/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import  apiClient from "@/lib/api/apiClient";

// Configure unified API for schedules
const schedulesApi = createResourceApi<TSchedule>({
    key: "schedules",
    url: "/schedules",
});



/* React Query hooks for UI components */
export const useGetSchedules = (params?: TQueryParam[] | TObj, options?: QO<TSchedule[]>) => {
    return schedulesApi.useGetAll(params, options);
};

export const useGetSchedule = (id?: string, options?: QO<TSchedule>) =>
    schedulesApi.useGetById(id, options);

export const useCreateSchedule = (
    options?: MO<TSchedule>
) => schedulesApi.useCreateMutation(options);

export const useUpdateSchedule = (
    options?: MO<TSchedule>
) => schedulesApi.useUpdateMutation(options);

export const useDeleteSchedule = (options?: MO<unknown>) =>
    schedulesApi.useDeleteMutation(options);

// Search schedules for booking
export const useSearchSchedules = (searchParams?: ScheduleSearchParams, options?: QO<TSchedule[]>) => {
    return schedulesApi.useGetAll(
        {
            ...searchParams,
            sortBy: "departureTime",
            sortOrder: "asc"
        },
        options
    );
};

// Get schedules for a specific route
export const useGetSchedulesByRoute = (routeId?: string, options?: QO<TSchedule[]>) => {
    return schedulesApi.useGetAll(
        { routeId, sortBy: "date,departureTime", sortOrder: "asc" },
        options && {
            ...options,
            enabled: !!routeId && (options?.enabled !== false),
        }
    );
};

// Get schedules for a specific bus
export const useGetSchedulesByBus = (busId?: string, options?: QO<TSchedule[]>) => {
    return schedulesApi.useGetAll(
        { busId, sortBy: "date,departureTime", sortOrder: "asc" },
        options && {
            ...options,
            enabled: !!busId && (options?.enabled !== false),
        }
    );
};

// Get available schedules (with seat availability)
export const useGetAvailableSchedules = (searchParams?: ScheduleSearchParams, options?: QO<TSchedule[]>) => {
    return schedulesApi.useGetAll(
        {
            ...searchParams,
            hasAvailableSeats: true,
            sortBy: "departureTime",
            sortOrder: "asc"
        },
        options
    );
};

// Bulk create schedules
export const useBulkCreateSchedules = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: { schedules: ScheduleCreateInput[] }) => {
            const response = await apiClient.post(`/schedules/bulk`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
};

// Direct API methods (for use outside React components)
export const getSchedules = schedulesApi.getAll;
export const getSchedule = schedulesApi.getById;
export const createSchedule = schedulesApi.createOne;
export const updateSchedule = schedulesApi.updateOne;
export const deleteSchedule = schedulesApi.deleteOne;