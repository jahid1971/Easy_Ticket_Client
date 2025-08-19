import { debounce } from "@/utils/generalUtils";
import { useEffect } from "react";
import {
    FieldValues,
    FormProvider,
    SubmitHandler,
    useForm,
} from "react-hook-form";

type TFormConfig = {
    resolver?: any;
    defaultValues?: Record<string, any>;
};

type TFormProps = {
    children: React.ReactNode;
    onSubmit?: SubmitHandler<FieldValues>;
    error?: string;
    onlyDirtyFields?: boolean;
    handleFieldChange?: (field: string, value: any) => void;
    query?: any;
    className?: string;
} & TFormConfig;

const C_FormProvider = ({
    children,
    onSubmit,
    resolver,
    defaultValues,
    error,
    onlyDirtyFields,
    handleFieldChange,
    query,
    className,
}: TFormProps) => {
    const formConfig: TFormConfig = {};

    if (resolver) {
        formConfig["resolver"] = resolver;
    }

    if (defaultValues) {
        formConfig["defaultValues"] = defaultValues;
    }

    const methods = useForm(formConfig);

    const { handleSubmit, watch, formState, getValues, setValue } = methods;

    const { dirtyFields } = formState;

    const submit: SubmitHandler<FieldValues> = (data) => {
        //for update only changed fields --------------------------
        const changedValues = Object.keys(dirtyFields).reduce(
            (acc: Record<string, any>, field) => {
                acc[field] = data[field] === "" ? undefined : data[field];
                return acc;
            },
            {} as Record<string, any>
        );

        const nonEmptyValues = Object.keys(data).reduce(
            (acc: Record<string, any>, field) => {
                acc[field] =
                    (typeof data[field] === "string" &&
                        data[field].trim() === "") ||
                    data[field] === null ||
                    (Array.isArray(data[field]) && data[field].length === 0)
                        ? undefined
                        : data[field];
                return acc;
            },
            {} as Record<string, any>
        );

        onSubmit && onSubmit(onlyDirtyFields ? changedValues : nonEmptyValues);
    };


    return (
        <FormProvider {...methods}>
            {error && (
                <p className="py-1 my-2 bg-red-50 border border-red-500">
                    {error}
                </p>
            )}
            <form onSubmit={handleSubmit(submit)} className={className}>
                {children}
            </form>
        </FormProvider>
    );
};

export default C_FormProvider;
