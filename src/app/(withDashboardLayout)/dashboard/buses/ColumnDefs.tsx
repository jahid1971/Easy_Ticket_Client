import { ICellRendererParams } from "@ag-grid-community/core";
import { Edit, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TBus } from "@/types/Bus";
import ActionCell from "@/components/dashboard/table/ActionCell";
import { ResponsiveColDef } from "@/utils/responsiveColumns";
import React from "react";

export interface IBusRow extends TBus {
    busData: TBus;
}

export const busColumnDefs = (handleDeleteBus: (id: string) => void) => [
    
    
    {
        headerName: "Bus Name",
        field: "name",
        minWidth: 170,
    flex: 1,
    autoHeight: true,
    wrapText: true,
    cellStyle: { whiteSpace: "normal" },
        priority: "essential",
        cellRenderer: (params: ICellRendererParams<IBusRow>) => {
            const bus = params.data;
            return (
                <div className="w-full py-2">
                    <div className="flex items-center space-x-3 font-semibold text-base leading-tight mb-2">
                        {bus?.coverImageUrl && (
                            <img
                                src={bus.coverImageUrl}
                                alt={bus.name}
                                className="w-10 h-8 rounded object-cover"
                            />
                        )}
                        <span>{bus?.name}</span>
                    </div>
                    {/* Mobile card info */}
                    <div className="md:hidden space-y-3 ">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="font-medium text-muted-foreground block">
                                    Operator:
                                </span>
                                <span className="text-foreground">
                                    {bus?.operator}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-muted-foreground block">
                                    Reg. No:
                                </span>
                                <span className="text-foreground">
                                    {bus?.registrationNumber}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <span className="font-medium text-muted-foreground">
                                    Seats:{" "}
                                </span>
                                <span className="text-foreground">
                                    {bus?.seatMap?.layout
                                        ? bus.seatMap.layout.reduce(
                                              (total: number, row: any[]) =>
                                                  total + row.length,
                                              0
                                          )
                                        : "N/A"}
                                </span>
                            </div>
                            <Badge variant="secondary">
                                {bus?.route?.routeName ||
                                    `${bus?.route?.source} - ${bus?.route?.destination}` ||
                                    "No Route"}
                            </Badge>
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        headerName: "Operator",
        field: "operator",
        minWidth: 100,
        priority: "high",
        hideOnMobile: true,
    },
    {
        headerName: "Reg Number",
        field: "registrationNumber",
        minWidth: 150,
        priority: "high",
        hideOnMobile: true,
        cellRenderer: (params: ICellRendererParams<IBusRow>) => (
            <Badge variant="outline" className="font-mono">
                {params.data?.registrationNumber}
            </Badge>
        ),
    },
    {
        headerName: "Seats",
        field: "seatMap",
        maxWidth: 100,
        priority: "medium",
        hideOnMobile: true,
        cellRenderer: (params: ICellRendererParams<IBusRow>) => {
            const seatMap = params.data?.seatMap;
            if (!seatMap?.layout) return "N/A";
            const totalSeats = seatMap.layout.reduce(
                (total: number, row: any[]) => total + row.length,
                0
            );
            return <Badge variant="secondary">{totalSeats} seats</Badge>;
        },
    },
    {
        headerName: "Route",
        field: "route",
        minWidth: 180,
        priority: "medium",
        hideOnMobile: true,
        cellRenderer: (params: ICellRendererParams<IBusRow>) => {
            const route = params.data?.route;
            if (!route) {
                return (
                    <Badge variant="outline" className="text-gray-500">
                        No Route Assigned
                    </Badge>
                );
            }
            return (
                <div className="text-sm">
                    <div className="font-medium">
                        {route.routeName ||
                            `${route.source} - ${route.destination}`}
                    </div>
                    <div className="text-gray-500">{route.distance} km</div>
                </div>
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
        cellRenderer: (params: ICellRendererParams<IBusRow>) => {
            if (!params.data?.id) return null;
            const actions = [
                {
                    label: "View Details",
                    icon: <Eye className="h-4 w-4" />,
                    asChild: true,
                    children: (
                        <Link href={`/dashboard/buses/${params.data.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </Link>
                    ),
                },
                {
                    label: "Edit",
                    icon: <Edit className="h-4 w-4" />,
                    asChild: true,
                    children: (
                        <Link href={`/dashboard/buses/${params.data.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    ),
                },
                {
                    label: "Delete",
                    icon: <Trash2 className="h-4 w-4" />,
                    onClick: () => handleDeleteBus(params.data?.id || ""),
                    variant: "destructive" as const,
                },
            ];
            return <ActionCell id={params.data.id} actions={actions} />;
        },
    },
];
