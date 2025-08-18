"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetBusStop } from "@/Apis/busStopApi";
import CreateBusStopForm from "@/components/forms/CreateBusStopForm";

export default function EditBusStopPage() {
    const router = useRouter();
    const params = useParams();
    const id = (params?.id as string) ?? "";

    const { data, isLoading } = useGetBusStop(id);
    const busStop = data?.data;

    useEffect(() => {
        if (!id) router.push("/dashboard/bus-stops");
    }, [id, router]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Edit Bus Stop</h2>
                <Button variant="outline" onClick={() => router.push("/dashboard/bus-stops")}>Back</Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Update details</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="h-36 animate-pulse bg-muted rounded-md" />
                    ) : (
                        <CreateBusStopForm
                            busStop={busStop}
                            onSuccess={() => router.push("/dashboard/bus-stops")}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
