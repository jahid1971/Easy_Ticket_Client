import { ICellRendererParams } from "@ag-grid-community/core";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TRoute } from "@/types/Route";

export interface IRouteRow extends TRoute {
    routeData: TRoute;
}

export const routeColumnDefs = (handleDeleteRoute: (id: string) => void) => [
    {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        maxWidth: 50,
    },
    {
        headerName: "Route Name",
        field: "routeName",
        minWidth: 200,
        cellRenderer: (params: ICellRendererParams<IRouteRow>) => {
            const route = params.data;
            return route?.routeName || `${route?.source} - ${route?.destination}`;
        },
    },
    {
        headerName: "Source",
        field: "source",
        minWidth: 150,
    },
    {
        headerName: "Destination", 
        field: "destination",
        minWidth: 150,
    },
    {
        headerName: "Distance",
        field: "distance",
        maxWidth: 120,
        cellRenderer: (params: ICellRendererParams<IRouteRow>) => {
            return `${params.data?.distance} km`;
        },
    },
    {
        headerName: "Status",
        field: "status",
        maxWidth: 120,
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
        cellStyle: { display: "flex", alignItems: "center", justifyContent: "center" },
        maxWidth: 120,
        cellRenderer: (params: ICellRendererParams<IRouteRow>) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/routes/${params.data?.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleDeleteRoute(params.data?.id ?? "")}
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