"use client";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    memo,
} from "react";
import { AgGridReact } from "@ag-grid-community/react"; // React Grid Logic
import "@ag-grid-community/styles/ag-grid.css"; // Core CSS
import "@ag-grid-community/styles/ag-theme-quartz.css"; // Light theme
import "@ag-grid-community/styles/ag-theme-balham.css"; // Dark theme

import { ColDef, ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

import { LoadingOverlayComponent } from "@/components/dashboard/table/tableLoader/LoadingOverlay";
import { noRowsOverlayComponent } from "@/components/dashboard/table/tableLoader/NoRowsOverlay";
import SearchInput from "./SearchInput";
import { Button } from "../../ui/button";
import { RiFilterLine } from "react-icons/ri";
import { X } from "lucide-react";
import styles from "./table.module.css";
import { CustomPagination } from "../../others/Pagination";
import tableSerial from "@/utils/tableSerial";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    ResponsiveColDef,
    getResponsiveColumns,
    applyResponsiveSizing,
    createResponsiveDefaultColDef,
} from "@/utils/responsiveColumns";
import { useIsSmallScreen } from "@/utils/isSmallScreen";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const DataTable = ({
    rowData,
    columnDefs,
    isFetching,
    handleSelectedRows,
    params,
    setParams,
    searchField,
    filterable,
    createButton,
    filters,
    checkedRowsActionBtn,
    title,
    metaData,
    serial = true,
    minWidth = 700,
    selectable = true,
}: {
    rowData: any[];
    columnDefs: ResponsiveColDef[];
    isFetching: boolean;
    handleSelectedRows?: any;
    searchField?: boolean;
    filterable?: boolean;
    params?: any;
    setParams?: any;
    createButton?: React.ReactNode;
    filters?: React.ReactNode;
    checkedRowsActionBtn?: React.ReactNode;
    title: string;
    metaData?: any;
    serial?: boolean;
    minWidth?: number;
    selectable?: boolean;
}) => {
    const gridRef = useRef<AgGridReact>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const { isDark } = useTheme();
    // Prefer the centralized, tested hook from `src/hooks/use-mobile.ts`
    // it handles SSR defaults and uses matchMedia correctly.
    const isMobile = useIsMobile();

    const defaultColDef = useMemo(() => {
        return createResponsiveDefaultColDef(isMobile);
    }, [isMobile]);

    const processedColumnDefs = useMemo(() => {
        if (
            !columnDefs ||
            !Array.isArray(columnDefs) ||
            columnDefs.length === 0
        ) {
            return [];
        }

        let columns = [...columnDefs];

        // Add serial number column if needed
        if (serial && params) {
            const slColumn: ResponsiveColDef = {
                headerName: "SL",
                headerClass: "sl-header",
                field: "sl",
                priority: "essential",
                maxWidth: isMobile ? 40 : 50,
                minWidth: isMobile ? 40 : 50,
                width: isMobile ? 40 : 50,
                cellStyle: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                },
                sortable: false,
            };

            columns = [slColumn, ...columns];
        }

        const hasCheckboxColumn = columns.some(
            (c: any) => c?.checkboxSelection || c?.headerCheckboxSelection
        );

        if (selectable && !hasCheckboxColumn ) {
            const checkboxCol: ResponsiveColDef = {
                headerCheckboxSelection: true,
                checkboxSelection: true,
                headerClass: "no-divider",
                priority: "essential",
                maxWidth: 45,
                minWidth: 45,
                width: 45,
                field: "__select__",
                pinned: "left",
            } as any;

            columns = [checkboxCol, ...columns];
        }

        // Apply responsive filtering
        const responsiveColumns = getResponsiveColumns(columns, isMobile);

        // Apply responsive sizing and remove any null/undefined entries that
        // could cause ag-grid internals to attempt to read properties on null.
        return applyResponsiveSizing(responsiveColumns, isMobile).filter(
            Boolean
        ) as ResponsiveColDef[];
    }, [serial, params, columnDefs, isMobile]);

    const processedRowData = useMemo(() => {
        if (!rowData || !Array.isArray(rowData)) {
            return [];
        }

        if (serial && params) {
            return rowData.map((item: any, index: number) => ({
                ...item,
                sl: tableSerial(params, index),
                key: index,
            }));
        }
        return rowData;
    }, [serial, params, rowData]);

    useEffect(() => {
        setTimeout(() => {
            if (isFetching && gridRef.current?.api) {
                gridRef.current.api.setGridOption("loading", true);
            } else if (
                !isFetching &&
                !rowData?.length &&
                gridRef.current?.api
            ) {
                gridRef.current.api.setGridOption("loading", false);
                gridRef.current.api.showNoRowsOverlay();
            } else if (gridRef.current?.api) {
                gridRef.current.api.setGridOption("loading", false);
                gridRef.current.api.hideOverlay();
            }
        });
    }, [isFetching, rowData?.length]);

    const [gridApi, setGridApi] = useState<any>(null);

    const onSelectionChanged = useCallback(() => {
        const selectedNodes = gridApi.getSelectedNodes();

        const selectedData = selectedNodes.map((item: any) => item.data);

        setSelectedRows(selectedData);
        // eslint-disable-next-line no-unused-expressions
        handleSelectedRows && handleSelectedRows(selectedData);
    }, [gridApi, handleSelectedRows]);

    useEffect(() => {
        if (gridApi) {
            gridApi.addEventListener("selectionChanged", onSelectionChanged);

            const getSelectedRows = gridApi.getSelectedRows();
            if (getSelectedRows?.length === 0) setSelectedRows([]);

            return () => {
                gridApi.removeEventListener(
                    "selectionChanged",
                    onSelectionChanged
                );
            };
        }
    }, [gridApi, onSelectionChanged]);

    const onGridReady = useCallback((params: any) => {
        setGridApi(params.api);
    }, []);

    const onSortChanged = useCallback(() => {
        if (!gridRef.current?.api || !setParams) return;

        const sortModel = gridRef.current.api
            .getColumnState()
            .filter((col: any) => col.sort)
            .map((col: any) => ({
                colId: col.colId,
                sort: col.sort,
            }));

        if (sortModel.length > 0) {
            const { colId, sort } = sortModel[0];

            setParams((prevParams: any) => {
                const filteredArray = prevParams.filter(
                    (item: any) =>
                        item.name !== "sortBy" &&
                        item.name !== "sortOrder" &&
                        item.name !== "page"
                );

                return [
                    ...filteredArray,
                    { name: "sortBy", value: colId },
                    { name: "sortOrder", value: sort },
                    { name: "page", value: 1 },
                ];
            });
        }
    }, [setParams]);

    return (
        <div>
            {title && (
                <h5 className="text-lg font-semibold text-primary absolute top-3  right-[450px] ">
                    {title}
                </h5>
            )}

            <div className="flex items-center justify-between mt-7">
                <div className={`flex items-center  gap-2 flex-wrap `}>
                    {searchField && params && setParams && (
                        <SearchInput params={params} setParams={setParams} />
                    )}
                    {filterable && (
                        <Button
                            className=""
                            variant={showFilters ? "default" : "outline"}
                            onClick={() => setShowFilters(!showFilters)}
                            size={"sm"}
                        >
                            <RiFilterLine className=" mr-1" />
                            Filter
                        </Button>
                    )}

                    <span
                        className={` transform transition-transform duration-300 ease-in-out flex gap-2  ${
                            showFilters
                                ? "translate-x-0"
                                : "absolute left-0 -translate-x-full"
                        }`}
                    >
                        {filters}
                    </span>
                    {params?.filter(
                        (p: { name: string }) =>
                            p.name !== "page" && p.name !== "limit"
                    )?.length > 0 && (
                        <Button
                            size={"sm"}
                            onClick={() => setParams && setParams([])}
                        >
                            <X size={20} className="mr-1" /> RESET
                        </Button>
                    )}
                </div>
                {createButton}
            </div>

            {checkedRowsActionBtn && (
                <div
                    className={`my-2 transform transition-transform duration-300 ease-in-out ${
                        selectedRows?.length > 0
                            ? "translate-x-0"
                            : "absolute -left-2 -translate-x-full"
                    }`}
                >
                    {checkedRowsActionBtn}
                </div>
            )}

            <div className="w-full overflow-x-auto my-3">
                <div
                    className={`${
                        isDark ? "ag-theme-balham-dark" : "ag-theme-quartz"
                    } ${styles.custom} ${
                        isMobile ? "w-full" : `min-w-[${minWidth}px]`
                    } md:min-w-0`}
                >
                    <AgGridReact
                        ref={gridRef}
                        rowData={processedRowData}
                        columnDefs={processedColumnDefs?.filter(Boolean)}
                        defaultColDef={defaultColDef}
                        {...(selectable
                            ? {
                                  rowSelection: "multiple",
                                  rowMultiSelectWithClick: true,
                                  suppressRowClickSelection: false,
                              }
                            : {})}
                        domLayout="autoHeight"
                        loadingOverlayComponent={LoadingOverlayComponent}
                        noRowsOverlayComponent={noRowsOverlayComponent}
                        onGridReady={onGridReady}
                        onSortChanged={onSortChanged}
                        suppressHorizontalScroll={isMobile}
                        getRowClass={(params) => {
                            if (params.node?.rowIndex !== null) {
                                return params.node.rowIndex % 2 === 0
                                    ? "even-row"
                                    : "odd-row";
                            }
                            return "";
                        }}
                    />
                </div>
            </div>

            {metaData?.total > 5 && setParams && (
                <CustomPagination
                    metaData={metaData}
                    params={params}
                    setParams={setParams}
                />
            )}
        </div>
    );
};

export default memo(DataTable);
