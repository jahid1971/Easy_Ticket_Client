"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { C_Input } from "@/components/ui/C_Input";
import CustomSelect from "@/components/ui/C_Select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBusRoute } from "@/Apis/busRouteApi";
import { RouteCreateInput } from "@/types/Route";
import { useRouter } from "next/navigation";
import tryCatch from "@/utils/tryCatch";
import { routeCreateSchema } from "@/utils/validations/validationSchemas";

type RouteFormData = z.infer<typeof routeCreateSchema>;

export default function CreateRouteForm() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<RouteFormData>({
        resolver: zodResolver(routeCreateSchema),
        defaultValues: {
            routeName: "",
            source: "",
            destination: "",
            distance: "",
            description: "",
            status: "ACTIVE",
        },
    });

    const createRouteMutation = useCreateBusRoute();

    const onSubmit = async (data: RouteFormData) => {
        await tryCatch(
            async () => {
                const routeData: RouteCreateInput = {
                    source: data.source,
                    destination: data.destination,
                    distance: Number(data.distance),
                    status: (data.status as any) || undefined,
                };

                if (data.routeName?.trim()) {
                    (routeData as any).routeName = data.routeName;
                }
                if (data.description?.trim()) {
                    (routeData as any).description = data.description;
                }

                return createRouteMutation.mutateAsync(routeData);
            },
            "Creating route",
            "Route created successfully!",
            () => router.push("/dashboard/routes")
        );
    };

    return (
        <div className="max-w-4xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Route Information
                                </CardTitle>
                                <CardDescription>
                                    Enter the basic details for the new bus route
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

                                <div className="grid gap-4 md:grid-cols-2">
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

                                <div className="max-w-md">
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
                                            min: { value: 0.1, message: "Distance must be greater than 0" }
                                        }}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description" className="block mb-1 text-sm font-medium">
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
                    </div>

                    <div className="space-y-6">
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
                                        { value: "INACTIVE", label: "Inactive" }
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
                                        disabled={isSubmitting || createRouteMutation.isPending}
                                        className="w-full"
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {isSubmitting || createRouteMutation.isPending
                                            ? "Creating Route..."
                                            : "Create Route"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push("/dashboard/routes")}
                                        disabled={isSubmitting || createRouteMutation.isPending}
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
