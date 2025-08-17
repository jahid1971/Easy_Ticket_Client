"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Types for the global state
export interface GlobalState {
    errorMsg: string;
    errorDetails: unknown;
    isLoading: boolean;
}

// Action types
export type GlobalAction =
    | { type: "SET_ERROR_MSG"; payload: string }
    | { type: "SET_ERROR_DETAILS"; payload: unknown }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "CLEAR_ERROR" };

    // Context type
interface GlobalStateContextType {
    state: GlobalState;
    dispatch: React.Dispatch<GlobalAction>;
    setErrorMsg: (message: string) => void;
    setErrorDetails: (details: unknown) => void;
    setLoading: (loading: boolean) => void;
    clearError: () => void;
}

// Provider component
interface GlobalStateProviderProps {
    children: ReactNode;
}

// Initial state
const initialState: GlobalState = {
    errorMsg: "",
    errorDetails: null,
    isLoading: false,
};

// Reducer function
function globalStateReducer(
    state: GlobalState,
    action: GlobalAction
): GlobalState {
    if (action.type === "SET_ERROR_MSG") {
        return { ...state, errorMsg: action.payload };
    }
    if (action.type === "SET_ERROR_DETAILS") {
        return { ...state, errorDetails: action.payload };
    }
    if (action.type === "SET_LOADING") {
        return { ...state, isLoading: action.payload };
    }
    if (action.type === "CLEAR_ERROR") {
        return { ...state, errorMsg: "", errorDetails: null };
    }
    return state;
}



// Create the context
const GlobalStateContext = createContext<GlobalStateContextType | null>(null);

// Custom hook to use the global state
export function useGlobalState() {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error(
            "useGlobalState must be used within a GlobalStateProvider"
        );
    }
    return context;
}



export function GlobalStateProvider({ children }: GlobalStateProviderProps) {
    const [state, dispatch] = useReducer(globalStateReducer, initialState);

    // Helper functions
    const setErrorMsg = (message: string) => {
        dispatch({ type: "SET_ERROR_MSG", payload: message });
    };

    const setErrorDetails = (details: unknown) => {
        dispatch({ type: "SET_ERROR_DETAILS", payload: details });
    };

    const setLoading = (loading: boolean) => {
        dispatch({ type: "SET_LOADING", payload: loading });
    };

    const clearError = () => {
        dispatch({ type: "CLEAR_ERROR" });
    };

    const contextValue: GlobalStateContextType = {
        state,
        dispatch,
        setErrorMsg,
        setErrorDetails,
        setLoading,
        clearError,
    };

    return (
        <GlobalStateContext.Provider value={contextValue}>
            {children}
        </GlobalStateContext.Provider>
    );
}
