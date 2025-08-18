"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetBuses, useDeleteBus } from "@/Apis/busApi";
import { TBus } from "@/types/Bus";
import { TQueryParam } from "@/types/general.types";
import { defaultParams } from "@/constants/common";
import { busColumnDefs, IBusRow } from "./ColumnDefs";
import DataTable from "@/components/dashboard/table/DataTable";
import Link from "next/link";

const BusesPage = () => {
    const [params, setParams] = useState<TQueryParam[]>(defaultParams);
    const [deleteIds, setDeleteIds] = useState<string[]>([]);
    const selectedRowsRef = useRef<IBusRow[]>([]);

    const { data: busesData, isFetching } = useGetBuses(params);
    const deleteBusMutation = useDeleteBus();

    const buses = useMemo(() => {
        return busesData?.data?.map((bus: TBus) => ({
            ...bus,
            busData: bus,
        })) || [];
    }, [busesData?.data]);

    const handleDeleteBus = useCallback((id: string) => {
        if (confirm("Are you sure you want to delete this bus?")) {
            deleteBusMutation.mutate(id); 
        }
    }, [deleteBusMutation]);

    const columnDefs = useMemo(() => busColumnDefs(handleDeleteBus), [handleDeleteBus]);

    const handleSelectedRows = useCallback((rows: any) => {
        selectedRowsRef.current = rows;
    }, []);

    const createButton = (
        <Link href="/dashboard/buses/create">
            <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Bus
            </Button>
        </Link>
    );

    const checkedRowsActionBtn = (
        <Button
            size="sm"
            variant="destructive"
            onClick={() =>
                setDeleteIds(
                    selectedRowsRef.current.map((row: IBusRow) => row.id)
                )
            }
        >
            DELETE SELECTED
        </Button>
    );

    return (
        <div>
            <DataTable
                title="BUSES"
                searchField
                rowData={buses}
                columnDefs={columnDefs}
                isFetching={isFetching}
                handleSelectedRows={handleSelectedRows}
                params={params}
                setParams={setParams}
                createButton={createButton}
                checkedRowsActionBtn={checkedRowsActionBtn}
                metaData={busesData?.meta}
                minWidth={1200}
            />
        </div>
    );
};

export default BusesPage;