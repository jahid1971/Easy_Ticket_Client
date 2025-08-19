"use client";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@/components/ui/DatePicker";

import { useRouter } from "next/navigation";
import { useGetBusRoute, useGetBusRoutes } from "@/Apis/busRouteApi";
import { TRoute } from "@/types/Route";
import { useMemo } from "react";
import { C_Combobox } from "../ui/C_Combobox";


export type SearchFormValues = {
    from: string;
    to: string;
    journeyDate: string;
    returnDate?: string;
};

export function SearchForm({
    mode,
    disabled,
}: {
    mode: "bus" | "ship" | "hotel";
    disabled?: boolean;
}) {
    const router = useRouter();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SearchFormValues>();


  
    const { data:busRoutes } = useGetBusRoutes({});

    const sourceData = useMemo(() => {
        return busRoutes?.data?.map((d) => ({
            key: d?.id,
            value: d?.id,
            label: d?.source || ""
        })) ?? [];
    }, [busRoutes]);
   



    const onSubmit = (data: SearchFormValues) => {
        // Example: redirect to search results with query params
        console.log(data, "form submitted-------------------");
        // router.push(
        //     `/search?mode=${mode}&from=${data.from}&to=${data.to}&journeyDate=${data.journeyDate}`
        // );
    };

    return (
        <form id="hero-search-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <C_Combobox
                    id="from"
                    label="Going From"
                    options={sourceData}
                    control={control}
                    required={true}
                    placeholder="City or terminal"
                    className="w-full"
                    disabled={disabled}
                />
                <C_Combobox
                    id="to"
                    label="Going To"
                    options={[]}
                    control={control}
                    required={true}
                    placeholder="City or terminal"
                    className="w-full"
                    disabled={disabled}
                />
                <DatePicker
                    name="journeyDate"
                    label="Journey Date"
                    control={control}
                    rules={{ required: "Journey date is required" }}
                    disabled={disabled}
                />
            </div>
        </form>
    );
}
