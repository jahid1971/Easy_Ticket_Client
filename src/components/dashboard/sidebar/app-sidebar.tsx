"use client"

import React from "react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar"
import { 
  Home, 
  MapPin, 
  Bus, 
  Route, 
  Calendar, 
  Users, 
  CreditCard,
  BarChart3 
} from "lucide-react"
import { useAppSidebar } from "@/hooks/use-app-sidebar"
import { SimpleThemeToggle } from "@/components/ui/theme-toggle"

export function AppSidebar() {
    const { isCollapsed, isAnimating } = useAppSidebar()

    // Navigation items organized by sections
    const navigationSections = [
        {
            label: "Overview",
            items: [
                {
                    title: "Dashboard",
                    href: "/dashboard",
                    icon: Home,
                    tooltip: "Dashboard Overview"
                }
            ]
        },
        {
            label: "Fleet Management",
            items: [
                {
                    title: "Routes",
                    href: "/dashboard/routes",
                    icon: Route,
                    tooltip: "Manage Routes"
                },
                {
                    title: "Bus Stops",
                    href: "/dashboard/bus-stops",
                    icon: MapPin,
                    tooltip: "Manage Bus Stops"
                },
                {
                    title: "Buses",
                    href: "/dashboard/buses",
                    icon: Bus,
                    tooltip: "Manage Buses"
                },
                {
                    title: "Schedules",
                    href: "/dashboard/schedules",
                    icon: Calendar,
                    tooltip: "Manage Schedules"
                }
            ]
        },
        {
            label: "Operations",
            items: [
                {
                    title: "Bookings",
                    href: "/dashboard/bookings",
                    icon: Users,
                    tooltip: "Manage Bookings"
                },
                {
                    title: "Payments",
                    href: "/dashboard/payments",
                    icon: CreditCard,
                    tooltip: "Payment Management"
                }
            ]
        },
        {
            label: "Analytics",
            items: [
                {
                    title: "Reports",
                    href: "/dashboard/reports",
                    icon: BarChart3,
                    tooltip: "View Reports"
                }
            ]
        }
    ]

    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center justify-between px-2 py-1">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className={`transition-all duration-200 ${
                            isAnimating ? 'opacity-75' : 'opacity-100'
                        }`}>
                            {!isCollapsed && (
                                <span className="text-lg font-semibold truncate">
                                    EasyTicket
                                </span>
                            )}
                        </div>
                    </div>
                    <SidebarTrigger />
                </div>
            </SidebarHeader>

            <SidebarContent>
                {navigationSections.map((section, sectionIndex) => (
                    <SidebarGroup key={section.label}>
                        {!isCollapsed && (
                            <SidebarGroupLabel className="transition-opacity duration-200">
                                {section.label}
                            </SidebarGroupLabel>
                        )}
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {section.items.map((item) => {
                                    const IconComponent = item.icon
                                    return (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton 
                                                asChild 
                                                tooltip={isCollapsed ? item.tooltip : undefined}
                                            >
                                                <Link 
                                                    href={item.href} 
                                                    className="flex items-center gap-2 transition-all duration-200"
                                                >
                                                    <IconComponent className="shrink-0" size={20} />
                                                    <span className={`transition-all duration-200 ${
                                                        isCollapsed 
                                                            ? 'w-0 opacity-0' 
                                                            : 'w-auto opacity-100'
                                                    } overflow-hidden`}>
                                                        {item.title}
                                                    </span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <div className="p-2 space-y-2">
                    <div className="flex justify-center">
                        <SimpleThemeToggle />
                    </div>
                    {!isCollapsed && (
                        <div className="text-xs text-muted-foreground text-center transition-opacity duration-200">
                            Press <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Ctrl+B</kbd> to toggle
                        </div>
                    )}
                    {isCollapsed && (
                        <div className="flex justify-center">
                            <div className="w-8 h-0.5 bg-muted rounded transition-all duration-200"></div>
                        </div>
                    )}
                </div>
            </SidebarFooter>
            
            <SidebarRail />
        </Sidebar>
    )
}

export default function AppSidebarWrapper({ children }: { children?: React.ReactNode }) {
    return <AppSidebar />
}
