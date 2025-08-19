"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import BusForm from "@/components/forms/BusForm";
import { useGetBus, useUpdateBus } from "@/Apis/busApi";
import { useGetBusRoutes } from "@/Apis/busRouteApi";
import tryCatch from "@/utils/tryCatch";
import { TBus } from "@/types/Bus";
import LoadingPage from "@/components/ui/LoadingPage";

const EditBusPage = () => {
    const router = useRouter();
    const routeParams = useParams?.();
    const busId = routeParams?.id as string;

    const { data: busData, isLoading: isBusLoading } = useGetBus(busId);
    const { data: routesData } = useGetBusRoutes();
    const updateBusMutation = useUpdateBus();

    const routeOptions =
        routesData?.data?.map((route) => ({
            value: route.id,
            label: route.routeName || `${route.source} - ${route.destination}`,
        })) || [];

    const onSubmit = async (data: Partial<TBus>) => {
        if (!busId) return;
        await tryCatch(
            async () =>
                await updateBusMutation.mutateAsync({ id: busId, data }),
            "Updating bus",
            "Bus updated successfully"
            // () => router.push("/dashboard/buses")
        );
    };

    if (isBusLoading) {
        return null;
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
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/buses">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Buses
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Edit className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Edit Bus
                        </h2>
                        <p className="text-muted-foreground">
                            Update bus details
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl">
                <BusForm
                    defaultValues={busData.data as Partial<TBus>}
                    onSubmit={onSubmit as any}
                    submitLabel="Update Bus"
                    submitting={updateBusMutation.isPending}
                    routeOptions={routeOptions}
                    onCancel={() => router.push("/dashboard/buses")}
                />
            </div>
        </div>
    );
};

export default EditBusPage;
