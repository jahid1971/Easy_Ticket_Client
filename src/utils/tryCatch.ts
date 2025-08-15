import { setErrorDetails, setErrorMsg } from "@/redux/slices/generalSlices";
import { toast } from "sonner";
import { store } from "@/redux/store";

type tryCatch = (
    action: () => Promise<any>,
    loadingMessage?: string,
    successMessage?: string,
    successAction?: () => any,
    dispatch?: typeof store.dispatch
) => Promise<void>;

export const tryCatch: tryCatch = async (
    action,
    loadingMessage,
    successMessage,
    successAction,
    dispatch
) => {
    const toastId = (
        loadingMessage ? toast.loading(`${loadingMessage}...`) : undefined
    ) as string | undefined;

    const dispatchFn = dispatch || store.dispatch;

    try {
        const res = await action();

        console.log(res, "response in try block");

        if (res?.success || res?.data?.success || res?.data?.data?.success) {
            if (successMessage) toast.success(successMessage, { id: toastId });

            if (successAction) await successAction();

            dispatchFn(setErrorMsg(""));
        } else if (
            (res?.success === false || res?.error) &&
            (res?.message || res?.error?.data?.message)
        ) {
            console.log(res, "error response in else if block of tryCatch");

            dispatchFn(setErrorMsg(res?.message || res?.error?.data?.message));

            if (res?.error?.data?.errorDetails) {
                dispatchFn(setErrorDetails(res?.error?.data?.errorDetails));
            }

            toast.error(res?.message ?? res?.error?.data?.message, {
                id: toastId,
            });
        } else if (res?.success === false || res?.error)
            toast.error("Something went wrong", { id: toastId });

        return res;
    } catch (err: any) {
        console.error(err, "error in catch block");

        dispatchFn(setErrorMsg(err?.message || "Something went wrong"));

        err?.type === "AppError"
            ? toast.error(err.message, { id: toastId })
            : toast.error("Something went wrong ", { id: toastId });
    }
};
export default tryCatch;
