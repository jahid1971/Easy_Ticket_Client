export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const USER_ROLES = ["USER", "ADMIN", "OPERATOR"] as const;

import { TQueryParam } from "@/types/general.types";

export const defaultParams: TQueryParam[] = [
    { name: "page", value: 1 },
    { name: "limit", value: 10 },
];
