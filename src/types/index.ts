// Core entity types
export * from './User';
export * from './Bus';
export * from './Route';
export * from './BusStop';
export * from './RouteStop';
export * from './Schedule';
export * from './Seat';
export * from './Booking';
export * from './Payment';

// General utility types
export * from './general.types';
export * from './Query';

// Re-export commonly used types
export type {
    TUser,
    UserRole,
    UserStatus,
    UserCreateInput,
    UserUpdateInput,
    UserLoginInput,
    UserRegisterInput
} from './User';

export type {
    TBus,
    SeatMap,
    SeatMapLayout,
    BusCreateInput,
    BusUpdateInput,
    BusFormData
} from './Bus';

export type {
    TRoute,
    RouteStatus,
    RouteCreateInput,
    RouteUpdateInput,
    RouteFormData
} from './Route';

export type {
    TBusStop,
    BusStopCreateInput,
    BusStopUpdateInput,
    BusStopFormData
} from './BusStop';

export type {
    TRouteStop,
    StopType,
    RouteStopCreateInput,
    RouteStopUpdateInput,
    RouteStopFormData,
    RouteStopBulkCreateInput
} from './RouteStop';

export type {
    TSchedule,
    ScheduleCreateInput,
    ScheduleUpdateInput,
    ScheduleFormData,
    ScheduleSearchParams
} from './Schedule';

export type {
    TSeat,
    SeatCreateInput,
    SeatUpdateInput,
    SeatBulkCreateInput
} from './Seat';

export type {
    TBooking,
    BookingStatus,
    BookingCreateInput,
    BookingUpdateInput,
    BookingFormData,
    BookingSearchParams
} from './Booking';

export type {
    TPayment,
    PaymentStatus,
    PaymentMethod,
    PaymentCreateInput,
    PaymentUpdateInput,
    PaymentFormData
} from './Payment';