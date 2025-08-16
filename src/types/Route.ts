
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
};

export interface RouteCreateInput {
    source: string;
    destination: string;
    distance: number;
    status?: RouteStatus;
}
