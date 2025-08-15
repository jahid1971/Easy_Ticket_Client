export type TRoute = {
    id: string;
    routeName?: string | null;
    description?: string | null;
    source: string;
    destination: string;
    distance: number;
    createdAt: string;
    updatedAt: string;
};
