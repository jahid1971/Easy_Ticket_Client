import { Button } from "@/components/ui/button";
import { RiFilterLine } from "react-icons/ri";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";
import { TQueryParam } from "@/types/global.types";
import { PopoverClose } from "@radix-ui/react-popover";
import { useForm } from "react-hook-form";
import { DatePicker } from "@/components/ui/DatePicker";

interface FilterByProps {
    title: string;
    params: TQueryParam[];
    setParams: any;
}

const FilterByDate: React.FC<FilterByProps> = ({
    title,
    // filterBy,
    params,
    setParams,
}) => {
    const [inputValues, setInputValues] = useState<string[]>([]);
    const { control, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (params.length < 1) setInputValues([]);
    }, [params]);

    const filterButton = (
        <Button
            variant="outline_primary"
            className="border-dashed"
            size={"xsm"}
        >
            <RiFilterLine className="w-4 h-4 mr-1" />
            <span className="pr-0.5">{title}</span>

            {inputValues?.length > 0 && (
                <div className="space-x-1 lg:flex">
                    {inputValues?.map((option, i) => (
                        <Badge
                            variant="secondary"
                            key={i}
                            className="px-1 font-normal rounded-sm"
                        >
                            {option}
                        </Badge>
                    ))}
                </div>
            )}
        </Button>
    );

    // filterBy = filterBy.charAt(0).toUpperCase() + filterBy.slice(1);

    const handleFilter = (data: { [key: string]: Date }) => {
        const updatedParams = params.filter(
            (param) =>
                param.name !== `startDate` &&
                param.name !== `endDate` &&
                param.name !== `page`
        );
        setInputValues([]);

        if (data[`startDate`]) {
            const startDate = new Date(data[`startDate`]);
            startDate.setHours(0, 0, 0, 0);

            updatedParams.push(
                {
                    name: `startDate`,
                    value: startDate.toISOString(),
                },
                {
                    name: "page",
                    value: "1",
                }
            );
            setInputValues((prev) => [
                ...prev,
                `Start Date=${startDate.toLocaleDateString()}`,
            ]);
        }
        if (data[`endDate`]) {
            const endDate = new Date(data[`endDate`]);
            endDate.setHours(23, 59, 59, 999);

            updatedParams.push(
                {
                    name: `endDate`,
                    value: endDate.toISOString(),
                },
                {
                    name: "page",
                    value: "1",
                }
            );
            setInputValues((prev) => [
                ...prev,
                `End Date=${endDate.toLocaleDateString()}`,
            ]);
        }
        setParams(updatedParams);
        reset();
    };

    return (
        <Popover>
            <div className="flex items-center">
                <PopoverTrigger asChild>{filterButton}</PopoverTrigger>
            </div>
            <PopoverContent className="w-[250px] p-0" align="start">
                <form
                    onSubmit={handleSubmit(handleFilter)}
                    className="flex flex-col gap-2 p-4"
                >
                    <DatePicker
                        id={`startDate`}
                        label={`Start Date`}
                        control={control}
                        rules={{ required: false }}
                    />
                    <DatePicker
                        id={`endDate`}
                        label={`End Date`}
                        control={control}
                        rules={{ required: false }}
                    />

                    <PopoverClose asChild>
                        <Button type="submit" size={"xsm"}>
                            <RiFilterLine className="w-4 h-4 mr-1" />
                            Filter
                        </Button>
                    </PopoverClose>
                </form>
            </PopoverContent>
        </Popover>
    );
};

export default FilterByDate;
