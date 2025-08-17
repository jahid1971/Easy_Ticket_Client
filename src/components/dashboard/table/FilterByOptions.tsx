/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { RiFilterLine } from "react-icons/ri";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";
import { TQueryParam } from "@/types/global.types";
import { updateParam } from "@/utls/utls";

interface FilterItem {
    value: string;
    label: string;
}

interface FilterByProps {
    title: string;
    filterItems: FilterItem[];
    filterBy: string;
    params: TQueryParam[];
    setParams: React.Dispatch<React.SetStateAction<TQueryParam[]>>;
}

const FilterByOptions: React.FC<FilterByProps> = ({
    title,
    filterItems,
    filterBy,
    params,
    setParams,
}) => {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    useEffect(() => {
        const currentSelectedValues = params.filter(
            (param) => param.name === filterBy
        );
        const newSelectedValues = currentSelectedValues.map(
            (param) => param.value
        );
        setSelectedValues(newSelectedValues as any);
    }, [params, filterBy]);

    const handleOnSelect = (filterItem: FilterItem) => {
        const updatedValues = [...selectedValues];
        let updatedParams = [...params];

        if (selectedValues.includes(filterItem.value)) {
            const optionIndex = updatedValues.indexOf(filterItem.value);
            updatedValues.splice(optionIndex, 1);
            const paramIndex = params.findIndex(
                (param) => param.value === filterItem.value
            );
            updatedParams.splice(paramIndex, 1);
        } else {
            updatedValues.push(filterItem.value);
            updatedParams.push({ name: filterBy, value: filterItem.value });
        }
        // const hasOtherQueryParams = updatedParams.some(
        //     (param) => !["limit", "page"].includes(param.name)
        // );

        // if (hasOtherQueryParams) {
        //     updatedParams = updateParam(updatedParams, "page", 1);
        // } // Reset page to 1 when filter is applied
        updatedParams = updateParam(updatedParams, "page", 1);

        setParams(updatedParams);
        setSelectedValues(updatedValues);
    };

    const selectedValuesLength = selectedValues.length;

    const filterButton = (
        <Button
            variant={
                params?.find((param) => param.name === filterBy)
                    ? "default"
                    : "outline_primary"
            }
            className=" border-dashed"
            size={"xsm"}
        >
            <RiFilterLine className="w-4 h-4 mr-1" />
            <span className="pr-0.5">{title}</span>
            {selectedValuesLength > 0 &&
                (selectedValuesLength < 3 ? (
                    <div className="space-x-1 lg:flex">
                        {filterItems
                            .filter((option) =>
                                selectedValues.includes(option.value)
                            )
                            .map((option) => (
                                <Badge
                                    variant="secondary"
                                    key={option.value}
                                    className="px-1 font-normal rounded-sm"
                                >
                                    {option.label}
                                </Badge>
                            ))}
                    </div>
                ) : (
                    <Badge
                        variant="secondary"
                        className="px-1 font-normal rounded-sm"
                    >
                        {selectedValuesLength + ` items selected`}
                    </Badge>
                ))}
        </Button>
    );

    return (
        <Popover>
            <div className="flex items-center">
                <PopoverTrigger asChild>{filterButton}</PopoverTrigger>
            </div>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandList>
                        <CommandGroup>
                            {filterItems?.map((filterItem) => (
                                <CommandItem
                                    key={filterItem.value}
                                    onSelect={() => handleOnSelect(filterItem)}
                                >
                                    <div className="mr-6 text-lg">
                                        {selectedValues.includes(
                                            filterItem.value
                                        ) ? (
                                            <MdCheckBox />
                                        ) : (
                                            <MdCheckBoxOutlineBlank />
                                        )}
                                    </div>
                                    <span>{filterItem.label}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default FilterByOptions;
