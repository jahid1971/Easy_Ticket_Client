import type { TBus } from './Bus';
import type { TRoute } from './Route';
import  { TSeat } from './Seat';
import  { TBooking } from './Booking';

export type TSchedule = {
    id: string;
    busId: string;
    routeId: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    date: string;
    createdAt: string;
    updatedAt: string;
    bus: TBus;
    route: TRoute;
    seats?: TSeat[];
    bookings?: TBooking[];
};

export interface ScheduleCreateInput {
    busId: string;
    routeId: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    date: string;
}

export interface ScheduleUpdateInput {
    busId?: string;
    routeId?: string;
    departureTime?: string;
    arrivalTime?: string;
    price?: number;
    date?: string;
}

export interface ScheduleFormData {
    busId: string;
    routeId: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    date: string;
}

export interface ScheduleSearchParams {
    source?: string;
    destination?: string;
    date?: string;
    routeId?: string;
    busId?: string;
}