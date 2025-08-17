import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
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
}: {
    rowData: any[];
    columnDefs: ColDef[];
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
}) => {
    const gridRef = useRef<AgGridReact>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const { isDark } = useTheme();

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
        };
    }, []);

    const processedColumnDefs = useMemo(() => {
        if (serial && params) {
            const slColumn = {
                headerName: "SL",
                headerClass: "sl-header",
                field: "sl",
                maxWidth: 60,
                cellStyle: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                },
                sortable: false,
            };
            
            return [
                columnDefs[0],
                slColumn,
                ...columnDefs.slice(1),
            ];
        }
        return columnDefs;
    }, [serial, params, columnDefs]);

    const processedRowData = useMemo(() => {
        if (serial && params && rowData) {
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
            if (isFetching && gridRef.current?.api)
                gridRef.current.api.showLoadingOverlay();
            else if (!isFetching && !rowData?.length && gridRef.current?.api)
                gridRef.current.api.showNoRowsOverlay();
            else if (gridRef.current?.api) gridRef.current.api.hideOverlay();
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
            {(title || createButton) && (
                <div className={`h-14 flex items-center justify-between mb-2 p-2 px-5 md:px-10 shadow-md absolute top-0 left-0 right-0 ${
                    isDark ? 'bg-gray-800 border-b border-gray-700' : 'bg-slate-100'
                }`}>
                    <h5 className="text-lg font-semibold text-primary ">
                        {title}
                    </h5>
                   <div className="mr-10"> {createButton}</div>
                </div>
            )}

            <div
                className={`flex items-center  gap-2 flex-wrap ${
                    (title || createButton) && `mt-7`
                }`}
            >
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
                        // variant={"outline"}
                        // className="text-red-500"
                        onClick={() => setParams && setParams([])}
                    >
                        <X size={20} className="mr-1" /> RESET
                    </Button>
                )}
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
                    className={`${isDark ? 'ag-theme-balham-dark' : 'ag-theme-quartz'} ${styles.noBorders} min-w-[${minWidth}px] md:min-w-0`}
                >
                    <AgGridReact
                        ref={gridRef}
                        rowData={processedRowData}
                        columnDefs={processedColumnDefs}
                        defaultColDef={defaultColDef}
                        domLayout="autoHeight"
                        loadingOverlayComponent={LoadingOverlayComponent}
                        noRowsOverlayComponent={noRowsOverlayComponent}
                        rowSelection={"multiple"}
                        suppressRowClickSelection={true}
                        onGridReady={onGridReady}
                        onSortChanged={onSortChanged}
                        getRowClass={(params) => {
                            return params.node?.rowIndex !== null &&
                                params.node?.rowIndex % 2 === 0
                                ? styles["even-row"]
                                : styles["odd-row"];
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

export default DataTable;
