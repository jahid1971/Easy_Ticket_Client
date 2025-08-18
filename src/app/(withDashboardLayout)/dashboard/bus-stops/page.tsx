"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, Search, Edit, Trash2 } from "lucide-react";
import { useGetBusStops, useDeleteBusStop } from "@/Apis/busStopApi";
import { TBusStop } from "@/types/BusStop";
import Link from "next/link";
import tryCatch from "@/utils/tryCatch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import CreateBusStopForm from "@/components/forms/CreateBusStopForm";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";

const BusStopsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [toDelete, setToDelete] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingBusStop, setEditingBusStop] = useState<TBusStop | null>(null);

    const {
        data: busStopsData,
        isLoading,
        refetch,
    } = useGetBusStops({
        searchTerm,
        sortBy: "name",
        sortOrder: "asc",
    });

    console.log(busStopsData, "busStopsData -------------------------------");

    const deleteBusStopMutation = useDeleteBusStop();

    const confirmDelete = (id: string, name: string) => {
        setToDelete({ id, name });
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!toDelete) return;
        await tryCatch(
            async () => await deleteBusStopMutation.mutateAsync(toDelete.id),
            "Deleting bus stop",
            "Bus stop deleted successfully!",
            () => {
                setDeleteModalOpen(false);
                setToDelete(null);
            }
        );
    };

    const filteredBusStops = busStopsData?.data || [];

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Bus Stops
                            </h2>
                            <p className="text-muted-foreground">
                                Manage bus stops and their locations
                            </p>
                        </div>
                    </div>

                    <Dialog
                        open={createModalOpen}
                        onOpenChange={setCreateModalOpen}
                    >
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Bus Stop
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create New Bus Stop</DialogTitle>
                                <DialogDescription>
                                    Add a new bus stop location to your system
                                </DialogDescription>
                            </DialogHeader>
                            <CreateBusStopForm
                                onSuccess={() => setCreateModalOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search bus stops by name or city..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Bus Stops
                            </CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {filteredBusStops.length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Cities Covered
                            </CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {
                                    new Set(
                                        filteredBusStops
                                            .map((stop) => stop.city)
                                            .filter(Boolean)
                                    ).size
                                }
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                With GPS
                            </CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {
                                    filteredBusStops.filter(
                                        (stop) =>
                                            stop.latitude && stop.longitude
                                    ).length
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bus Stops List */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="pt-6">
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : filteredBusStops.length > 0 ? (
                        filteredBusStops.map((busStop: TBusStop) => (
                            <Card
                                key={busStop.id}
                                className="hover:shadow-md transition-shadow"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg">
                                                {busStop.name}
                                            </CardTitle>
                                            {busStop.city && (
                                                <Badge variant="secondary">
                                                    {busStop.city}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingBusStop(busStop);
                                                    setEditModalOpen(true);
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    confirmDelete(
                                                        busStop.id,
                                                        busStop.name
                                                    )
                                                }
                                                disabled={
                                                    deleteBusStopMutation.isPending
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        {busStop.address && (
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                <span>{busStop.address}</span>
                                            </div>
                                        )}
                                        {busStop.latitude &&
                                            busStop.longitude && (
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        GPS:{" "}
                                                        {busStop.latitude.toFixed(
                                                            4
                                                        )}
                                                        ,{" "}
                                                        {busStop.longitude.toFixed(
                                                            4
                                                        )}
                                                    </Badge>
                                                </div>
                                            )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                                No bus stops found
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm
                                    ? "Try adjusting your search criteria"
                                    : "Create your first bus stop to get started"}
                            </p>
                            <Button onClick={() => setCreateModalOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Bus Stop
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* modals -------------- */}
            <ConfirmDeleteModal
                open={deleteModalOpen}
                onOpenChange={(open) => {
                    setDeleteModalOpen(open);
                    if (!open) setToDelete(null);
                }}
                title="Delete bus stop"
                description={
                    toDelete
                        ? `Are you sure you want to delete "${toDelete.name}"? This action cannot be undone.`
                        : undefined
                }
                confirmLabel="Delete"
                loading={deleteBusStopMutation.isPending}
                onConfirm={handleDelete}
            />
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Bus Stop</DialogTitle>
                        <DialogDescription>
                            Edit details for the selected bus stop
                        </DialogDescription>
                    </DialogHeader>
                    {editingBusStop && (
                        <CreateBusStopForm
                            busStop={editingBusStop}
                            onSuccess={() => {
                                setEditModalOpen(false);
                                setEditingBusStop(null);
                                refetch();
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default BusStopsPage;
