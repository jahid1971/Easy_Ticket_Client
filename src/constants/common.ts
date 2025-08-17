export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const USER_ROLES = ["USER", "ADMIN", "OPERATOR"] as const;

export const defaultParams = [
    { name: "page", value: 1 },
    { name: "limit", value: 10 },
];
