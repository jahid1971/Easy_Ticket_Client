export interface IMeta {
    page: number;
    limit: number;
    total: number;
}

export type TResponse<T> = {
    statuscode?: number;
    data: T;
    error?: any;
    meta?: IMeta;
    success?: boolean;
    message?: string;
};

export type TQuery<T = Record<string, unknown>> = {
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
    [key: string]: any;
} & Partial<T>;