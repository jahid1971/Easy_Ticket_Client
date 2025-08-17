"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { C_Input } from "@/components/ui/C_Input";
import { Plus, Minus, RotateCcw } from "lucide-react";
import { SeatMap } from "@/types/Bus";

interface SeatMapEditorProps {
    seatMap: SeatMap;
    onChange: (seatMap: SeatMap) => void;
    error?: string;
}

const SeatMapEditor = ({ seatMap, onChange, error }: SeatMapEditorProps) => {
    const [rows, setRows] = useState(seatMap.layout.length || 10);
    const [cols, setCols] = useState(seatMap.layout[0]?.length || 4);

    const generateSeatMap = () => {
        const layout: string[][] = [];
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        
        for (let row = 0; row < rows; row++) {
            const currentRow: string[] = [];
            for (let col = 0; col < cols; col++) {
                const letter = letters[row] || "Z";
                const number = col + 1;
                currentRow.push(`${letter}${number}`);
            }
            layout.push(currentRow);
        }
        
        onChange({
            layout,
            columnPosition: {
                leftSide: Array.from({ length: Math.floor(cols / 2) }, (_, i) => i),
                rightSide: Array.from({ length: Math.ceil(cols / 2) }, (_, i) => Math.floor(cols / 2) + i),
            },
        });
    };

    const resetSeatMap = () => {
        setRows(10);
        setCols(4);
        onChange({
            layout: [],
            columnPosition: {
                leftSide: [0, 1],
                rightSide: [2, 3],
            },
        });
    };

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
                        <label className="block text-sm font-medium mb-1">Rows</label>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setRows(Math.max(1, rows - 1))}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-16 text-center font-mono">{rows}</span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setRows(Math.min(26, rows + 1))}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Columns</label>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setCols(Math.max(1, cols - 1))}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-16 text-center font-mono">{cols}</span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setCols(Math.min(10, cols + 1))}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        type="button"
                        onClick={generateSeatMap}
                        variant="default"
                        size="sm"
                    >
                        Generate Seat Map
                    </Button>
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

                {/* Seat Map Preview */}
                {seatMap.layout.length > 0 && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="text-sm font-medium mb-2">
                            Seat Layout Preview ({seatMap.layout.reduce((total, row) => total + row.length, 0)} seats)
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {seatMap.layout.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex justify-center gap-1">
                                    {row.map((seat, colIndex) => (
                                        <div
                                            key={colIndex}
                                            className="w-8 h-8 bg-blue-100 border border-blue-300 rounded flex items-center justify-center text-xs font-mono"
                                        >
                                            {seat}
                                        </div>
                                    ))}
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