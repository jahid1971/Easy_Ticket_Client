import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { TApiResponse, TQuery, TQueryParam } from "./general.types";

// Short aliases for repetitive TanStack option types with `Error` as the error type
export type QO<T> = UseQueryOptions<TApiResponse<T>, Error>;

export type MO<T> = UseMutationOptions<T, Error, Partial<T>, unknown> & {
    invalidateKeys?: string[];
};

export type TObj = Record<string, unknown>;

// Common query keys used across list endpoints
export type CommonQueryKeys = {
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
};

export type TParams<
    T extends Record<string, unknown> = Record<string, unknown>
> = (Partial<CommonQueryKeys> & Partial<T>) | TQuery<T> | TQueryParam[];
