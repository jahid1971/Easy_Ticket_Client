import { 
    TSeat, 
    SeatBulkCreateInput 
} from "@/types/Seat";
import { QO, MO, TObj } from "@/types/Query";
import { TQueryParam } from "@/types/general.types";
import { createResourceApi } from "@/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import  apiClient  from "@/lib/api/apiClient";

// Configure unified API for seats
const seatsApi = createResourceApi<TSeat>({
    key: "seats",
    url: "/seats",
});



/* React Query hooks for UI components */
export const useGetSeats = (params?: TQueryParam[] | TObj, options?: QO<TSeat[]>) => {
    return seatsApi.useGetAll(params, options);
};

export const useGetSeat = (id?: string, options?: QO<TSeat>) =>
    seatsApi.useGetById(id, options);

export const useCreateSeat = (
    options?: MO<TSeat>
) => seatsApi.useCreateMutation(options);

export const useUpdateSeat = (
    options?: MO<TSeat>
) => seatsApi.useUpdateMutation(options);

export const useDeleteSeat = (options?: MO<unknown>) =>
    seatsApi.useDeleteMutation(options);

// Get seats for a specific schedule
export const useGetScheduleSeats = (scheduleId?: string, options?: QO<TSeat[]>) => {
    return seatsApi.useGetAll(
        { scheduleId, sortBy: "seatNumber", sortOrder: "asc" },
        options && {
            ...options,
            enabled: !!scheduleId && (options?.enabled !== false),
        }
    );
};

// Get available seats for a schedule
export const useGetAvailableSeats = (scheduleId?: string, options?: QO<TSeat[]>) => {
    return seatsApi.useGetAll(
        { scheduleId, isBooked: false, sortBy: "seatNumber", sortOrder: "asc" },
        options && {
            ...options,
            enabled: !!scheduleId && (options?.enabled !== false),
        }
    );
};

// Bulk create seats for a schedule
export const useBulkCreateSeats = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: SeatBulkCreateInput) => {
            const response = await apiClient.post(`/seats/bulk`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["seats"] });
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
};

// Reserve seat (temporarily hold it)
export const useReserveSeat = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: { seatId: string; duration?: number }) => {
            const response = await apiClient.patch(`/seats/${data.seatId}/reserve`, {
                duration: data.duration || 300 // 5 minutes default
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["seats"] });
        },
    });
};

// Release reserved seat
export const useReleaseSeat = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (seatId: string) => {
            const response = await apiClient.patch(`/seats/${seatId}/release`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["seats"] });
        },
    });
};

// Get seat map with availability for a schedule
export const useGetSeatMapWithAvailability = (scheduleId?: string) => {
    return useMutation<{
        seats: Array<{ id: string; seatNumber: string; isBooked: boolean }>;
        summary?: { total: number; available: number };
    }>({
        mutationFn: async () => {
            const response = await apiClient.get(`/seats/seat-map/${scheduleId}`);
            return response as unknown as {
                seats: Array<{ id: string; seatNumber: string; isBooked: boolean }>;
                summary?: { total: number; available: number };
            };
        },
    });
};

// Direct API methods (for use outside React components)
export const getSeats = seatsApi.getAll;
export const getSeat = seatsApi.getById;
export const createSeat = seatsApi.createOne;
export const updateSeat = seatsApi.updateOne;
export const deleteSeat = seatsApi.deleteOne;