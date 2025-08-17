import { Button } from "@/components/ui/button";
import { RiFilterLine } from "react-icons/ri";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { TQueryParam } from "@/types/global.types";

import { Input } from "../../ui/input";
import { useForm } from "react-hook-form";
import { PopoverClose } from "@radix-ui/react-popover";

interface FilterByProps {
    title: string;
    filterBy: string;
    params: TQueryParam[];
    setParams: (params: TQueryParam[]) => void;
}

// const capitalizeFirstLetter = (str: string) => {
//     return str.charAt(0).toUpperCase() + str.slice(1);
// }

const FilterByInput: React.FC<FilterByProps> = ({
    title,
    filterBy,
    params,
    setParams,
}) => {
    const [inputValues, setInputValues] = useState<string[]>([]);
    const { register, handleSubmit, reset } = useForm();
    useEffect(() => {
        if (params.length < 1) setInputValues([]);
    }, [params]);

    const filterButton = (
        <Button variant="outline_primary" className=" border-dashed" size={"xsm"} >
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

    filterBy = filterBy.charAt(0).toUpperCase() + filterBy.slice(1);

    const handleFilter = (data: { [key: string]: string }) => {
        const updatedParams = params.filter(
            (param) =>
                param.name !== `min${filterBy}` &&
                param.name !== `max${filterBy}`
        );
        setInputValues([]);

        if (data[`min${filterBy}`]) {
            updatedParams.push({
                name: `min${filterBy}`,
                value: data[`min${filterBy}`],
            });
            setInputValues((prev) => [
                ...prev,
                `Min-${filterBy}=${data[`min${filterBy}`]}`,
            ]);
        }
        if (data[`max${filterBy}`]) {
            updatedParams.push({
                name: `max${filterBy}`,
                value: data[`max${filterBy}`],
            });
            setInputValues((prev) => [
                ...prev,
                `Max-${filterBy}=${data[`max${filterBy}`]}`,
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
            <PopoverContent className="w-[200px] p-0" align="start">
                <form
                    onSubmit={handleSubmit(handleFilter)}
                    className="flex flex-col "
                >
                    <Input
                        {...register(`min${filterBy}`)}
                        placeholder={`Min ${filterBy}`}
                    />
                    <Input
                        {...register(`max${filterBy}`)}
                        placeholder={`Max ${filterBy}`}
                    />

                    <PopoverClose asChild>
                        <Button
                            type="submit"
                            className=""
                           size={"xsm"}
                        >
                            <RiFilterLine className="w-4 h-4 mr-1" />
                            Filter
                        </Button>
                    </PopoverClose>
                </form>
            </PopoverContent>
        </Popover>
    );
};

export default FilterByInput;
