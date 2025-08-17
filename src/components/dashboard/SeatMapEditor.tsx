"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomSelect from "@/components/ui/C_Select";
import { Plus, Minus, RotateCcw } from "lucide-react";
import SeatMapPreviewModal from "./SeatMapPreviewModal";
// Accept flexible seatMap shape (spaceAfterColumn can be string in form state)
import { cn } from "@/lib/utils";

interface SeatMapEditorProps {
    seatMap: { layout: string[][]; spaceAfterColumn?: string | number };
    onChange: (seatMap: {
        layout: string[][];
        spaceAfterColumn?: string | number;
    }) => void;
    error?: string;
    control: any;
    watch: any;
}

const SeatMapEditor = ({
    seatMap,
    onChange,
    error,
    control,
    watch,
}: SeatMapEditorProps) => {
    const [rows, setRows] = useState(seatMap?.layout?.length || 10);
    const [cols, setCols] = useState(seatMap?.layout[0]?.length || 4);
    const spaceAfterColumn = String(
        watch("seatMap.spaceAfterColumn") ?? seatMap?.spaceAfterColumn ?? "2"
    );

    const [previewOpen, setPreviewOpen] = useState(false);

    const buildGeneratedLayout = (
        totalRows: number,
        totalCols: number,
        base?: string[][]
    ) => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const newLayout: string[][] = [];

        for (let r = 0; r < totalRows; r++) {
            const row: string[] = [];
            for (let c = 0; c < totalCols; c++) {
                // Preserve any existing cell value (including empty string)
                if (base?.[r]?.[c] !== undefined) {
                    row.push(base[r][c]);
                    continue;
                }
                const letter = letters[r] || "Z";
                const number = row.filter((v) => v !== "").length + 1;
                row.push(`${letter}${number}`);
            }
            newLayout.push(row);
        }

        return newLayout;
    };

    const generateSeatMap = () => {
        const newLayout = buildGeneratedLayout(rows, cols, seatMap?.layout);
        onChange({ layout: newLayout, spaceAfterColumn });
    };

    const resetSeatMap = () => {
        const defaultRows = 10;
        const defaultCols = 4;
        setRows(defaultRows);
        setCols(defaultCols);
        const freshLayout = buildGeneratedLayout(defaultRows, defaultCols);
        onChange({ layout: freshLayout, spaceAfterColumn: "2" });
    };

    const toggleSeat = (rowIndex: number, colIndex: number) => {
        const newLayout = seatMap?.layout?.map((row, rIdx) =>
            row?.map((seat, cIdx) => {
                if (rIdx === rowIndex && cIdx === colIndex) {
                    return seat
                        ? ``
                        : `${String.fromCharCode(65 + rIdx)}${cIdx + 1}`;
                }
                return seat;
            })
        );

        let columnCount = 1;

        newLayout[rowIndex] = newLayout[rowIndex]?.map((seat) => {
            if (seat !== "") {
                const label = `${String.fromCharCode(
                    65 + rowIndex
                )}${columnCount}`;
                columnCount++;
                return label;
            }
            return "";
        });

        onChange({ ...seatMap, layout: newLayout, spaceAfterColumn });
    };

    useEffect(() => {
        generateSeatMap();
    }, [rows, cols]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Seat Map Configuration
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Controls */}
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">
                            Rows
                        </label>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setRows(Math.max(1, rows - 1))}
                                disabled={rows === 1}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-16 text-center font-mono">
                                {rows}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setRows(Math.min(26, rows + 1))}
                                disabled={rows === 26}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">
                            Columns
                        </label>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setCols(Math.max(1, cols - 1))}
                                disabled={cols === 1}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-16 text-center font-mono">
                                {cols}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setCols(Math.min(10, cols + 1))}
                                disabled={cols === 10}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons and Left Side Column Select */}
                <div className="lg:flex items-center gap-4 space-y-3 ">
                    <div className="flex-1 flex items-center gap-2">
                        <label className=" text-sm font-medium mb-1">
                            Left Side Column
                        </label>
                        <CustomSelect
                            id="seatMap.spaceAfterColumn"
                            size="xsm"
                            options={[
                                { value: "1", label: "1" },
                                { value: "2", label: "2" },
                                { value: "3", label: "3" },
                            ]}
                            control={control}
                            placeholder="Select column"
                        />
                    </div>

                    <div className="flex gap-2">
                        <SeatMapPreviewModal
                            open={previewOpen}
                            onOpenChange={setPreviewOpen}
                            seatMap={seatMap}
                            spaceAfterColumn={spaceAfterColumn}
                            trigger={<Button type="button" variant="default" size="sm">Preview Seat Map</Button>}
                        />
                        <Button
                            type="button"
                            onClick={resetSeatMap}
                            variant="outline"
                            size="sm"
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                    </div>
                </div>

                {/* Seat Map Preview */}
                <div className="mb-2">
                    <div className="text-xs font-mono text-muted-foreground bg-gray-50 p-2 rounded inline-block">
                        <span className="font-semibold">#</span> click seats to toggle seat selection 
                    </div>
                </div>
                {seatMap.layout.length > 0 && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="text-sm font-medium mb-2">
                            Seat Layout Preview (
                            {seatMap.layout.reduce(
                                (total, row) => total + row.length,
                                0
                            )}{" "}
                            seats)
                        </div>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                    {seatMap?.layout?.map((row, rowIndex) => (
                                <div
                                    key={rowIndex}
                                    className="flex justify-center gap-1"
                                >
                                    {row?.map((seat, colIndex) => {
                                        const isActive = !!seat && seat !== "";
                                        return (
                                            <div
                                                key={colIndex}
                                                role="button"
                                                aria-pressed={isActive}
                                                title={isActive ? `Seat ${seat} (click to deselect)` : "Empty seat (click to add)"}
                                                onClick={() => toggleSeat(rowIndex, colIndex)}
                                                className={cn(
                                                    "w-8 h-8 rounded flex items-center justify-center text-xs font-mono cursor-pointer select-none transition-colors",
                                                    isActive
                                                        ? "bg-secondary text-white border border-amber-700"
                                                        : "bg-green-300 border border-green-300 opacity-30 hover:opacity-60",
                                                    colIndex + 1 === Number(spaceAfterColumn) && "mr-7"
                                                )}
                                            >
                                                {seat}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="text-sm text-destructive">{error}</div>
                )}
            </CardContent>
        </Card>
    );
};

export default SeatMapEditor;
