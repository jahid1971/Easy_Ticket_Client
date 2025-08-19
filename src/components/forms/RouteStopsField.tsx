"use client";

import React, { useState, useMemo } from "react";
import { Control, useController, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowUp, ArrowDown, MapPin } from "lucide-react";
import { useGetBusStops } from "@/Apis/busStopApi";
import { StopType } from "@/types/RouteStop";
import CustomSelect from "../ui/C_Select";
import { C_Combobox } from "../ui/C_Combobox";

type Props = {
    control: Control<any>;
    name?: string;
};

type RouteStopItem = {
    busStopId: string;
    order: number;
    stopType: StopType;
};

const RouteStopsField: React.FC<Props> = ({ control, name = "routeStops" }) => {
    const { field } = useController({
        name,
        control,
        defaultValue: [],
    });

    const { data: stopsData } = useGetBusStops({
        searchTerm: "",
        sortBy: "name",
        sortOrder: "asc",
    });

    const stops = stopsData?.data || [];
    const [selectedStop, setSelectedStop] = useState<string>("");

    // Watch the routeStops array from the parent form so default values on edit are respected
    const routeStops: RouteStopItem[] =
        useWatch({ control, name, defaultValue: [] }) || [];

    // Watch the stopType select value (top-level form field) so we can use it when adding a stop
    const watchedStopType: StopType =
        useWatch({ control, name: "stopType", defaultValue: "BOARDING" }) ||
        "BOARDING";

    const availableStops = stops?.filter(
        (stop: any) =>
            !routeStops.some(
                (routeStop: RouteStopItem) => routeStop.busStopId === stop.id
            )
    );

    const addStop = () => {
        if (!selectedStop) return;

        const newStop: RouteStopItem = {
            busStopId: selectedStop,
            order: routeStops.length + 1,
            stopType: watchedStopType,
        };

        field.onChange([...routeStops, newStop]);
        setSelectedStop("");
    };

    const removeStop = (index: number) => {
        const newStops = [...routeStops];
        newStops.splice(index, 1);
        const reorderedStops = newStops.map((stop, i) => ({
            ...stop,
            order: i + 1,
        }));
        field.onChange(reorderedStops);
    };

    const moveStop = (from: number, to: number) => {
        if (to < 0 || to >= routeStops.length) return;
        const newStops = [...routeStops];
        const [movedStop] = newStops.splice(from, 1);
        newStops.splice(to, 0, movedStop);
        const reorderedStops = newStops.map((stop, i) => ({
            ...stop,
            order: i + 1,
        }));
        field.onChange(reorderedStops);
    };

    const updateStopType = (index: number, newType: StopType) => {
        const newStops = [...routeStops];
        newStops[index] = { ...newStops[index], stopType: newType };
        field.onChange(newStops);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Route Stops
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add new stop section - Using native HTML selects */}
                <div className="lg:flex gap-2 space-y-2">
                    <C_Combobox
                        id="busStop"
                        control={control}
                        onChange={setSelectedStop}
                        options={availableStops.map((stop: any) => ({
                            label: `${stop.name}${
                                stop.city ? ` — ${stop.city}` : ""
                            }`,
                            value: stop.id,
                        }))}
                        placeholder="Select bus stop"
                        className="flex-1"
                    />

                    <CustomSelect
                        control={control}
                        id="stopType"
                        options={[
                            { label: "BOARDING", value: "BOARDING" },
                            { label: "DROPPING", value: "DROPPING" },
                        ]}
                        label="Stop Type"
                    />

                    <Button onClick={addStop} disabled={!selectedStop}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {/* Route stops list */}
                <div className="space-y-2">
                    {routeStops.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No stops added yet</p>
                            <p className="text-sm">
                                Add stops to define the route
                            </p>
                        </div>
                    ) : (
                        routeStops.map((routeStop, idx) => {
                            console.log("routeStop inside map ", routeStop);
                            const stop = stops?.find(
                                (s: any) => s.id === routeStop.busStopId
                            );

                            return (
                                <div
                                    key={`route-stop-${idx}`}
                                    className="flex flex-col md:flex-row md:items-center gap-2 p-3 border rounded-lg bg-card"
                                >
                                    {/* Order number */}
                                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-medium">
                                        {idx + 1}
                                    </div>

                                    {/* Stop info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">
                                            {stop?.name ||
                                                `Stop ${routeStop.busStopId}`}
                                        </div>
                                        {stop?.city && (
                                            <div className="text-sm text-muted-foreground truncate">
                                                {stop.city}
                                            </div>
                                        )}
                                    </div>

                                    {/* Stop type - editable with native select */}
                                    <div className="mt-2 md:mt-0 md:ml-2 flex items-center gap-2">
                                        <CustomSelect
                                            control={control}
                                            id={`routeStops.${idx}.stopType`}
                                            options={[
                                                {
                                                    label: "BOARDING",
                                                    value: "BOARDING",
                                                },
                                                {
                                                    label: "DROPPING",
                                                    value: "DROPPING",
                                                },
                                            ]}
                                            label="Stop Type"
                                        />

                                        {/* Actions */}
                                        <div className="flex gap-1 ml-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    moveStop(idx, idx - 1)
                                                }
                                                disabled={idx === 0}
                                                type="button"
                                            >
                                                <ArrowUp className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    moveStop(idx, idx + 1)
                                                }
                                                disabled={
                                                    idx ===
                                                    routeStops.length - 1
                                                }
                                                type="button"
                                            >
                                                <ArrowDown className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeStop(idx)}
                                                type="button"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Summary */}
                {routeStops.length > 0 && (
                    <div className="text-sm text-muted-foreground border-t pt-4">
                        <div className="flex justify-between">
                            <span>
                                {routeStops.length} stop
                                {routeStops.length !== 1 ? "s" : ""} added
                            </span>
                            <span>
                                {
                                    routeStops.filter(
                                        (s) => s.stopType === "BOARDING"
                                    ).length
                                }{" "}
                                boarding,{" "}
                                {
                                    routeStops.filter(
                                        (s) => s.stopType === "DROPPING"
                                    ).length
                                }{" "}
                                dropping
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RouteStopsField;
