import { ICellRendererParams } from "@ag-grid-community/core";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TBus } from "@/types/Bus";

export interface IBusRow extends TBus {
    busData: TBus;
}

export const busColumnDefs = (handleDeleteBus: (id: string) => void) => [
    {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        maxWidth: 50,
    },
    {
        headerName: "Bus Name",
        field: "name",
        minWidth: 200,
        cellRenderer: (params: ICellRendererParams<IBusRow>) => {
            const bus = params.data;
            return (
                <div className="flex items-center space-x-3">
                    {bus?.coverImageUrl && (
                        <img
                            src={bus.coverImageUrl}
                            alt={bus.name}
                            className="w-10 h-8 rounded object-cover"
                        />
                    )}
                    <span className="font-medium">{bus?.name}</span>
                </div>
            );
        },
    },
    {
        headerName: "Operator",
        field: "operator",
        minWidth: 150,
    },
    {
        headerName: "Registration Number",
        field: "registrationNumber",
        minWidth: 180,
        cellRenderer: (params: ICellRendererParams<IBusRow>) => (
            <Badge variant="outline" className="font-mono">
                {params.data?.registrationNumber}
            </Badge>
        ),
    },
    {
        headerName: "Total Seats",
        field: "seatMap",
        maxWidth: 120,
        cellRenderer: (params: ICellRendererParams<IBusRow>) => {
            const seatMap = params.data?.seatMap;
            if (!seatMap?.layout) return "N/A";
            
            const totalSeats = seatMap.layout.reduce((total, row) => total + row.length, 0);
            return (
                <Badge variant="secondary">
                    {totalSeats} seats
                </Badge>
            );
        },
    },
    {
        headerName: "Route",
        field: "route",
        minWidth: 200,
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
                    <div className="font-medium">{route.routeName || `${route.source} - ${route.destination}`}</div>
                    <div className="text-gray-500">{route.distance} km</div>
                </div>
            );
        },
    },
    {
        headerName: "Created",
        field: "createdAt",
        maxWidth: 140,
        cellRenderer: (params: ICellRendererParams<IBusRow>) => {
            const date = new Date(params.data?.createdAt || "");
            return date.toLocaleDateString();
        },
    },
    {
        headerName: "Actions",
        cellStyle: { display: "flex", alignItems: "center", justifyContent: "center" },
        maxWidth: 120,
        cellRenderer: (params: ICellRendererParams<IBusRow>) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/buses/${params.data?.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/buses/${params.data?.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleDeleteBus(params.data?.id ?? "")}
                        className="text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];