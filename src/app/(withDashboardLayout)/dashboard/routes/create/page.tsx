"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCreateBusRoute } from "@/Apis/busRouteApi";
import { RouteCreateInput } from "@/types/Route";
import { useRouter } from "next/navigation";
import Link from "next/link";

type RouteFormData = {
    routeName?: string;
    source: string;
    destination: string;
    distance: number;
    description?: string;
    status: "ACTIVE" | "INACTIVE";
};

const CreateRoutePage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<RouteFormData>({
        routeName: "",
        source: "",
        destination: "",
        distance: 0,
        description: "",
        status: "ACTIVE",
    });
    
    const createRouteMutation = useCreateBusRoute({
        onSuccess: () => {
            router.push("/dashboard/routes");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        const routeData: RouteCreateInput = {
            source: formData.source,
            destination: formData.destination,
            distance: formData.distance,
            status: formData.status,
        };
        
        createRouteMutation.mutate(routeData, {
            onSettled: () => setIsLoading(false),
        });
    };

    const handleInputChange = (field: keyof RouteFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/routes">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Routes
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Create Route</h2>
                    <p className="text-muted-foreground">
                        Add a new bus route to your system
                    </p>
                </div>
            </div>

            <div className="max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Route Information</CardTitle>
                        <CardDescription>
                            Enter the details for the new bus route
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="routeName">Route Name (Optional)</Label>
                                <Input
                                    id="routeName"
                                    placeholder="e.g., Express Route 1"
                                    value={formData.routeName}
                                    onChange={(e) => handleInputChange('routeName', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="source">Source *</Label>
                                    <Input
                                        id="source"
                                        placeholder="e.g., Dhaka"
                                        value={formData.source}
                                        onChange={(e) => handleInputChange('source', e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="destination">Destination *</Label>
                                    <Input
                                        id="destination"
                                        placeholder="e.g., Chittagong"
                                        value={formData.destination}
                                        onChange={(e) => handleInputChange('destination', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="distance">Distance (km) *</Label>
                                    <Input
                                        id="distance"
                                        type="number"
                                        step="0.1"
                                        placeholder="0"
                                        value={formData.distance}
                                        onChange={(e) => handleInputChange('distance', parseFloat(e.target.value) || 0)}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={formData.status} onValueChange={(value: "ACTIVE" | "INACTIVE") => handleInputChange('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Enter route description..."
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={isLoading || createRouteMutation.isPending}
                                    className="flex-1"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {isLoading || createRouteMutation.isPending ? "Creating..." : "Create Route"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push("/dashboard/routes")}
                                    disabled={isLoading || createRouteMutation.isPending}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreateRoutePage;