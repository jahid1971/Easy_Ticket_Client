"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Bus, Image, Settings } from "lucide-react";
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
import C_FormProvider from "@/components/ui/C_FormProvider";
import SeatMapEditor from "@/components/dashboard/SeatMapEditor";

import { TBusCreateInput } from "@/types/Bus";
import { modifyPayload } from "@/utils/modifyPayload";
import { busCreateSchema, busUpdateSchema } from "@/utils/validations/validationSchemas";

type Props = {
    // accept either create input shape or existing TBus partial when editing
    defaultValues?: Partial<TBusCreateInput> | Partial<any>;
    onSubmit: (data: TBusCreateInput | FormData) => Promise<void> | void;
    submitLabel?: string;
    submitting?: boolean;
    onCancel?: () => void;
    routeOptions?: { value: string; label: string }[];
    isEdit?: boolean;
};

const BusForm: React.FC<Props> = ({
    defaultValues,
    onSubmit,
    submitLabel = "Create Bus",
    submitting = false,
    onCancel,
    routeOptions = [],
    isEdit = false,
}) => {
    const [seatMapData, setSeatMapData] = useState(
        (defaultValues?.seatMap as any)
            ? { ...(defaultValues?.seatMap as any), spaceAfterColumn: String((defaultValues as any)?.seatMap?.spaceAfterColumn ?? (defaultValues as any)?.seatMap?.spaceAfterColumn ?? "2") }
            : { layout: [], spaceAfterColumn: "2" }
    );
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

    const formDefaultValues = {
        name: defaultValues?.name ?? "",
        operator: defaultValues?.operator ?? "",
        registrationNumber: defaultValues?.registrationNumber ?? "",
        seatMap: (defaultValues?.seatMap as any)
            ? { ...(defaultValues?.seatMap as any), spaceAfterColumn: String((defaultValues as any)?.seatMap?.spaceAfterColumn ?? seatMapData.spaceAfterColumn ?? "2") }
            : seatMapData,
        routeId: defaultValues?.routeId ?? "no-route",
    };

    const validationSchema = isEdit ? busUpdateSchema : busCreateSchema;

    const onSeatMapChange = (newSeatMap: any) => {
    setSeatMapData({ ...newSeatMap, spaceAfterColumn: String(newSeatMap?.spaceAfterColumn ?? "2") });
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setCoverImageFile(file);
    };

    const handleFormSubmit = async (data: TBusCreateInput) => {
        // Normalize seatMap.spaceAfterColumn to number

      
        const normalizedSeatMap = {
            ...seatMapData,
            spaceAfterColumn: Number(data?.seatMap?.spaceAfterColumn) || 2,
        };

        const payloadObj: any = {
            name: data.name,
            operator: data.operator,
            registrationNumber: data.registrationNumber,
            seatMap: normalizedSeatMap,
        };
        
        if (data.routeId && data.routeId !== "no-route") {
            payloadObj.routeId = data.routeId;
        }
       
        payloadObj.file = coverImageFile ?? null;

        const fd = modifyPayload(payloadObj);
        await onSubmit(fd);
    };

    return (
        <C_FormProvider 
            defaultValues={formDefaultValues}
            onSubmit={handleFormSubmit as any}
            resolver={zodResolver(validationSchema)}
            className="space-y-6"
        >
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bus className="h-5 w-5" />
                                Bus Information
                            </CardTitle>
                            <CardDescription>
                                Enter the basic details for the bus
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <C_Input
                                id="name"
                                label="Bus Name"
                                placeholder="e.g., Express AC, Deluxe Service"
                                required
                            />

                            <div className="grid gap-4 md:grid-cols-2">
                                <C_Input
                                    id="operator"
                                    label="Operator"
                                    placeholder="e.g., Green Line, Shohag Paribahan"
                                    required
                                />
                                <C_Input
                                    id="registrationNumber"
                                    label="Registration Number"
                                    placeholder="e.g., DHA-123456"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <SeatMapEditor
                        seatMap={seatMapData}
                        onChange={onSeatMapChange}
                    />
                </div>

                <div className="space-y-6">
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
                                options={[{ value: "no-route", label: "No Route Assigned" }, ...routeOptions]}
                                defaultValue="no-route"
                                placeholder="Select a route"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Image className="h-5 w-5" />
                                Bus Logo
                            </CardTitle>
                            <CardDescription>
                                Upload a cover image for the bus (optional)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <Image className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">
                                    Upload a cover image for the bus (optional)
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onFileChange}
                                    className="mt-3 mx-auto"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {submitting ? `${submitLabel}...` : submitLabel}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    disabled={submitting}
                                    className="w-full"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </C_FormProvider>
    );
};

export default BusForm;
