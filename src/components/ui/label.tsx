import * as React from "react";
import { cn } from "@/lib/utils";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
    requiredMark?: boolean;
};

export function Label({ className, requiredMark, children, ...props }: LabelProps) {
    return (
        <label
            className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                className
            )}
            {...props}
        >
            {children}
            {requiredMark ? <span className="ml-0.5 text-destructive">*</span> : null}
        </label>
    );
}

export type { LabelProps };
