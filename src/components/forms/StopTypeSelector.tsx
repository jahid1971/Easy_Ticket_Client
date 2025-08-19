"use client";

import React from 'react';
import { Control, useController } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StopType } from '@/types/RouteStop';

type Props = {
    control: Control<any>;
    name: string;
};

const StopTypeSelector: React.FC<Props> = ({ control, name }) => {
    const { field } = useController({
        name,
        control,
    });

    return (
        <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-32">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="BOARDING">BOARDING</SelectItem>
                <SelectItem value="DROPPING">DROPPING</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default React.memo(StopTypeSelector);
