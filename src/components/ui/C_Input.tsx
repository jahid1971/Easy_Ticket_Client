import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Controller } from "react-hook-form";

export type CInputProps = {
    className?: string;
    label: string;
    label_2?: React.ReactNode;
    type?: string;
    error?: any;
    id: string;
    control?: any;
    rules?: any;
    onChange?: any;
    value?: any;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
};

export const C_Input = forwardRef<HTMLInputElement, CInputProps>(
    (
        {
            className,
            label,
            label_2,
            type = "text",
            id,
            error,
            control,
            rules,
            required,
            ...props
        },
        ref
    ) => {
        return (
            <div className="w-full">
                <label htmlFor={id} className="block mb-1 text-sm font-medium text-foreground">
                    {label} {label_2}
                    {required && <span className="ml-1 text-destructive">*</span>}
                </label>
                {control ? (
                    <Controller
                        name={id}
                        control={control}
                        rules={{
                            ...rules,
                            required: required ? `${label} is required` : undefined,
                        }}
                        defaultValue={props.value ?? ""}
                        render={({ field, fieldState: { error } }) => (
                            <>
                                <input
                                    type={type}
                                    id={id}
                                    ref={ref}
                                    className={cn(
                                        "block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
                                        className,
                                        error && "border-destructive focus:border-destructive"
                                    )}
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    placeholder={props.placeholder}
                                    disabled={props.disabled}
                                    {...props}
                                />
                                {error?.message && (
                                    <small className="text-destructive block mt-1">{error.message}</small>
                                )}
                            </>
                        )}
                    />
                ) : (
                    <input
                        type={type}
                        id={id}
                        ref={ref}
                        className={cn(
                            "block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
                            className,
                            error && "border-destructive focus:border-destructive"
                        )}
                        value={props.value ?? ""}
                        onChange={props.onChange}
                        placeholder={props.placeholder}
                        disabled={props.disabled}
                        {...props}
                    />
                )}
                {error && typeof error === "string" && (
                    <small className="text-destructive block mt-1">{error}</small>
                )}
            </div>
        );
    }
);

C_Input.displayName = "C_Input";
