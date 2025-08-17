import { Loader2 } from "lucide-react";

export const LoadingOverlayComponent = () => {
    return (
        <div className="relative flex items-center justify-center p-4" role="presentation">
            <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
        </div>
    );
};