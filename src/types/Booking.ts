import  { TUser } from './User';
import  { TSchedule } from './Schedule';
import type { TSeat } from './Seat';
import { TPayment } from './Payment';
import type { TRouteStop } from './RouteStop';

export type BookingStatus = "booked" | "cancelled" | "pending";

export type TBooking = {
    id: string;
    userId: string;
    scheduleId: string;
    seatId: string;
    status: BookingStatus;
    paymentId?: string | null;
    boardingStopId?: string | null;
    droppingStopId?: string | null;
    createdAt: string;
    updatedAt: string;
    user: TUser;
    schedule: TSchedule;
    seat: TSeat;
    payment?: TPayment | null;
    boardingStop?: TRouteStop | null;
    droppingStop?: TRouteStop | null;
};

export interface BookingCreateInput {
    userId: string;
    scheduleId: string;
    seatId: string;
    status?: BookingStatus;
    boardingStopId?: string;
    droppingStopId?: string;
}

export interface BookingUpdateInput {
    status?: BookingStatus;
    paymentId?: string;
    boardingStopId?: string;
    droppingStopId?: string;
}

export interface BookingFormData {
    scheduleId: string;
    seatId: string;
    boardingStopId?: string;
    droppingStopId?: string;
}

export interface BookingSearchParams {
    userId?: string;
    scheduleId?: string;
    status?: BookingStatus;
    dateFrom?: string;
    dateTo?: string;
}