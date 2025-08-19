import React, { memo } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionCellProps {
    id: string;
    actions: Array<{
        label: string;
        icon?: React.ReactNode;
        onClick?: () => void;
        href?: string;
        variant?: "default" | "destructive";
        asChild?: boolean;
        children?: React.ReactNode;
    }>;
}

const ActionCell = memo(({ id, actions }: ActionCellProps) => {
    if (!id) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {actions.map((action, index) => (
                    <DropdownMenuItem
                        key={`${id}-action-${index}`}
                        onClick={action.onClick}
                        className={action.variant === "destructive" ? "text-destructive" : ""}
                        asChild={action.asChild}
                    >
                        {action.children || (
                            <>
                                {action.icon && <span className="mr-2">{action.icon}</span>}
                                {action.label}
                            </>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
});

ActionCell.displayName = "ActionCell";

export default ActionCell;

