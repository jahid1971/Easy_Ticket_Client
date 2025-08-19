"use client";

import { ICellRendererParams } from "@ag-grid-community/core";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TRoute } from "@/types/Route";
import ActionCell from "@/components/dashboard/table/ActionCell";
import { ResponsiveColDef } from "@/utils/responsiveColumns";
import React from "react";

export interface IRouteRow extends TRoute {
    routeData: TRoute;
}

export const routeColumnDefs = (
    handleOpen: (id: string) => void
): ResponsiveColDef[] => [
    {
        headerName: "Route Name",
        field: "routeName",
        priority: "essential",
        minWidth: 180,
        flex: 2,
        cellRenderer: (params: ICellRendererParams<IRouteRow>) => {
            const route = params.data;
            const routeName =
                route?.routeName || `${route?.source} - ${route?.destination}`;
            return (
                <div className="w-full py-2">
                    <div className="font-semibold text-base leading-tight mb-2">
                        {routeName}
                    </div>
                    {/* Show comprehensive info on mobile in a card-like layout */}
                    <div className="md:hidden space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="font-medium text-muted-foreground block">
                                    Source:
                                </span>
                                <span className="text-foreground">
                                    {route?.source}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-muted-foreground block">
                                    Destination:
                                </span>
                                <span className="text-foreground">
                                    {route?.destination}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <span className="font-medium text-muted-foreground">
                                    Distance:{" "}
                                </span>
                                <span className="text-foreground">
                                    {route?.distance} km
                                </span>
                            </div>
                            <Badge
                                variant={
                                    route?.status === "ACTIVE"
                                        ? "default"
                                        : "secondary"
                                }
                                className={`${
                                    route?.status === "ACTIVE"
                                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                                        : ""
                                }`}
                            >
                                {route?.status}
                            </Badge>
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        headerName: "Source",
        field: "source",
        priority: "high",
        minWidth: 120,
        hideOnMobile: true,
    },
    {
        headerName: "Destination",
        field: "destination",
        priority: "high",
        minWidth: 120,
        hideOnMobile: true,
    },
    {
        headerName: "Distance",
        field: "distance",
        priority: "medium",
        maxWidth: 100,
        hideOnMobile: true,
        cellRenderer: (params: ICellRendererParams<IRouteRow>) => {
            return `${params.data?.distance} km`;
        },
    },
    {
        headerName: "Status",
        field: "status",
        priority: "high",
        maxWidth: 100,
        hideOnMobile: true,
        cellRenderer: (params: ICellRendererParams<IRouteRow>) => {
            const status = params.data?.status;
            return (
                <Badge
                    variant={status === "ACTIVE" ? "default" : "secondary"}
                    className={
                        status === "ACTIVE"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : ""
                    }
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        headerName: "Actions",
        field: "actions",
        priority: "essential",
        cellStyle: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        maxWidth: 80,
        minWidth: 80,
        width: 80,
        sortable: false,
        filter: false,
        cellRenderer: (params: ICellRendererParams<IRouteRow>) => {
            if (!params.data?.id) return null;
            const actions = [
                {
                    label: "Edit",
                    icon: <Edit className="h-4 w-4" />,
                    asChild: true,
                    children: (
                        <Link href={`/dashboard/routes/${params.data.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    ),
                },
                {
                    label: "Delete",
                    icon: <Trash2 className="h-4 w-4" />,
                    onClick: () => handleOpen(params.data?.id || ""),
                    variant: "destructive" as const,
                },
            ];
            return <ActionCell id={params.data.id} actions={actions} />;
        },
    },
];
