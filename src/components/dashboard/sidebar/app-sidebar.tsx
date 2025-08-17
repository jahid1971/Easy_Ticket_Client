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
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Home, MapPin, Bus, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppSidebar } from "@/hooks/use-app-sidebar"
import { SimpleThemeToggle } from "@/components/ui/theme-toggle"

export function AppSidebar() {
    const { isCollapsed, isAnimating } = useAppSidebar()

    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center justify-between px-2 py-1">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className={`transition-all duration-200 ${isAnimating ? 'opacity-75' : 'opacity-100'}`}>
                            {!isCollapsed && (
                                <span className="text-lg font-semibold truncate">EasyTicket</span>
                            )}
                            {/* {isCollapsed && (
                                <span className="text-lg font-semibold">ET</span>
                            )} */}
                        </div>
                    </div>
                    <SidebarTrigger />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    {!isCollapsed && (
                        <SidebarGroupLabel className="transition-opacity duration-200">
                            Admin
                        </SidebarGroupLabel>
                    )}
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip={isCollapsed ? "Dashboard Overview" : undefined}>
                                    <Link href="/dashboard" className="flex items-center gap-2 transition-all duration-200">
                                        <Home className="shrink-0" /> 
                                        <span className={`transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'} overflow-hidden`}>
                                            Overview
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip={isCollapsed ? "Manage Routes" : undefined}>
                                    <Link href="/dashboard/routes" className="flex items-center gap-2 transition-all duration-200">
                                        <MapPin className="shrink-0" /> 
                                        <span className={`transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'} overflow-hidden`}>
                                            Routes
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip={isCollapsed ? "Manage Buses" : undefined}>
                                    <Link href="/dashboard/buses" className="flex items-center gap-2 transition-all duration-200">
                                        <Bus className="shrink-0" /> 
                                        <span className={`transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'} overflow-hidden`}>
                                            Buses
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
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
    // Provide a simple wrapper that returns the sidebar component.
    return <AppSidebar />
}
