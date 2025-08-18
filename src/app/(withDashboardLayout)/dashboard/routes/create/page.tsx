"use client";

import Link from "next/link";
import { ArrowLeft, Route as RouteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateRouteForm from "@/components/forms/CreateRouteForm";

const CreateRoutePage = () => {
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
                        <h2 className="text-3xl font-bold tracking-tight">Create Route</h2>
                        <p className="text-muted-foreground">
                            Add a new bus route to your transportation network
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <CreateRouteForm />
        </div>
    );
};

export default CreateRoutePage;