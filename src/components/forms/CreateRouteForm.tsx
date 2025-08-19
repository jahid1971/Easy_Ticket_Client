"use client";

import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { C_Input } from "@/components/ui/C_Input";
import CustomSelect from "@/components/ui/C_Select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBusRoute, useUpdateBusRoute } from "@/Apis/busRouteApi";
import { TRoute } from "@/types/Route";
import { useBulkCreateRouteStops } from "@/Apis/routeStopApi";
import { RouteCreateInput } from "@/types/Route";
import { useRouter } from "next/navigation";
import tryCatch from "@/utils/tryCatch";
import { routeCreateSchema } from "@/utils/validations/validationSchemas";
import RouteStopsField from "./RouteStopsField";
import { buildPatchFromDirty } from "@/utils/modifyPayload";
type RouteFormData = z.infer<typeof routeCreateSchema>;

interface CreateRouteFormProps {
    route?: TRoute;
    onSuccess?: () => void;
}

export default function CreateRouteForm({
    route,
}: CreateRouteFormProps) {
    const router = useRouter();

    const isEditing = !!route;

    const initialRouteStops =
        route?.routeStops?.map((rs) => ({
            busStopId: rs.busStopId,
            order: rs.order,
            stopType: rs.stopType,
        })) || [];

    const {
        control,
        handleSubmit,
        register,
        formState: { errors, isSubmitting, dirtyFields },
        reset,
    } = useForm<RouteFormData>({
        resolver: zodResolver(routeCreateSchema),
        defaultValues: {
            routeName: route?.routeName || "",
            source: route?.source || "",
            destination: route?.destination || "",
            distance: route?.distance?.toString() || "",
            description: route?.description || "",
            status: route?.status || "ACTIVE",
            routeStops: initialRouteStops,
        },
    });

    // Reset form when route data is available (for edit mode)
    useEffect(() => {
        if (route) {
            reset({
                routeName: route.routeName || "",
                source: route.source || "",
                destination: route.destination || "",
                distance: route.distance?.toString() || "",
                description: route.description || "",
                status: route.status || "ACTIVE",
                routeStops: route.routeStops?.map((rs) => ({
                    busStopId: rs.busStopId,
                    order: rs.order,
                    stopType: rs.stopType,
                })) || [],
            });
        }
    }, [route, reset]);

    const createRouteMutation = useCreateBusRoute();
    const updateRouteMutation = useUpdateBusRoute();

    const onSubmit: SubmitHandler<RouteFormData> = async (data) => {
        await tryCatch(
            async () => {
                const routeData: any = {
                    source: data.source,
                    destination: data.destination,
                    distance: Number(data.distance),
                    status: (data.status as any) || undefined,
                };

                if (data.routeName?.trim()) {
                    routeData.routeName = data.routeName;
                }
                if (data.description?.trim()) {
                    routeData.description = data.description;
                }

                if (isEditing && route?.id) {
                    const patch = buildPatchFromDirty(data, dirtyFields as any);
                    if (patch.distance !== undefined)
                        patch.distance = Number(patch.distance);

                    console.log("patch ------------------", patch);

                    if (Object.keys(patch).length === 0) {
                        return null;
                    }

                    return await updateRouteMutation.mutateAsync({
                        id: route.id,
                        data: patch,
                    });
                }

                // Create the route first
                const createdRoute = await createRouteMutation.mutateAsync(
                    routeData
                );

                return createdRoute;
            },
            isEditing ? "Updating route" : "Creating route",
            isEditing
                ? "Route updated successfully!"
                : "Route created successfully!",
            () => {
                reset();
                // if (isEditing) {
                //     // onSuccess?.();
                   
                // } else {
                //     router.push("/dashboard/routes");
                // }
            }
        );
    };

    return (
        <div className="max-w-6xl px-4 md:px-6 lg:px-8 mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Route Information
                                </CardTitle>
                                <CardDescription>
                                    Enter the basic details for the bus
                                    route
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <C_Input
                                    id="routeName"
                                    label="Route Name"
                                    placeholder="e.g., Express Route 1, Highway Express"
                                    control={control}
                                    error={errors.routeName}
                                />

                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                    <C_Input
                                        id="source"
                                        label="Source"
                                        placeholder="e.g., Dhaka, Chittagong"
                                        control={control}
                                        error={errors.source}
                                        required
                                    />
                                    <C_Input
                                        id="destination"
                                        label="Destination"
                                        placeholder="e.g., Sylhet, Cox's Bazar"
                                        control={control}
                                        error={errors.destination}
                                        required
                                    />
                                </div>

                                <div className="max-w-md w-full">
                                    <C_Input
                                        id="distance"
                                        label="Distance (kilometers)"
                                        type="number"
                                        placeholder="0"
                                        control={control}
                                        error={errors.distance}
                                        required
                                        rules={{
                                            valueAsNumber: true,
                                            min: {
                                                value: 0.1,
                                                message:
                                                    "Distance must be greater than 0",
                                            },
                                        }}
                                    />
                                </div>

                                <div>
                                    <Label
                                        htmlFor="description"
                                        className="block mb-1 text-sm font-medium"
                                    >
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Enter route description, special notes, or important information..."
                                        rows={4}
                                        className="resize-none"
                                        {...register("description")}
                                    />
                                    {errors.description && (
                                        <small className="text-destructive block mt-1">
                                            {errors.description.message}
                                        </small>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Route Stops */}
                        <RouteStopsField control={control} name="routeStops" />
                    </div>

                    <div className="space-y-6 lg:sticky lg:top-20">
                        <Card>
                            <CardHeader>
                                <CardTitle>Route Status</CardTitle>
                                <CardDescription>
                                    Set the initial status for this route
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CustomSelect
                                    id="status"
                                    label="Status"
                                    control={control}
                                    options={[
                                        { value: "ACTIVE", label: "Active" },
                                        {
                                            value: "INACTIVE",
                                            label: "Inactive",
                                        },
                                    ]}
                                    defaultValue="ACTIVE"
                                    required
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    <Button
                                        type="submit"
                                        disabled={
                                            isSubmitting ||
                                            createRouteMutation.isPending ||
                                            updateRouteMutation.isPending
                                        }
                                        className="w-full"
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {isSubmitting ||
                                        createRouteMutation.isPending ||
                                        updateRouteMutation.isPending
                                            ? isEditing
                                                ? "Updating Route..."
                                                : "Creating Route..."
                                            : isEditing
                                            ? "Update Route"
                                            : "Create Route"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            router.push("/dashboard/routes")
                                        }
                                        disabled={
                                            isSubmitting ||
                                            createRouteMutation.isPending
                                        }
                                        className="w-full"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
