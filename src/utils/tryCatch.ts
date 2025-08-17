import { toast } from "sonner";
import { useGlobalState } from "@/contexts/GlobalStateContext";

// Types for API responses
type ApiResponse = {
    success?: boolean;
    data?: {
        success?: boolean;
        data?: {
            success?: boolean;
        };
    };
    message?: string;
    error?: {
        data?: {
            message?: string;
            errorDetails?: unknown;
        };
    };
};

type tryCatch = (
    action: () => Promise<ApiResponse>,
    loadingMessage?: string,
    successMessage?: string,
    successAction?: () => void | Promise<void>
) => Promise<ApiResponse | undefined>;

// Hook version for use in components
export function useTryCatch() {
    const { setErrorMsg, setErrorDetails, clearError } = useGlobalState();

    const tryCatch: tryCatch = async (
        action,
        loadingMessage,
        successMessage,
        successAction
    ) => {
        const toastId = (
            loadingMessage ? toast.loading(`${loadingMessage}...`) : undefined
        ) as string | undefined;

        try {
            const res = await action();

            console.log(res, "response in try block");

            if (res?.success || res?.data?.success || res?.data?.data?.success) {
                if (successMessage) toast.success(successMessage, { id: toastId });

                if (successAction) await successAction();

                clearError();
            } else if (
                (res?.success === false || res?.error) &&
                (res?.message || res?.error?.data?.message)
            ) {
                console.log(res, "error response in else if block of tryCatch");

                setErrorMsg(res?.message || res?.error?.data?.message || "Unknown error");

                if (res?.error?.data?.errorDetails) {
                    setErrorDetails(res?.error?.data?.errorDetails);
                }

                toast.error(res?.message ?? res?.error?.data?.message, {
                    id: toastId,
                });
            } else if (res?.success === false || res?.error)
                toast.error("Something went wrong", { id: toastId });

            return res;
        } catch (err: unknown) {
            console.error(err, "error in catch block");
            
            const errorMessage = err instanceof Error ? err.message : "Something went wrong";
            setErrorMsg(errorMessage);

            const isAppError = err && typeof err === 'object' && 'type' in err && err.type === "AppError";
            
            if (isAppError && err instanceof Error) {
                toast.error(err.message, { id: toastId });
            } else {
                toast.error("Something went wrong ", { id: toastId });
            }
        }
    };

    return tryCatch;
}

// Standalone version for use outside components (with global state actions)
export const tryCatch = async (
    action: () => Promise<ApiResponse>,
    loadingMessage?: string,
    successMessage?: string,
    successAction?: () => void | Promise<void>,
    globalActions?: {
        setErrorMsg: (message: string) => void;
        setErrorDetails: (details: unknown) => void;
        clearError: () => void;
    }
): Promise<ApiResponse | undefined> => {
    const toastId = (
        loadingMessage ? toast.loading(`${loadingMessage}...`) : undefined
    ) as string | undefined;

    try {
        const res = await action();

        console.log(res, "response in try block");

        if (res?.success || res?.data?.success || res?.data?.data?.success) {
            if (successMessage) toast.success(successMessage, { id: toastId });

            if (successAction) await successAction();

            globalActions?.clearError();
        } else if (
            (res?.success === false || res?.error) &&
            (res?.message || res?.error?.data?.message)
        ) {
            console.log(res, "error response in else if block of tryCatch");

            globalActions?.setErrorMsg(res?.message || res?.error?.data?.message || "Unknown error");

            if (res?.error?.data?.errorDetails) {
                globalActions?.setErrorDetails(res?.error?.data?.errorDetails);
            }

            toast.error(res?.message ?? res?.error?.data?.message, {
                id: toastId,
            });
        } else if (res?.success === false || res?.error)
            toast.error("Something went wrong", { id: toastId });

        return res;
    } catch (err: unknown) {
        console.error(err, "error in catch block");
        
        const errorMessage = err instanceof Error ? err.message : "Something went wrong";
        globalActions?.setErrorMsg(errorMessage);

        const isAppError = err && typeof err === 'object' && 'type' in err && err.type === "AppError";
        
        if (isAppError && err instanceof Error) {
            toast.error(err.message, { id: toastId });
        } else {
            toast.error("Something went wrong ", { id: toastId });
        }
    }
};

export default tryCatch;
