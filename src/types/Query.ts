import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { TApiResponse } from "./general.types";

// Short aliases for repetitive TanStack option types with `Error` as the error type
export type QO<T> = UseQueryOptions<TApiResponse<T[]>, Error>;

export type MO<TData, TVariables, TContext = unknown> = UseMutationOptions<
    TData,
    Error,
    TVariables,
    TContext
>;

export type TObj = Record<string, unknown>;
