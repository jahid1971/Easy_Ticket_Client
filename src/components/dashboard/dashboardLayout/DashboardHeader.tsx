"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserMenu } from "@/components/dashboard/UserMenu";

export function DashboardHeader() {
    return (
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[margin-left] duration-200 ease-linear">
            <div className="flex items-center gap-2">
                <span className="lg:hidden">
                    <SidebarTrigger />
                </span>
                <h1 className="text-lg font-semibold text-sidebar-foreground/80">
                    EasyTicket Admin Dashboard
                </h1>
            </div>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <UserMenu />
            </div>
        </header>
    );
}