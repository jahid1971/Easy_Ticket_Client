// "use client";
import { ReactNode } from "react";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/dashboardLayout/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboardLayout/DashboardHeader";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset>
                <div className="flex h-full flex-col ">
                    <DashboardHeader />
                    <main className="flex-1 overflow-auto p-4 bg-[#F4F7FE] dark:bg-[#121212] ">
                        {children}
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardLayout;
