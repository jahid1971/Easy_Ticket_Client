"use client";

import { ArrowLeft, Edit, Bus, MapPin, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetBus } from "@/Apis/busApi";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BusDetailsPageProps {
    params: {
        id: string;
    };
}

const BusDetailsPage = ({ params }: BusDetailsPageProps) => {
    const router = useRouter();
    const busId = params.id;
    
    const { data: busData, isLoading } = useGetBus(busId);

    if (isLoading) {
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

    const router = useRouter();
    const busId = params.id;
    const { data: busData, isLoading } = useGetBus(busId);

    if (isLoading) {
        // Show skeleton loader while loading
        return <Skeleton className="h-64 w-full" />;
    }

    if (!busData?.data) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-destructive">Bus not found</div>
            </div>
        );
    }

    const bus = busData.data;
    const totalSeats = bus.seatMap?.layout?.reduce((total, row) => total + row.length, 0) || 0;

    return (
        <React.Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/buses">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Buses
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Bus className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold tracking-tight">{bus.name}</h2>
                            <p className="text-muted-foreground">
                                Bus Details and Information
                            </p>
                        </div>
                    </div>
                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Bus Name</label>
                                    <p className="text-lg font-semibold">{bus.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Operator</label>
                                    <p className="text-lg">{bus.operator}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Registration Number</label>
                                    <Badge variant="outline" className="font-mono text-base py-1 px-2">
                                        {bus.registrationNumber}
                                    </Badge>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Total Seats</label>
                                    <p className="text-lg font-semibold flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        {totalSeats} seats
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Route Assignment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Route Assignment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {bus.route ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Route</label>
                                        <p className="text-lg font-semibold">
                                            {bus.route.routeName || `${bus.route.source} - ${bus.route.destination}`}
                                        </p>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Source</label>
                                            <p>{bus.route.source}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Destination</label>
                                            <p>{bus.route.destination}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Distance</label>
                                            <p>{bus.route.distance} km</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Badge variant={bus.route.status === "ACTIVE" ? "default" : "secondary"}>
                                            {bus.route.status}
                                        </Badge>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>No route assigned to this bus</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Seat Map */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Seat Layout</CardTitle>
                            <CardDescription>
                                Current seat configuration ({totalSeats} total seats)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {bus.seatMap?.layout?.length > 0 ? (
                                <div className="border rounded-lg p-6 bg-gray-50">
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {bus.seatMap.layout.map((row, rowIndex) => (
                                            <div key={rowIndex} className="flex justify-center gap-1">
                                                {row.map((seat, colIndex) => (
                                                    <div
                                                        key={colIndex}
                                                        className="w-8 h-8 bg-blue-100 border border-blue-300 rounded flex items-center justify-center text-xs font-mono"
                                                    >
                                                        {seat}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>No seat map configured</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Information */}
                <div className="space-y-6">
                    {/* Bus Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Bus Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {bus.coverImageUrl ? (
                                <img
                                    src={bus.coverImageUrl}
                                    alt={bus.name}
                                    className="w-full h-48 object-cover rounded-lg border"
                                />
                            ) : (
                                <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                    <div className="text-center text-muted-foreground">
                                        <Bus className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p>No image available</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Timestamps */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Timestamps
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Created At</label>
                                <p>{new Date(bus.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                                <p>{new Date(bus.updatedAt).toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BusDetailsPage;