import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CustomDropdown({
    trigger,
    menuItems,
    menuLabel,
}: {
    trigger: React.ReactNode | string;
    menuItems?: any[];
    menuLabel?: string;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
                {trigger}
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
                {menuLabel && (
                    <>
                        <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                    </>
                )}

                {menuItems?.map((item, index) => (
                    <DropdownMenuItem
                        key={index}
                    >
                        {item}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
