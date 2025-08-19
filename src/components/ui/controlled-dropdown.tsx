"use client"

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export function ControlledDropdown({ open, onOpenChange, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root> & { open: boolean; onOpenChange: (v: boolean) => void }) {
    return (
        <DropdownMenuPrimitive.Root open={open} onOpenChange={onOpenChange} {...props}>
            {children}
        </DropdownMenuPrimitive.Root>
    );
}

export const ControlledDropdownTrigger = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>>(({ className, ...props }, ref) => {
    return <DropdownMenuPrimitive.Trigger ref={ref} className={cn(className)} {...props} />;
});
ControlledDropdownTrigger.displayName = "ControlledDropdownTrigger";

export const ControlledDropdownContent = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>>(({ className, sideOffset = 4, ...props }, ref) => {
    return (
        <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
                ref={ref}
                sideOffset={sideOffset}
                className={cn(
                    "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
                    className
                )}
                {...props}
            />
        </DropdownMenuPrimitive.Portal>
    );
});
ControlledDropdownContent.displayName = "ControlledDropdownContent";

export const ControlledDropdownItem = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.Item>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>>(({ className, ...props }, ref) => {
    return (
        <DropdownMenuPrimitive.Item
            ref={ref}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
            {...props}
        />
    );
});
ControlledDropdownItem.displayName = "ControlledDropdownItem";

export default ControlledDropdown;
