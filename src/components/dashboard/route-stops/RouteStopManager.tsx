"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Plus, ArrowUp, ArrowDown, Trash2, Route } from "lucide-react";
import { 
    useGetRouteStopsByRoute, 
    useBulkCreateRouteStops, 
    useDeleteRouteStop,
    useReorderRouteStops 
} from "@/Apis/routeStopApi";
import { useGetBusStops } from "@/Apis/busStopApi";
import { TRouteStop, StopType, RouteStopBulkCreateInput } from "@/types/RouteStop";
import { TBusStop } from "@/types/BusStop";
import tryCatch from "@/utils/tryCatch";

interface RouteStopManagerProps {
    routeId: string;
    routeName?: string;
}

const RouteStopManager: React.FC<RouteStopManagerProps> = ({ routeId, routeName }) => {
    const [newStops, setNewStops] = useState<Array<{
        busStopId: string;
        stopType: StopType;
        tempId: string;
    }>>([]);

    const { data: routeStopsData, refetch: refetchRouteStops } = useGetRouteStopsByRoute(routeId);
    const { data: busStopsData } = useGetBusStops();
    const bulkCreateMutation = useBulkCreateRouteStops();
    const deleteRouteStopMutation = useDeleteRouteStop();
    const reorderMutation = useReorderRouteStops();

    const routeStops = routeStopsData?.data || [];
    const busStops = busStopsData?.data || [];
    const availableBusStops = busStops.filter(
        stop => !routeStops.some(routeStop => routeStop.busStopId === stop.id) &&
                !newStops.some(newStop => newStop.busStopId === stop.id)
    );

    const addNewStop = () => {
        setNewStops(prev => [...prev, {
            busStopId: "",
            stopType: "BOTH",
            tempId: Date.now().toString()
        }]);
    };

    const updateNewStop = (tempId: string, field: string, value: string) => {
        setNewStops(prev => prev.map(stop => 
            stop.tempId === tempId ? { ...stop, [field]: value } : stop
        ));
    };

    const removeNewStop = (tempId: string) => {
        setNewStops(prev => prev.filter(stop => stop.tempId !== tempId));
    };

    const saveNewStops = async () => {
        const validStops = newStops.filter(stop => stop.busStopId);
        if (validStops.length === 0) return;

        const highestOrder = Math.max(0, ...routeStops.map(stop => stop.order));
        
        const stopsToCreate: RouteStopBulkCreateInput = {
            routeId,
            stops: validStops.map((stop, index) => ({
                busStopId: stop.busStopId,
                order: highestOrder + index + 1,
                stopType: stop.stopType as StopType
            }))
        };

        await tryCatch(
            async () => {
                await bulkCreateMutation.mutateAsync(stopsToCreate);
                setNewStops([]);
                refetchRouteStops();
            },
            "Adding route stops",
            "Route stops added successfully!"
        );
    };

    const deleteRouteStop = async (routeStopId: string, busStopName: string) => {
        if (!confirm(`Remove "${busStopName}" from this route?`)) return;

        await tryCatch(
            async () => {
                await deleteRouteStopMutation.mutateAsync(routeStopId);
                refetchRouteStops();
            },
            "Removing stop",
            "Stop removed successfully!"
        );
    };

    const moveStop = async (stopId: string, direction: 'up' | 'down') => {
        const currentIndex = routeStops.findIndex(stop => stop.id === stopId);
        if (currentIndex === -1) return;
        
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= routeStops.length) return;

        const reorderedStops = [...routeStops];
        [reorderedStops[currentIndex], reorderedStops[newIndex]] = 
        [reorderedStops[newIndex], reorderedStops[currentIndex]];

        const stopOrders = reorderedStops.map((stop, index) => ({
            id: stop.id,
            order: index + 1
        }));

        await tryCatch(
            async () => {
                await reorderMutation.mutateAsync({ routeId, stopOrders });
                refetchRouteStops();
            },
            "Reordering stops",
            "Stops reordered successfully!"
        );
    };

    const getStopTypeColor = (stopType: StopType) => {
        switch (stopType) {
            case 'BOARDING': return 'bg-green-100 text-green-800';
            case 'DROPPING': return 'bg-red-100 text-red-800';
            case 'BOTH': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5" />
                    Route Stops Configuration
                </CardTitle>
                <CardDescription>
                    {routeName ? `Configure stops for ${routeName}` : "Configure stops for this route"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Current Route Stops */}
                <div className="space-y-3">
                    <h4 className="font-medium">Current Stops ({routeStops.length})</h4>
                    {routeStops.length > 0 ? (
                        <div className="space-y-2">
                            {routeStops.map((routeStop, index) => (
                                <div
                                    key={routeStop.id}
                                    className="flex items-center gap-3 p-3 border rounded-lg"
                                >
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                            {index + 1}
                                        </span>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            <span className="font-medium">{routeStop.busStop.name}</span>
                                            <Badge className={getStopTypeColor(routeStop.stopType)}>
                                                {routeStop.stopType}
                                            </Badge>
                                        </div>
                                        {routeStop.busStop.city && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {routeStop.busStop.city}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => moveStop(routeStop.id, 'up')}
                                            disabled={index === 0 || reorderMutation.isPending}
                                        >
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => moveStop(routeStop.id, 'down')}
                                            disabled={index === routeStops.length - 1 || reorderMutation.isPending}
                                        >
                                            <ArrowDown className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => deleteRouteStop(routeStop.id, routeStop.busStop.name)}
                                            disabled={deleteRouteStopMutation.isPending}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Route className="h-8 w-8 mx-auto mb-2" />
                            <p>No stops configured for this route</p>
                        </div>
                    )}
                </div>

                {/* Add New Stops */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">Add New Stops</h4>
                        <Button variant="outline" size="sm" onClick={addNewStop}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Stop
                        </Button>
                    </div>

                    {newStops.map((newStop) => (
                        <div key={newStop.tempId} className="flex items-center gap-3 p-3 border border-dashed rounded-lg">
                            <Select
                                value={newStop.busStopId}
                                onValueChange={(value) => updateNewStop(newStop.tempId, 'busStopId', value)}
                            >
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Select bus stop" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableBusStops.map((busStop) => (
                                        <SelectItem key={busStop.id} value={busStop.id}>
                                            <div>
                                                <div className="font-medium">{busStop.name}</div>
                                                {busStop.city && (
                                                    <div className="text-sm text-muted-foreground">{busStop.city}</div>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={newStop.stopType}
                                onValueChange={(value) => updateNewStop(newStop.tempId, 'stopType', value)}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BOTH">Both</SelectItem>
                                    <SelectItem value="BOARDING">Boarding</SelectItem>
                                    <SelectItem value="DROPPING">Dropping</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeNewStop(newStop.tempId)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}

                    {newStops.length > 0 && (
                        <div className="flex gap-3">
                            <Button
                                onClick={saveNewStops}
                                disabled={bulkCreateMutation.isPending || newStops.some(stop => !stop.busStopId)}
                                className="flex-1"
                            >
                                {bulkCreateMutation.isPending ? "Saving..." : "Save New Stops"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setNewStops([])}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>

                {availableBusStops.length === 0 && newStops.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                        <p>All available bus stops have been added to this route</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RouteStopManager;