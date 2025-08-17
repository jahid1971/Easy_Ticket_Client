export type TBusStop = {
    id: string;
    name: string;
    address?: string | null;
    city?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdAt: string;
    updatedAt: string;
    routeStops?: TRouteStop[];
};

export interface BusStopCreateInput {
    name: string;
    address?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
}

export interface BusStopUpdateInput {
    name?: string;
    address?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
}

export interface BusStopFormData {
    name: string;
    address?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
}

// Import this to avoid circular dependency
import  { TRouteStop } from './RouteStop';