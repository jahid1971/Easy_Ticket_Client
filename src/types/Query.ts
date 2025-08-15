import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";

// Short aliases for repetitive TanStack option types with `Error` as the error type
export type QO<TData> = UseQueryOptions<TData, Error>;
export type MO<TData, TVariables, TContext = unknown> = UseMutationOptions<
    TData,
    Error,
    TVariables,
    TContext
>;

export type TObj = Record<string, unknown>;
