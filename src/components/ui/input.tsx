import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    leftIcon?: React.ReactNode;
};

export function Input({ className, leftIcon, ...props }: InputProps) {
    return (
        <div className={cn("relative", leftIcon && "pl-9")}>            
            {leftIcon ? (
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">{leftIcon}</span>
            ) : null}
            <input
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    leftIcon && "pl-9",
                    className
                )}
                {...props}
            />
        </div>
    );
}

export type { InputProps };
