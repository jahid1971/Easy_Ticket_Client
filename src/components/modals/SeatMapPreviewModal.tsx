
"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface SeatMapPreviewModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    seatMap: { layout: string[][]; spaceAfterColumn?: string | number };
    spaceAfterColumn: string | number;
    trigger?: React.ReactNode;
}

export default function SeatMapPreviewModal({
    open,
    onOpenChange,
    seatMap,
    spaceAfterColumn,
    trigger,
}: SeatMapPreviewModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

            <DialogContent className="max-w-3xl w-full max-h-[96vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Bus Seat Map Preview</DialogTitle>
                </DialogHeader>

                <div className="space-y-2 overflow-auto max-h-[80vh] p-2">
                    {seatMap?.layout?.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex justify-center gap-1">
                            {row.map((seat, colIndex) => (
                                <div
                                    key={colIndex}
                                    className={cn(
                                        "w-10 h-10 rounded flex items-center justify-center text-xs font-mono",
                                        seat && seat !== ""
                                            ? "bg-blue-100 border border-blue-300"
                                            : "opacity-0 pointer-events-none",
                                        colIndex + 1 === Number(spaceAfterColumn) && "mr-7"
                                    )}
                                >
                                    {seat}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-4">
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}
