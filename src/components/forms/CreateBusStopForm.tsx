"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { C_Input } from "@/components/ui/C_Input";
import { useCreateBusStop, useUpdateBusStop } from "@/Apis/busStopApi";
import { TBusStop } from "@/types/BusStop";
import tryCatch from "@/utils/tryCatch";

const busStopSchema = z.object({
    name: z.string().min(1, "Bus stop name is required"),
    address: z.string().optional(),
    city: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
});

type BusStopFormData = z.infer<typeof busStopSchema>;

interface CreateBusStopFormProps {
    busStop?: TBusStop;
    onSuccess?: () => void;
}

const CreateBusStopForm: React.FC<CreateBusStopFormProps> = ({
    busStop,
    onSuccess,
}) => {
    const isEditing = !!busStop;

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<BusStopFormData>({
        resolver: zodResolver(busStopSchema),
        defaultValues: {
            name: busStop?.name || "",
            address: busStop?.address || "",
            city: busStop?.city || "",
            latitude: busStop?.latitude?.toString() || "",
            longitude: busStop?.longitude?.toString() || "",
        },
    });

    const createBusStopMutation = useCreateBusStop();
    const updateBusStopMutation = useUpdateBusStop();

    const onSubmit = async (data: BusStopFormData) => {
        const latitude =
            data.latitude && data.latitude.trim() !== ""
                ? parseFloat(data.latitude)
                : undefined;
        const longitude =
            data.longitude && data.longitude.trim() !== ""
                ? parseFloat(data.longitude)
                : undefined;

        await tryCatch(
            async () => {
                if (isEditing) {
                    return await updateBusStopMutation.mutateAsync({
                        id: busStop.id,
                        data: {
                            name: data.name,
                            address: data.address || undefined,
                            city: data.city || undefined,
                            latitude,
                            longitude,
                        },
                    });
                } else {
                    return await createBusStopMutation.mutateAsync({
                        name: data.name,
                        address: data.address || undefined,
                        city: data.city || undefined,
                        latitude,
                        longitude,
                    });
                }
            },
            isEditing ? "Updating bus stop" : "Creating bus stop",
            isEditing
                ? "Bus stop updated successfully!"
                : "Bus stop created successfully!",
            () => {
                reset();
                onSuccess?.();
            }
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <C_Input
                id="name"
                label="Bus Stop Name"
                placeholder="e.g., Central Station, Airport Terminal"
                control={control}
                error={errors.name}
                required
            />

            <C_Input
                id="address"
                label="Address"
                placeholder="e.g., 123 Main St, Downtown"
                control={control}
                error={errors.address}
            />

            <C_Input
                id="city"
                label="City"
                placeholder="e.g., Dhaka, Chittagong"
                control={control}
                error={errors.city}
            />

            <div className="grid grid-cols-2 gap-4">
                <C_Input
                    id="latitude"
                    label="Latitude"
                    type="number"
                    placeholder="e.g., 23.8103"
                    control={control}
                    error={errors.latitude}
                />

                <C_Input
                    id="longitude"
                    label="Longitude"
                    type="number"
                    placeholder="e.g., 90.4125"
                    control={control}
                    error={errors.longitude}
                />
            </div>

            <div className="flex gap-3 pt-4">
                <Button
                    type="submit"
                    disabled={
                        isSubmitting ||
                        createBusStopMutation.isPending ||
                        updateBusStopMutation.isPending
                    }
                    className="flex-1"
                >
                    {isSubmitting ||
                    createBusStopMutation.isPending ||
                    updateBusStopMutation.isPending
                        ? isEditing
                            ? "Updating..."
                            : "Creating..."
                        : isEditing
                        ? "Update Bus Stop"
                        : "Create Bus Stop"}
                </Button>
            </div>
        </form>
    );
};

export default CreateBusStopForm;
