"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export type ComboboxOption = {
    value: string;
    label: string;
    keywords?: string[];
};

type ComboboxProps = {
    id: string;
    label?: string;
    options: ComboboxOption[];
    control: any;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
};

export function Combobox({
    id,
    label,
    options,
    control,
    required,
    placeholder,
    disabled,
    className,
    defaultValue = "",
    onChange,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={cn("w-full", className)}>
            <label
                htmlFor={id}
                className="block mb-1 text-sm font-medium text-foreground"
            >
                {label}
                {required && <span className="ml-1 text-destructive">*</span>}
            </label>
            <Controller
                name={id}
                control={control}
                rules={
                    required
                        ? { required: `${label ?? id} is required` }
                        : undefined
                }
                defaultValue={defaultValue}
                render={({ field, fieldState: { error } }) => (
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                id={id}
                                type="button"
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                disabled={disabled}
                                className={cn(
                                    "justify-between w-full",
                                    error &&
                                        "border-destructive focus:border-destructive"
                                )}
                                onClick={() => setOpen((p) => !p)}
                            >
                                <span
                                    className={cn(
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value
                                        ? options?.find(
                                              (o) => o.value === field.value
                                          )?.label
                                        : placeholder ??
                                          `Select ${(
                                              label ?? id
                                          ).toLowerCase()}...`}
                                </span>
                            </Button>
                        </PopoverTrigger>

                        {error?.message && (
                            <small className="text-destructive block mt-1">
                                {error.message}
                            </small>
                        )}

                        <PopoverContent
                            className="w-[--radix-popover-trigger-width] p-0"
                            align="start"
                        >
                            <Command>
                                <CommandInput
                                    placeholder={`Search ${(
                                        label ?? id
                                    ).toLowerCase()}...`}
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        No result found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {options?.map((opt) => (
                                            <CommandItem
                                                key={opt.value}
                                                value={opt.value}
                                                onSelect={(currentValue) => {
                                                    field.onChange(
                                                        currentValue ===
                                                            field.value
                                                            ? ""
                                                            : currentValue
                                                    );
                                                    setOpen(false);
                                                    onChange?.(currentValue);
                                                }}
                                                keywords={
                                                    opt.keywords ?? [opt.label]
                                                }
                                            >
                                                {opt.label}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        field.value ===
                                                            opt.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                )}
            />
        </div>
    );
}

// Main export as C_Combobox
export { Combobox as C_Combobox };
