"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Bus, Image, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { C_Input } from "@/components/ui/C_Input";
import CustomSelect from "@/components/ui/C_Select";
import { useGetBus, useUpdateBus } from "@/Apis/busApi";
import { useGetBusRoutes } from "@/Apis/busRouteApi";
import { BusUpdateInput } from "@/types/Bus";
import { useRouter } from "next/navigation";
import Link from "next/link";
import tryCatch from "@/utils/tryCatch";
import { busUpdateSchema } from "@/utils/validationSchemas";
import SeatMapEditor from "@/components/dashboard/SeatMapEditor";
import { useState, useEffect } from "react";

type BusUpdateFormData = z.infer<typeof busUpdateSchema>;

interface EditBusPageProps {
    params: {
        id: string;
    };
}

const EditBusPage = ({ params }: EditBusPageProps) => {
    const router = useRouter();
    const busId = params.id;
    
    const [seatMapData, setSeatMapData] = useState({
        layout: [],
        columnPosition: {
            leftSide: [0, 1],
            rightSide: [2, 3],
        },
    });
    
    const { data: busData, isLoading: isBusLoading } = useGetBus(busId);
    const { data: routesData } = useGetBusRoutes();
    const updateBusMutation = useUpdateBus();
    
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset,
    } = useForm<BusUpdateFormData>({
        resolver: zodResolver(busUpdateSchema),
    });

    // Reset form when bus data loads
    useEffect(() => {
        if (busData?.data) {
            const bus = busData.data;
            reset({
                name: bus.name,
                operator: bus.operator,
                registrationNumber: bus.registrationNumber,
                routeId: bus.routeId || "",
                seatMap: bus.seatMap,
            });
            setSeatMapData(bus.seatMap);
        }
    }, [busData?.data, reset]);

    const routeOptions = routesData?.data?.map((route) => ({
        value: route.id,
        label: route.routeName || `${route.source} - ${route.destination}`,
    })) || [];

    const onSeatMapChange = (newSeatMap: any) => {
        setSeatMapData(newSeatMap);
        setValue("seatMap", newSeatMap);
    };

    const onSubmit = async (data: BusUpdateFormData) => {
        await tryCatch(
            async () => {
                const updateData: BusUpdateInput = {};
                
                // Only include fields that have changed
                if (data.name) updateData.name = data.name;
                if (data.operator) updateData.operator = data.operator;
                if (data.registrationNumber) updateData.registrationNumber = data.registrationNumber;
                if (data.seatMap) updateData.seatMap = data.seatMap;
                if (data.routeId !== undefined) updateData.routeId = data.routeId || undefined;
                
                return updateBusMutation.mutateAsync({ id: busId, data: updateData });
            },
            "Updating bus",
            "Bus updated successfully!",
            () => router.push("/dashboard/buses")
        );
    };

    if (isBusLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Loading bus details...</div>
            </div>
        );
    }

    if (!busData?.data) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-destructive">Bus not found</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/buses">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Buses
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Bus className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Edit Bus</h2>
                        <p className="text-muted-foreground">
                            Update bus information and configuration
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-6xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Information Cards */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bus className="h-5 w-5" />
                                        Bus Information
                                    </CardTitle>
                                    <CardDescription>
                                        Update the basic details for this bus
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Bus Name */}
                                    <C_Input
                                        id="name"
                                        label="Bus Name"
                                        placeholder="e.g., Express AC, Deluxe Service"
                                        control={control}
                                        error={errors.name}
                                    />

                                    {/* Operator & Registration */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <C_Input
                                            id="operator"
                                            label="Operator"
                                            placeholder="e.g., Green Line, Shohag Paribahan"
                                            control={control}
                                            error={errors.operator}
                                        />
                                        <C_Input
                                            id="registrationNumber"
                                            label="Registration Number"
                                            placeholder="e.g., DHA-123456"
                                            control={control}
                                            error={errors.registrationNumber}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Seat Map Configuration */}
                            <SeatMapEditor
                                seatMap={seatMapData}
                                onChange={onSeatMapChange}
                                error={errors.seatMap?.message}
                            />
                        </div>

                        {/* Route Assignment & Actions */}
                        <div className="space-y-6">
                            {/* Route Assignment */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Settings className="h-5 w-5" />
                                        Route Assignment
                                    </CardTitle>
                                    <CardDescription>
                                        Assign this bus to a route (optional)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <CustomSelect
                                        id="routeId"
                                        label="Route"
                                        control={control}
                                        options={[
                                            { value: "", label: "No Route Assigned" },
                                            ...routeOptions,
                                        ]}
                                    />
                                </CardContent>
                            </Card>

                            {/* Current Image Preview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Image className="h-5 w-5" />
                                        Bus Image
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {busData.data.coverImageUrl ? (
                                        <div className="space-y-4">
                                            <img
                                                src={busData.data.coverImageUrl}
                                                alt={busData.data.name}
                                                className="w-full h-32 object-cover rounded-lg border"
                                            />
                                            <p className="text-sm text-gray-600">
                                                Current bus image
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <Image className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-600">
                                                No image uploaded
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-3">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || updateBusMutation.isPending}
                                            className="w-full"
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            {isSubmitting || updateBusMutation.isPending
                                                ? "Updating Bus..."
                                                : "Update Bus"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push("/dashboard/buses")}
                                            disabled={isSubmitting || updateBusMutation.isPending}
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
        </div>
    );
};

export default EditBusPage;