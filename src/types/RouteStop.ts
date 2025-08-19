import type { TRoute } from "./Route";
import type { TBusStop } from "./BusStop";
import { TBooking } from "./Booking";

export type StopType = "BOARDING" | "DROPPING";

export type TRouteStop = {
    id: string;
    routeId: string;
    busStopId: string;
    order: number;
    stopType: StopType;
    route: TRoute;
    busStop: TBusStop;
    createdAt: string;
    updatedAt: string;
    boardingBookings?: TBooking[];
    droppingBookings?: TBooking[];
};

export interface RouteStopCreateInput {
    routeId: string;
    busStopId: string;
    order: number;
    stopType?: StopType;
}

export interface RouteStopUpdateInput {
    order?: number;
    stopType?: StopType;
}

export interface RouteStopFormData {
    busStopId: string;
    order: number;
    stopType: StopType;
}

export interface RouteStopBulkCreateInput {
    routeId: string;
    stops: {
        busStopId: string;
        order: number;
        stopType: StopType;
    }[];
}
