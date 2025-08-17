/* eslint-disable @typescript-eslint/no-explicit-any */

import ReactPaginate from "react-paginate";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type TCustomPaginationProps = {
    metaData: { totalPage: number; page: number; limit: number; total: number };
    params: { name: string; value: any }[];
    setParams: any;
};

export const CustomPagination = ({
    metaData,
    params,
    setParams,
}: TCustomPaginationProps) => {
    const totalPages = Math.ceil(metaData?.totalPage || 1);

    const handlePageChange = (selected: any) => {
        const updatedParams = params.filter((param) => param.name !== "page");
        updatedParams.push({ name: "page", value: selected.selected + 1 });
        setParams(updatedParams);
    };

    const handleLimitChange = (value: string) => {
        const updatedParams = params.filter(
            (param) => param.name !== "limit" && param.name !== "page"
        );
        updatedParams.push({ name: "limit", value: parseInt(value) });
        updatedParams.push({ name: "page", value: 1 });
        setParams(updatedParams);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between my-4 space-y-4 sm:space-y-0">
            <div className="order-1 md:order-none mt-4 md:mt-0">
                <h5 className="font-semibold text-center sm:text-left">
                    Total: {metaData?.total}
                </h5>
            </div>

            <div className="">
                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={totalPages}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    onPageChange={handlePageChange}
                    containerClassName="pagination flex justify-center items-center flex-wrap gap-2"
                    activeClassName={"border border-primary py-1 rounded"}
                    previousClassName={
                        "px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    }
                    nextClassName={
                        "px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    }
                    pageClassName="px-3 py-1 bg-muted rounded hover:bg-muted/80"
                    pageLinkClassName="text-foreground"
                    breakClassName="px-3 py-1 text-muted-foreground"
                    forcePage={metaData?.page - 1}
                />
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-2">
                <h5 className="text-sm">Rows Per Page:</h5>
                <Select
                    onValueChange={handleLimitChange}
                    defaultValue={metaData?.limit.toString()}
                >
                    <SelectTrigger className="w-16 py-1">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};