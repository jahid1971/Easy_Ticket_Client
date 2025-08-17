import { TRoute } from "./Route";

export type SeatMapLayout = string[][];

export type ColumnPosition = {
    leftSide: number[];
    rightSide: number[];
};

export type SeatMap = {
    layout: SeatMapLayout;
    columnPosition?: ColumnPosition;
};

export type TBus = {
    id: string;
    name: string;
    operator: string;
    registrationNumber: string;
    seatMap: SeatMap;
    routeId?: string | null;
    route?: TRoute | null;
    coverImageUrl?: string | null;
    createdAt: string;
    updatedAt: string;
};

export interface BusCreateInput {
    name: string;
    operator: string;
    registrationNumber: string;
    seatMap: SeatMap;
    routeId?: string;
    coverImageUrl?: string;
}

export interface BusUpdateInput {
    name?: string;
    operator?: string;
    registrationNumber?: string;
    seatMap?: SeatMap;
    routeId?: string;
    coverImageUrl?: string;
}

export interface BusFormData extends Omit<BusCreateInput, 'coverImageUrl'> {
    coverImage?: File;
}

export interface BusUpdateFormData extends Omit<BusUpdateInput, 'coverImageUrl'> {
    coverImage?: File;
}