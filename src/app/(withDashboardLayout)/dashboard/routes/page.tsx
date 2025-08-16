"use client";

import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useGetBusRoutes, useDeleteBusRoute } from "@/Apis/busRouteApi";
import { TRoute } from "@/types/Route";
import Link from "next/link";

const RoutesPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { data: routesData, isLoading } = useGetBusRoutes();
    const deleteRouteMutation = useDeleteBusRoute();

    const routes = routesData?.data || [];

    const filteredRoutes = routes.filter(
        (route: TRoute) =>
            route.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.routeName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteRoute = (id: string) => {
        if (confirm("Are you sure you want to delete this route?")) {
            deleteRouteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Routes</h2>
                    <p className="text-muted-foreground">
                        Manage bus routes and destinations
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/routes/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Route
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Route Management</CardTitle>
                    <CardDescription>
                        View and manage all bus routes in your system
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search routes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Route Name</TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead>Destination</TableHead>
                                    <TableHead>Distance</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredRoutes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="text-muted-foreground">No routes found</div>
                                                <Button variant="outline" asChild>
                                                    <Link href="/dashboard/routes/create">
                                                        Create your first route
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRoutes.map((route: TRoute) => (
                                        <TableRow key={route.id}>
                                            <TableCell className="font-medium">
                                                {route.routeName || `${route.source} - ${route.destination}`}
                                            </TableCell>
                                            <TableCell>{route.source}</TableCell>
                                            <TableCell>{route.destination}</TableCell>
                                            <TableCell>{route.distance} km</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={route.status === "ACTIVE" ? "default" : "secondary"}
                                                    className={
                                                        route.status === "ACTIVE"
                                                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                            : ""
                                                    }
                                                >
                                                    {route.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/routes/${route.id}/edit`}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteRoute(route.id)}
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RoutesPage;