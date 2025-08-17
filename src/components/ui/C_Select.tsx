import React from "react";
import { Controller } from "react-hook-form";
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
    label: string;
    options: { value: string; label: string }[];
    disabled?: boolean;
    control?: any;
    required?: boolean;
    className?: string;
    defaultValue?: string;
    placeholder?: string;
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
}) => {
    return (
        <Controller
            name={id}
            control={control}
            rules={required ? { required: `${label} is required` } : undefined}
            defaultValue={defaultValue ?? ""}
            render={({ field, fieldState: { error } }) => (
                <div className="space-y-2">
                    <Select
                        disabled={disabled}
                        onValueChange={field.onChange}
                        value={field.value}
                    >
                        <SelectTrigger id={id} className={className}>
                            <SelectValue placeholder={placeholder || `Select ${label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>{label ? label : id}</SelectLabel>
                                {options?.filter(option => option.value !== "").map((option, index) => (
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
