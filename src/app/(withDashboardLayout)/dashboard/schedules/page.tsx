"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Bus, Route, Search, Plus, Edit, Trash2 } from "lucide-react";
import { useGetSchedules, useDeleteSchedule } from "@/Apis/scheduleApi";
import { TSchedule } from "@/types/Schedule";
import Link from "next/link";
import tryCatch from "@/utils/tryCatch";

const SchedulesPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    
    const { data: schedulesData, isLoading, refetch } = useGetSchedules({
        searchTerm,
        date: dateFilter,
        sortBy: "date,departureTime",
        sortOrder: "asc"
    });
    
    const deleteScheduleMutation = useDeleteSchedule();

    const handleDelete = async (scheduleId: string, routeName: string) => {
        if (!confirm(`Are you sure you want to delete this schedule for "${routeName}"?`)) return;
        
        await tryCatch(
            async () => {
                await deleteScheduleMutation.mutateAsync(scheduleId);
                refetch();
            },
            "Deleting schedule",
            "Schedule deleted successfully!"
        );
    };

    const filteredSchedules = schedulesData?.data || [];

    const formatTime = (timeString: string) => {
        return new Date(timeString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Schedules</h2>
                        <p className="text-muted-foreground">
                            Manage bus schedules and timetables
                        </p>
                    </div>
                </div>
                
                <Button asChild>
                    <Link href="/dashboard/schedules/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Schedule
                    </Link>
                </Button>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search by route, bus name, or operator..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-40"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Schedules</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{filteredSchedules.length}</div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Schedules</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {filteredSchedules.filter(s => 
                                new Date(s.date).toDateString() === new Date().toDateString()
                            ).length}
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
                        <Route className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Set(filteredSchedules.map(s => s.routeId)).size}
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
                        <Bus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Set(filteredSchedules.map(s => s.busId)).size}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Schedules List */}
            <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
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
                ) : filteredSchedules.length > 0 ? (
                    filteredSchedules.map((schedule: TSchedule) => (
                        <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3 flex-1">
                                        {/* Route Info */}
                                        <div className="flex items-center gap-3">
                                            <Route className="h-5 w-5 text-primary" />
                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {schedule.route.source} → {schedule.route.destination}
                                                </h3>
                                                {schedule.route.routeName && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {schedule.route.routeName}
                                                    </p>
                                                )}\n                                            </div>\n                                        </div>\n\n                                        {/* Bus Info */}\n                                        <div className=\"flex items-center gap-3\">\n                                            <Bus className=\"h-4 w-4 text-muted-foreground\" />\n                                            <div className=\"text-sm\">\n                                                <span className=\"font-medium\">{schedule.bus.name}</span>\n                                                <span className=\"text-muted-foreground\"> • {schedule.bus.operator}</span>\n                                            </div>\n                                        </div>\n\n                                        {/* Schedule Details */}\n                                        <div className=\"grid grid-cols-1 md:grid-cols-4 gap-4\">\n                                            <div className=\"flex items-center gap-2\">\n                                                <Calendar className=\"h-4 w-4 text-muted-foreground\" />\n                                                <div className=\"text-sm\">\n                                                    <p className=\"font-medium\">{formatDate(schedule.date)}</p>\n                                                    <p className=\"text-muted-foreground\">Date</p>\n                                                </div>\n                                            </div>\n                                            \n                                            <div className=\"flex items-center gap-2\">\n                                                <Clock className=\"h-4 w-4 text-muted-foreground\" />\n                                                <div className=\"text-sm\">\n                                                    <p className=\"font-medium\">{formatTime(schedule.departureTime)}</p>\n                                                    <p className=\"text-muted-foreground\">Departure</p>\n                                                </div>\n                                            </div>\n                                            \n                                            <div className=\"flex items-center gap-2\">\n                                                <Clock className=\"h-4 w-4 text-muted-foreground\" />\n                                                <div className=\"text-sm\">\n                                                    <p className=\"font-medium\">{formatTime(schedule.arrivalTime)}</p>\n                                                    <p className=\"text-muted-foreground\">Arrival</p>\n                                                </div>\n                                            </div>\n                                            \n                                            <div className=\"flex items-center gap-2\">\n                                                <Badge variant=\"secondary\" className=\"text-sm font-semibold\">\n                                                    ${schedule.price}\n                                                </Badge>\n                                            </div>\n                                        </div>\n                                    </div>\n\n                                    {/* Actions */}\n                                    <div className=\"flex gap-2 ml-4\">\n                                        <Button\n                                            variant=\"outline\"\n                                            size=\"sm\"\n                                            asChild\n                                        >\n                                            <Link href={`/dashboard/schedules/${schedule.id}/edit`}>\n                                                <Edit className=\"h-4 w-4\" />\n                                            </Link>\n                                        </Button>\n                                        <Button\n                                            variant=\"outline\"\n                                            size=\"sm\"\n                                            onClick={() => handleDelete(\n                                                schedule.id, \n                                                schedule.route.routeName || `${schedule.route.source} - ${schedule.route.destination}`\n                                            )}\n                                            disabled={deleteScheduleMutation.isPending}\n                                        >\n                                            <Trash2 className=\"h-4 w-4\" />\n                                        </Button>\n                                    </div>\n                                </div>\n                            </CardContent>\n                        </Card>\n                    ))\n                ) : (\n                    <div className=\"text-center py-12\">\n                        <Calendar className=\"h-12 w-12 text-muted-foreground mx-auto mb-4\" />\n                        <h3 className=\"text-lg font-medium mb-2\">No schedules found</h3>\n                        <p className=\"text-muted-foreground mb-4\">\n                            {searchTerm || dateFilter ? \"Try adjusting your search criteria\" : \"Create your first schedule to get started\"}\n                        </p>\n                        <Button asChild>\n                            <Link href=\"/dashboard/schedules/create\">\n                                <Plus className=\"mr-2 h-4 w-4\" />\n                                Add Schedule\n                            </Link>\n                        </Button>\n                    </div>\n                )}\n            </div>\n        </div>\n    );\n};\n\nexport default SchedulesPage;