"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetBusRoutes, useDeleteBusRoute } from "@/Apis/busRouteApi";
import { TRoute } from "@/types/Route";
import { TQueryParam } from "@/types/general.types";
import { defaultParams } from "@/constants/common";
import { routeColumnDefs, IRouteRow } from "./ColumnDefs";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import DataTable from "@/components/dashboard/table/DataTable";
import Link from "next/link";
import { tryCatch } from "@/utils/tryCatch";

const RoutesPage = () => {
    const [params, setParams] = useState<TQueryParam[]>(defaultParams);
    const [deleteIds, setDeleteIds] = useState<string[]>([]);
    const selectedRowsRef = useRef<IRouteRow[]>([]);
    const [open, setOpen] = useState(false);

    const { data: routesData, isFetching } = useGetBusRoutes(params);
    const { mutate: deleteRoute, mutateAsync: deleteRouteAsync } = useDeleteBusRoute();

    const routes = useMemo(() => {
        return (
            routesData?.data?.map((route: TRoute) => ({
                ...route,
                routeData: route,
            })) || []
        );
    }, [routesData?.data]);

    const handleDeleteRoute = async (id: string) => {
        await tryCatch(
            async () => await deleteRouteAsync(id),
            "deleting route",
            "Route deleted successfully"
        );

        setOpen(false);
        setDeleteIds([]);
    };


    const handleModalOpen = (id: string) => {
        setOpen(true);
        setDeleteIds([id]);
    };

    const columnDefs = useMemo(() => {
        return routeColumnDefs(handleModalOpen);
    }, [handleModalOpen]);

    const handleSelectedRows = useCallback((rows: any) => {
        selectedRowsRef.current = rows;
    }, []);

    const createButton = (
        <Link href="/dashboard/routes/create">
            <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Route
            </Button>
        </Link>
    );

    const checkedRowsActionBtn = (
        <Button
            size="sm"
            variant="destructive"
            onClick={() =>
                setDeleteIds(
                    selectedRowsRef.current.map((row: IRouteRow) => row.id)
                )
            }
        >
            DELETE SELECTED
        </Button>
    );

    return (
        <div>
            <ConfirmDeleteModal
                title="Are you sure you want to delete this route?"
                handleDelete={() => handleDeleteRoute(deleteIds[0])}
                open={open}
                onOpenChange={setOpen}
            />
            <DataTable
                title="ROUTES"
                searchField
                rowData={routes}
                columnDefs={columnDefs}
                isFetching={isFetching}
                handleSelectedRows={handleSelectedRows}
                params={params}
                setParams={setParams}
                createButton={createButton}
                checkedRowsActionBtn={checkedRowsActionBtn}
                metaData={routesData?.meta}
                minWidth={1000}
            />
        </div>
    );
};

export default RoutesPage;
