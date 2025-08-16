
const Page = () => {
  return (
    <div>
         Page
    </div>
  );
};

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, MapPin, Users, BarChart3 } from "lucide-react";

const DashboardPage = () => {
    const stats = [
        {
            title: "Total Routes",
            value: "24",
            description: "Active bus routes",
            icon: MapPin,
            trend: "+2.5%"
        },
        {
            title: "Total Buses", 
            value: "68",
            description: "Fleet vehicles",
            icon: Bus,
            trend: "+5.2%"
        },
        {
            title: "Active Users",
            value: "1,254",
            description: "Registered customers", 
            icon: Users,
            trend: "+12.3%"
        },
        {
            title: "Monthly Revenue",
            value: "$45,210",
            description: "This month's earnings",
            icon: BarChart3,
            trend: "+8.1%"
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Welcome to your admin dashboard. Here's what's happening with your ticket system today.
                </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">{stat.trend}</span> {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        New route created: Dhaka → Chittagong
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        2 hours ago
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        Bus AC-101 maintenance scheduled
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        4 hours ago
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        125 tickets booked today
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        6 hours ago
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Manage your ticket system efficiently
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <div className="grid gap-2">
                            <button className="w-full justify-start text-left font-normal h-auto p-4 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <div>
                                        <div className="font-medium">Manage Routes</div>
                                        <div className="text-sm text-muted-foreground">Add or edit bus routes</div>
                                    </div>
                                </div>
                            </button>
                            <button className="w-full justify-start text-left font-normal h-auto p-4 bg-secondary/50 hover:bg-secondary/70 border border-secondary rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Bus className="h-4 w-4" />
                                    <div>
                                        <div className="font-medium">Fleet Management</div>
                                        <div className="text-sm text-muted-foreground">Manage bus fleet</div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;