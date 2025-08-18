import { 
    Home, 
    Route, 
    MapPin, 
    Bus, 
    Calendar, 
    Users, 
    CreditCard, 
    BarChart3 
} from "lucide-react";

export interface NavigationSection {
    label: string;
    items: Array<{
        title: string;
        href?: string;
        icon?: any;
        tooltip?: string;
        submenu?: Array<{ title: string; href: string }>;
    }>;
}

export const navigationMenuItems: NavigationSection[] = [
    {
        label: "Overview",
        items: [
            {
                title: "Dashboard",
                href: "/dashboard",
                icon: Home,
                tooltip: "Dashboard Overview",
            },
        ],
    },
    {
        label: "Fleet Management",
        items: [
            {
                title: "Routes",
                icon: Route,
                tooltip: "Manage Routes",
                submenu: [
                    { title: "All Routes", href: "/dashboard/routes" },
                    { title: "Create Route", href: "/dashboard/routes/create" },
                ],
            },
            {
                title: "Bus Stops",
                href: "/dashboard/bus-stops",
                icon: MapPin,
                tooltip: "Manage Bus Stops",
            },
            {
                title: "Buses",
                icon: Bus,
                tooltip: "Manage Buses",
                submenu: [
                    { title: "All Buses", href: "/dashboard/buses" },
                    { title: "Create Bus", href: "/dashboard/buses/create" },
                ],
            },
            {
                title: "Schedules",
                icon: Calendar,
                tooltip: "Manage Schedules",
                submenu: [
                    { title: "All Schedules", href: "/dashboard/schedules" },
                    { title: "Create Schedule", href: "/dashboard/schedules/create" },
                ],
            },
        ],
    },
    {
        label: "Operations",
        items: [
            {
                title: "Bookings",
                href: "/dashboard/bookings",
                icon: Users,
                tooltip: "Manage Bookings",
            },
            {
                title: "Payments",
                href: "/dashboard/payments",
                icon: CreditCard,
                tooltip: "Payment Management",
            },
        ],
    },
    {
        label: "Analytics",
        items: [
            {
                title: "Reports",
                href: "/dashboard/reports",
                icon: BarChart3,
                tooltip: "View Reports",
            },
        ],
    },
];
