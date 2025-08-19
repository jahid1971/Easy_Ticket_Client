import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type TCustomSelectProps = {
    id: string;
    label?: string;
    options: { value: string; label: string }[];
    disabled?: boolean;
    control?: any;
    required?: boolean;
    className?: string;
    defaultValue?: string | number;
    placeholder?: string;
    size?: "sm" | "default";
};

const CustomSelect: React.FC<TCustomSelectProps> = ({
    id,
    label,
    options,
    control,
    disabled,
    required,
    className,
    defaultValue,
    placeholder,
    size = "default",
}) => {
    const methods = useFormContext?.();
    const cntxtControl = methods?.control ?? control;
    
    // prefer watch (subscribes) to pick up nested default values from form; fallback to getValues or provided defaultValue
    const watched = methods?.watch ? methods.watch(id) : undefined;
    const getVal = methods?.getValues ? methods.getValues(id) : undefined;
    const initialValue = String(watched ?? getVal ?? defaultValue ?? "");

    return (
        <Controller
            name={id}
            control={cntxtControl}
            rules={required ? { required: `${label} is required` } : undefined}
            defaultValue={initialValue}
            render={({ field, fieldState: { error } }) => (
                <div className="space-y-2">
                    <Select
                        disabled={disabled}
                        onValueChange={field.onChange}
                        value={field.value}
                    >
                        <SelectTrigger
                            size={size}
                            id={id}
                            className={className}
                        >
                            <SelectValue
                                placeholder={
                                    placeholder ||
                                    `Select ${label ? label : id} `
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>{label ? label : id}</SelectLabel>
                                {options
                                    ?.filter((option) => option.value !== "")
                                    .map((option, index) => (
                                        <SelectItem
                                            className="cursor-pointer"
                                            key={index}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {error && (
                        <p className="text-red-500 text-sm">{error.message}</p>
                    )}
                </div>
            )}
        />
    );
};

export default CustomSelect;
