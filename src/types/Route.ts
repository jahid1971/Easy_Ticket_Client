import type { TSchedule } from './Schedule';
import type { TBus } from './Bus';
import type { TRouteStop } from './RouteStop';

export type RouteStatus = "ACTIVE" | "INACTIVE";

export type TRoute = {
    id: string;
    routeName?: string | null;
    description?: string | null;
    source: string;
    destination: string;
    distance: number;
    status: RouteStatus;
    createdAt: string;
    updatedAt: string;
    schedules?: TSchedule[];
    buses?: TBus[];
    routeStops?: TRouteStop[];
};

export interface RouteCreateInput {
    routeName?: string;
    source: string;
    destination: string;
    distance: number;
    description?: string;
    status?: RouteStatus;
}

export interface RouteUpdateInput {
    routeName?: string;
    source?: string;
    destination?: string;
    distance?: number;
    description?: string;
    status?: RouteStatus;
}

export interface RouteFormData {
    routeName?: string;
    source: string;
    destination: string;
    distance: number;
    description?: string;
    status?: RouteStatus;
}

export interface RouteSearchParams {
    source?: string;
    destination?: string;
    status?: RouteStatus;
}
