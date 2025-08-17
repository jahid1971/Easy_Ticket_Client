import { useTryCatch } from "@/utils/tryCatch";
import { useGlobalState } from "@/contexts/GlobalStateContext";


export function useAsync() {
    const tryCatch = useTryCatch();
    const { state, clearError } = useGlobalState();

    return {
        tryCatch,
        errorMsg: state.errorMsg,
        errorDetails: state.errorDetails,
        isLoading: state.isLoading,
        clearError,
    };
}

export default useAsync;