"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Circle } from "lucide-react";
import {
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
    navigationMenuItems,
    NavigationSection,
} from "@/constants/menuItems/navigationMenuItems";

interface SidebarItemsProps {
    isCollapsed: boolean;
    openSubmenu: string | null;
    setOpenSubmenu: (submenu: string | null) => void;
}

const SidebarItems = ({
    isCollapsed,
    openSubmenu,
    setOpenSubmenu,
}: SidebarItemsProps) => {
    const pathname = usePathname();

    const renderItem = (item: any) => {
        const Icon = item.icon as any;
        const isOpen = openSubmenu === item.title;

        // submenu item
        if (item.submenu) {
            const isActive = item.submenu.some((s: any) => pathname === s.href);
            return (
                <SidebarMenuItem key={item.title}>
                    <button
                        type="button"
                        className={`w-full flex items-center gap-2 min-h-10 px-2 py-2 rounded-md transition-colors group
                            hover:bg-sidebar-accent
                            ${
                                isActive
                                    ? "bg-sidebar-accent text-primary font-semibold"
                                    : ""
                            }`}
                        aria-expanded={isOpen}
                        onClick={() =>
                            setOpenSubmenu(isOpen ? null : item.title)
                        }
                    >
                        {Icon && <Icon className="shrink-0" size={20} />}
                        <span
                            className={`flex-1 text-left transition-all duration-200 ${
                                isCollapsed
                                    ? "w-0 opacity-0"
                                    : "w-auto opacity-100"
                            } overflow-hidden text-sm`}
                        >
                            {item.title}
                        </span>
                        <ChevronRight
                            className={`ml-auto transition-transform ${
                                isCollapsed ? "opacity-0" : "opacity-100"
                            } ${isOpen ? "rotate-90" : ""}`}
                            size={16}
                        />
                    </button>

                    <div
                        className={`pl-8 flex flex-col gap-1 overflow-hidden transition-all duration-200 ${
                            isOpen ? "max-h-40 py-1" : "max-h-0 py-0"
                        } ${isCollapsed ? "hidden" : ""}`}
                        style={{ pointerEvents: isOpen ? "auto" : "none" }}
                    >
                        {item.submenu.map((sub: any) => {
                            const isSubActive = pathname === sub.href;
                            return (
                                <Link
                                    key={sub.href}
                                    href={sub.href}
                                    className={`flex items-center gap-2 min-h-9 text-sm rounded px-2 py-1 transition-colors hover:bg-muted ${
                                        isSubActive
                                            ? "bg-muted font-semibold text-primary"
                                            : ""
                                    }`}
                                >
                                    <Circle
                                        size={8}
                                        className={`mr-2 ${
                                            isSubActive
                                                ? "text-primary"
                                                : "text-muted-foreground"
                                        } transition-colors`}
                                    />
                                    <span className="text-sm">{sub.title}</span>
                                </Link>
                            );
                        })}
                    </div>
                </SidebarMenuItem>
            );
        }

        // simple item
        const isActive = pathname === item.href;
        return (
            <SidebarMenuItem key={item.href || item.title}>
                <SidebarMenuButton
                    asChild
                    tooltip={isCollapsed ? item.tooltip : undefined}
                >
                    <Link
                        href={item.href || "#"}
                        className={`flex items-center gap-2 min-h-10 transition-all duration-200 rounded-md hover:bg-sidebar-accent ${
                            isActive
                                ? "bg-sidebar-accent text-primary font-semibold"
                                : ""
                        }`}
                    >
                        {item.icon && (
                            <item.icon className="shrink-0" size={20} />
                        )}
                        <span
                            className={`transition-all duration-200 ${
                                isCollapsed
                                    ? "w-0 opacity-0"
                                    : "w-auto opacity-100"
                            } overflow-hidden text-sm`}
                        >
                            {item.title}
                        </span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    };

    return (
        <>
            {navigationMenuItems.map((section: NavigationSection) => (
                <SidebarGroup>
                    <div key={section.label}>
                        {!isCollapsed && (
                            <SidebarGroupLabel>
                                {" "}
                                {section.label}
                            </SidebarGroupLabel>
                        )}
                        <SidebarGroupContent>
                            {section.items.map((it) => renderItem(it))}
                        </SidebarGroupContent>
                    </div>
                </SidebarGroup>
            ))}
        </>
    );
};

export default SidebarItems;
