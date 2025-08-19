"use client";

import React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarTrigger,
    SidebarRail,
} from "@/components/ui/sidebar";
import { useAppSidebar } from "@/hooks/use-app-sidebar";
import { SimpleThemeToggle } from "@/components/ui/theme-toggle";
import SidebarItems from "./SidebarItems";

export function AppSidebar() {
    const { isCollapsed, isAnimating, isMobile } = useAppSidebar();
    // Track which submenu is open (by title)
    const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);

    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center justify-between px-2 py-1">
                    <div className="flex items-center gap-2 min-w-0">
                        <div
                            className={`transition-all duration-200 ${
                                isAnimating ? "opacity-75" : "opacity-100"
                            }`}
                        >
                            {(!isCollapsed || isMobile) && (
                                <span className="text-lg font-semibold truncate">
                                    EasyTicket
                                </span>
                            )}
                        </div>
                    </div>
                    <SidebarTrigger />
                </div>
            </SidebarHeader>

            <SidebarContent >
                <SidebarMenu >
                    <SidebarItems 
                        isCollapsed={isMobile ? false : isCollapsed}
                        openSubmenu={openSubmenu}
                        setOpenSubmenu={setOpenSubmenu}
                    />
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <div className="p-2 space-y-2">
                    {/* <div className="flex justify-center">
                        <SimpleThemeToggle />
                    </div> */}
                    {!isMobile && !isCollapsed && (
                        <div className="text-xs text-muted-foreground text-center transition-opacity duration-200">
                            Press{" "}
                            <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">
                                Ctrl+B
                            </kbd>{" "}
                            to toggle
                        </div>
                    )}
                    {!isMobile && isCollapsed && (
                        <div className="flex justify-center">
                            <div className="w-8 h-0.5 bg-muted rounded transition-all duration-200"></div>
                        </div>
                    )}
                </div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}

export default function AppSidebarWrapper({
    children,
}: {
    children?: React.ReactNode;
}) {
    return <AppSidebar />;
}
