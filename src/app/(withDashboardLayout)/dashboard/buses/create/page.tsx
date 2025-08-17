"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Bus, Image, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { C_Input } from "@/components/ui/C_Input";
import CustomSelect from "@/components/ui/C_Select";
import { Label } from "@/components/ui/label";
import { useCreateBus } from "@/Apis/busApi";
import { useGetBusRoutes } from "@/Apis/busRouteApi";
import { BusCreateInput } from "@/types/Bus";
import { useRouter } from "next/navigation";
import Link from "next/link";
import tryCatch from "@/utils/tryCatch";
import { busCreateSchema } from "@/utils/validationSchemas";
import SeatMapEditor from "@/components/dashboard/SeatMapEditor";
import { useState } from "react";

type BusFormData = z.infer<typeof busCreateSchema>;

const CreateBusPage = () => {
    const router = useRouter();
    const [seatMapData, setSeatMapData] = useState({
        layout: [],
        columnPosition: {
            leftSide: [0, 1],
            rightSide: [2, 3],
        },
    });
    
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm<BusFormData>({
        resolver: zodResolver(busCreateSchema),
        defaultValues: {
            name: "",
            operator: "",
            registrationNumber: "",
            seatMap: seatMapData,
            routeId: "",
        },
    });
    
    const createBusMutation = useCreateBus();
    const { data: routesData } = useGetBusRoutes();

    const routeOptions = routesData?.data?.map((route) => ({
        value: route.id,
        label: route.routeName || `${route.source} - ${route.destination}`,
    })) || [];

    const onSeatMapChange = (newSeatMap: any) => {
        setSeatMapData(newSeatMap);
        setValue("seatMap", newSeatMap);
    };

    const onSubmit = async (data: BusFormData) => {
        await tryCatch(
            async () => {
                const busData: BusCreateInput = {
                    name: data.name,
                    operator: data.operator,
                    registrationNumber: data.registrationNumber,
                    seatMap: data.seatMap,
                    routeId: data.routeId || undefined,
                };
                
                return createBusMutation.mutateAsync(busData);
            },
            "Creating bus",
            "Bus created successfully!",
            () => router.push("/dashboard/buses")
        );
    };

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
                        <h2 className="text-3xl font-bold tracking-tight">Create Bus</h2>
                        <p className="text-muted-foreground">
                            Add a new bus to your fleet
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
                                        Enter the basic details for the new bus
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
                                        required
                                    />

                                    {/* Operator & Registration */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <C_Input
                                            id="operator"
                                            label="Operator"
                                            placeholder="e.g., Green Line, Shohag Paribahan"
                                            control={control}
                                            error={errors.operator}
                                            required
                                        />
                                        <C_Input
                                            id="registrationNumber"
                                            label="Registration Number"
                                            placeholder="e.g., DHA-123456"
                                            control={control}
                                            error={errors.registrationNumber}
                                            required
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
                                        defaultValue=""
                                    />
                                </CardContent>
                            </Card>

                            {/* Image Upload (Future Enhancement) */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Image className="h-5 w-5" />
                                        Bus Image
                                    </CardTitle>
                                    <CardDescription>
                                        Upload a cover image for the bus (coming soon)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-2 text-sm text-gray-600">
                                            Image upload functionality coming soon
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-3">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || createBusMutation.isPending}
                                            className="w-full"
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            {isSubmitting || createBusMutation.isPending
                                                ? "Creating Bus..."
                                                : "Create Bus"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push("/dashboard/buses")}
                                            disabled={isSubmitting || createBusMutation.isPending}
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

export default CreateBusPage;