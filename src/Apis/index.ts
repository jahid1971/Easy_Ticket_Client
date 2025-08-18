// Authentication API
export * from './authApi';

// Core entity APIs
export * from './busApi';
export * from './busRouteApi';
export * from './busStopApi';
export * from './routeStopApi';
export * from './scheduleApi';
export * from './seatApi';
export * from './bookingApi';
export * from './paymentApi';

// Re-export commonly used hooks for convenience
export {
    // Bus hooks
    useGetBuses,
    useGetBus,
    useCreateBus,
    useUpdateBus,
    useDeleteBus,
} from './busApi';

export {
    // Route hooks
    useGetBusRoutes,
    useGetBusRoute,
    useCreateBusRoute,
    useUpdateBusRoute,
    useDeleteBusRoute,
} from './busRouteApi';

export {
    // Bus Stop hooks
    useGetBusStops,
    useGetBusStop,
    useCreateBusStop,
    useUpdateBusStop,
    useDeleteBusStop,
    
} from './busStopApi';

export {
    // Route Stop hooks
    useGetRouteStops,
    useGetRouteStop,
    useCreateRouteStop,
    useUpdateRouteStop,
    useDeleteRouteStop,
    useGetRouteStopsByRoute,
    useBulkCreateRouteStops,
    useReorderRouteStops,
    useDeleteRouteStopsByRoute,
} from './routeStopApi';

export {
    // Schedule hooks
    useGetSchedules,
    useGetSchedule,
    useCreateSchedule,
    useUpdateSchedule,
    useDeleteSchedule,
    useSearchSchedules,
    useGetSchedulesByRoute,
    useGetSchedulesByBus,
    useGetAvailableSchedules,
    useBulkCreateSchedules,
} from './scheduleApi';

export {
    // Seat hooks
    useGetSeats,
    useGetSeat,
    useCreateSeat,
    useUpdateSeat,
    useDeleteSeat,
    useGetScheduleSeats,
    useGetAvailableSeats,
    useBulkCreateSeats,
    useReserveSeat,
    useReleaseSeat,
    useGetSeatMapWithAvailability,
} from './seatApi';

export {
    // Booking hooks
    useGetBookings,
    useGetBooking,
    useCreateBooking,
    useUpdateBooking,
    useDeleteBooking,
    useGetUserBookings,
    useGetScheduleBookings,
    useSearchBookings,
    useCancelBooking,
    useConfirmBooking,
    useGetBookingStats,
} from './bookingApi';

export {
    // Payment hooks
    useGetPayments,
    useGetPayment,
    useCreatePayment,
    useUpdatePayment,
    useDeletePayment,
    useGetUserPayments,
    useProcessPayment,
    useVerifyPayment,
    useRefundPayment,
    useGetPaymentStats,
} from './paymentApi';