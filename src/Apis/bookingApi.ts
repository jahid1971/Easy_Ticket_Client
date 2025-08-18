import { 
    TBooking, 
    BookingSearchParams 
} from "@/types/Booking";
import { QO, MO, TObj } from "@/types/Query";
import { TQueryParam } from "@/types/general.types";
import { createResourceApi } from "@/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import  apiClient  from "@/lib/api/apiClient";

// Configure unified API for bookings
const bookingsApi = createResourceApi<TBooking>({
    key: "bookings",
    url: "/bookings",
});

// apiBuilders already supports both Record and TQueryParam[]; no extra normalize needed

/* React Query hooks for UI components */
export const useGetBookings = (params?: TQueryParam[] | TObj, options?: QO<TBooking[]>) => {
    return bookingsApi.useGetAll(params, options);
};

export const useGetBooking = (id?: string, options?: QO<TBooking>) =>
    bookingsApi.useGetById(id, options);

export const useCreateBooking = (
    options?: MO<TBooking>
) => bookingsApi.useCreateMutation(options);

export const useUpdateBooking = (
    options?: MO<TBooking>
) => bookingsApi.useUpdateMutation(options);

export const useDeleteBooking = (
    options?: MO<unknown>
) => bookingsApi.useDeleteMutation(options);

// Get bookings for a specific user
export const useGetUserBookings = (userId?: string, options?: QO<TBooking[]>) => {
    return bookingsApi.useGetAll(
        { userId, sortBy: "createdAt", sortOrder: "desc" },
        options && {
            ...options,
            enabled: !!userId && (options?.enabled !== false),
        }
    );
};

// Get bookings for a specific schedule
export const useGetScheduleBookings = (scheduleId?: string, options?: QO<TBooking[]>) => {
    return bookingsApi.useGetAll(
        { scheduleId, sortBy: "createdAt", sortOrder: "asc" },
        options && {
            ...options,
            enabled: !!scheduleId && (options?.enabled !== false),
        }
    );
};

// Search bookings with filters
export const useSearchBookings = (searchParams?: BookingSearchParams, options?: QO<TBooking[]>) => {
    return bookingsApi.useGetAll(
        {
            ...searchParams,
            sortBy: "createdAt",
            sortOrder: "desc"
        },
        options
    );
};

// Cancel booking
export const useCancelBooking = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (bookingId: string) => {
            const response = await apiClient.patch(`/bookings/${bookingId}/cancel`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
            queryClient.invalidateQueries({ queryKey: ["seats"] });
        },
    });
};

// Confirm booking (after payment)
export const useConfirmBooking = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: { bookingId: string; paymentId: string }) => {
            const response = await apiClient.patch(`/bookings/${data.bookingId}/confirm`, {
                paymentId: data.paymentId
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
    });
};

// Get booking statistics
export const useGetBookingStats = (params?: { userId?: string; dateFrom?: string; dateTo?: string }) => {
    return useMutation({
        mutationFn: async () => {
            const response = await apiClient.get(`/bookings/stats`, { params });
            return response.data;
        },
    });
};

// Direct API methods (for use outside React components)
export const getBookings = bookingsApi.getAll;
export const getBooking = bookingsApi.getById;
export const createBooking = bookingsApi.createOne;
export const updateBooking = bookingsApi.updateOne;
export const deleteBooking = bookingsApi.deleteOne;