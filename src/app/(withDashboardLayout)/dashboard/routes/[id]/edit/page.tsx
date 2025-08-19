"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

import { useGetBusRoute } from "@/Apis/busRouteApi";

import Link from "next/link";
import { ArrowLeft, Route as RouteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateRouteForm from "@/components/forms/CreateRouteForm";

export default function EditRoutePage() {
    const router = useRouter();
    const params = useParams();
    const id = (params?.id as string) ?? "";

    const { data, isLoading } = useGetBusRoute(id);
    const route = data?.data;

    useEffect(() => {
        if (!id) router.push("/dashboard/routes");
    }, [id, router]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/routes">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Routes
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <RouteIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Update Route
                        </h2>
                    </div>
                </div>
            </div>

            {/* Form */}
            {isLoading ? (
                <div className="h-36 animate-pulse bg-muted rounded-md" />
            ) : (
                <CreateRouteForm route={route} />
            )}
        </div>
    );
}
