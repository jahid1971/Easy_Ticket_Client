export type TResponse<T> = {
    statuscode?: number;
    data: T;
    error?: any;
    meta?: TMeta;
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

export type TApiResponse<U> = {
    success?: boolean;
    statusCode?: number;
    message?: string;
    data: U;
    meta?: TMeta;
};
export type TMeta = {
    limit: number;
    page: number;
    total: number;
    totalPage: number;
};
