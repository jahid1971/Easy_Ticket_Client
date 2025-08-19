"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bus } from "lucide-react";
import { useCreateBus } from "@/Apis/busApi";
import { useGetBusRoutes } from "@/Apis/busRouteApi";
import tryCatch from "@/utils/tryCatch";
import BusForm from "@/components/forms/BusForm";
import { BusCreateInput } from "@/types/Bus";

const CreateBusPage = () => {
    const router = useRouter();

    const createBusMutation = useCreateBus();
    const { data: routesData } = useGetBusRoutes();

    const routeOptions =
        routesData?.data?.map((route) => ({
            value: route.id,
            label: route.routeName || `${route.source} - ${route.destination}`,
        })) || [];

    const onSubmit = async (data: BusCreateInput | FormData) => {
        await tryCatch(
            async () => await createBusMutation.mutateAsync(data as any),
            "Creating bus",
            "Bus created successfully!",
            () => router.push("/dashboard/buses")
        );
    };

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
                        <Bus className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Create Bus
                        </h2>
                        <p className="text-muted-foreground">
                            Add a new bus to your fleet
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl">
                <BusForm
                    onSubmit={onSubmit}
                    submitLabel="Create Bus"
                    routeOptions={routeOptions}
                    submitting={createBusMutation.isPending}
                    onCancel={() => router.push("/dashboard/buses")}
                />
            </div>
        </div>
    );
};

export default CreateBusPage;
