"use client";
import { useForm } from "react-hook-form";
import { DatePicker } from "@/components/ui/DatePicker";
import { LocationCombobox } from "@/components/ui/LocationCombobox";
import { useRouter } from "next/navigation";
import { useGetBusRoute, useGetBusRoutes } from "@/Apis/busRouteApi";
import { TRoute } from "@/types/Route";
import { useMemo } from "react";


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
                <LocationCombobox
                    id="from"
                    label="Going From"
                    placeholder="City or terminal"
                    options={sourceData}
                    control={control}
                    required
                    disabled={disabled}
                />
                <LocationCombobox
                    id="to"
                    label="Going To"
                    placeholder="City or terminal"
                    options={[]}
                    control={control}
                    required
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
