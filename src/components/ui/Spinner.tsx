import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

export interface ISpinner {
    size?: number;
    className?: string;
    backdrop?: boolean;
    label?: string;
}

export const Spinner = ({ size = 40, backdrop, label, className }: ISpinner) => {
    return (
        <div className={cn("w-full h-[60vh] flex items-center justify-center relative", className)}>
            {backdrop && (
                <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-sm" />
            )}

            <span className="absolute z-20 flex flex-col items-center gap-2">
                <Loader className="animate-spin" style={{ animationDuration: "1.5s" }} size={size} />
                {label && <span className="text-lg text-muted-foreground">{label}...</span>}
            </span>
        </div>
    );
};

export default Spinner;
