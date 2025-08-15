"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type Option = { value: string; label: string; keywords?: string[] };

type LocationComboboxProps = {
    id: string;
    label: string;
    options: Option[];
    control: any;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
};

export function LocationCombobox({
    id,
    label,
    options,
    control,
    required,
    placeholder,
    disabled,
    className,
}: LocationComboboxProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={cn("w-full", className)}>
            <label htmlFor={id} className="block mb-1 text-sm font-medium text-foreground">
                {label}
                {required && <span className="ml-1 text-destructive">*</span>}
            </label>
            <Controller
                name={id}
                control={control}
                rules={required ? { required: `${label} is required` } : undefined}
                defaultValue=""
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
                                    error && "border-destructive focus:border-destructive"
                                )}
                                onClick={() => setOpen((p) => !p)}
                            >
                                <span className={cn(!field.value && "text-muted-foreground")}>
                                    {field.value
                                        ? options.find((o) => o.value === field.value)?.label
                                        : placeholder ?? `Select ${label.toLowerCase()}...`}
                                </span>
                                {/* <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" /> */}
                            </Button>
                        </PopoverTrigger>

                        {error?.message && (
                            <small className="text-destructive block mt-1">{error.message}</small>
                        )}

                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                            <Command>
                                <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
                                <CommandList>
                                    <CommandEmpty>No result found.</CommandEmpty>
                                    <CommandGroup>
                                        {options.map((opt) => (
                                            <CommandItem
                                                key={opt.value}
                                                value={opt.value}
                                                onSelect={(currentValue) => {
                                                    field.onChange(currentValue === field.value ? "" : currentValue);
                                                    setOpen(false);
                                                }}
                                                keywords={opt.keywords ?? [opt.label]}
                                            >
                                                {opt.label}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        field.value === opt.value ? "opacity-100" : "opacity-0"
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
