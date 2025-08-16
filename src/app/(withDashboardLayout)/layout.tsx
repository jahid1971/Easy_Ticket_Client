import { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset>
                <div className="flex h-full flex-col">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[margin-left] duration-200 ease-linear">
                        <h1 className="text-lg font-semibold text-sidebar-foreground/80">
                            EasyTicket Admin Dashboard
                        </h1>
                    </header>
                    <main className="flex-1 overflow-auto p-4">
                        {children}
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardLayout;