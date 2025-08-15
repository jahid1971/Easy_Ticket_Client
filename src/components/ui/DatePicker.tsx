import React, { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

// Define the DatePickerProps type
interface DatePickerProps<TFormValues extends FieldValues = FieldValues> {
  name: Path<TFormValues>;
  label?: string;
  control?: Control<TFormValues>;
  rules?: any;
  disabled?: boolean;
}

export function DatePicker<TFormValues extends FieldValues = FieldValues>({
  name,
  label = "Select date",
  control,
  rules,
  disabled,
}: DatePickerProps<TFormValues>) {
  const [open, setOpen] = useState(false);
  const [localDate, setLocalDate] = useState<Date | undefined>(undefined);

  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          const selected = field.value ? new Date(field.value) : undefined;
          return (
            <div className="flex flex-col gap-3">
              <Label htmlFor={name} className="px-1">
                {label}
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id={name}
                    className="w-full justify-between font-normal"
                    disabled={disabled}
                  >
                    {selected ? selected.toLocaleDateString() : label}
                    <CalendarIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selected}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(date.toISOString());
                      }
                      setOpen(false);
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          );
        }}
      />
    );
  }

  // Fallback standalone datepicker (no react-hook-form)
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={name} className="px-1">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={name}
            className="w-full justify-between font-normal"
            disabled={disabled}
          >
            {localDate ? localDate.toLocaleDateString() : label}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={localDate}
            captionLayout="dropdown"
            onSelect={(date) => {
              setLocalDate(date);
              setOpen(false);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
