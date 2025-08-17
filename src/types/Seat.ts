import  { TSchedule } from './Schedule';
import  { TBooking } from './Booking';

export type TSeat = {
    id: string;
    scheduleId: string;
    seatNumber: string;
    isBooked: boolean;
    schedule: TSchedule;
    bookings?: TBooking[];
};

export interface SeatCreateInput {
    scheduleId: string;
    seatNumber: string;
    isBooked?: boolean;
}

export interface SeatUpdateInput {
    seatNumber?: string;
    isBooked?: boolean;
}

export interface SeatBulkCreateInput {
    scheduleId: string;
    seats: {
        seatNumber: string;
    }[];
}