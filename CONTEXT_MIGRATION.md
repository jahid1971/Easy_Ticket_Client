# Redux to Context API Migration Guide

## Overview

This document outlines the migration from Redux-based global state management to React Context API for the EasyTicket project. The refactoring focuses specifically on the `tryCatch` utility and global error state management.

## What Changed

### Before (Redux-based)
```typescript
// Old Redux implementation
import { setErrorDetails, setErrorMsg } from "@/redux/slices/generalSlices";
import { store } from "@/redux/store";

export const tryCatch = async (
    action,
    loadingMessage,
    successMessage,
    successAction,
    dispatch
) => {
    const dispatchFn = dispatch || store.dispatch;
    // ... Redux dispatch logic
    dispatchFn(setErrorMsg("error"));
};
```

### After (Context API-based)
```typescript
// New Context API implementation
import { useGlobalState } from "@/contexts/GlobalStateContext";

export function useTryCatch() {
    const { setErrorMsg, setErrorDetails, clearError } = useGlobalState();
    // ... Context-based state management
}
```

## New Architecture

### 1. Global State Context (`src/contexts/GlobalStateContext.tsx`)

Provides centralized state management for:
- Error messages
- Error details  
- Loading states

```typescript
interface GlobalState {
    errorMsg: string;
    errorDetails: unknown;
    isLoading: boolean;
}
```

### 2. Refactored TryCatch Utility (`src/utils/tryCatch.ts`)

Two implementations:
- **Hook version** (`useTryCatch`): For use inside React components
- **Standalone version** (`tryCatch`): For use outside components with manual state injection

### 3. Convenience Hook (`src/hooks/useAsync.ts`)

Combines tryCatch with global state access:
```typescript
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
```

## Usage Examples

### 1. In React Components (Recommended)

```typescript
import { useAsync } from "@/hooks";

function MyComponent() {
    const { tryCatch, errorMsg, clearError } = useAsync();
    
    const handleSubmit = async () => {
        await tryCatch(
            async () => await apiCall(),
            "Processing...",           // Loading message
            "Success!",               // Success message
            () => router.push('/success') // Success callback
        );
    };
    
    return (
        <div>
            <button onClick={handleSubmit}>Submit</button>
            {errorMsg && (
                <div className="error">
                    {errorMsg}
                    <button onClick={clearError}>Clear</button>
                </div>
            )}
        </div>
    );
}
```

### 2. Outside Components (Advanced)

```typescript
import { tryCatch } from "@/utils/tryCatch";

// Must provide global actions manually
const globalActions = {
    setErrorMsg: (msg) => console.log(msg),
    setErrorDetails: (details) => console.log(details),
    clearError: () => console.log('cleared')
};

await tryCatch(
    async () => await apiCall(),
    "Loading...",
    "Success!",
    undefined,
    globalActions
);
```

## Setup Instructions

### 1. Provider Setup (Already Done)

The `GlobalStateProvider` is added to `src/app/layout.tsx`:

```typescript
export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider>
                    <GlobalStateProvider>
                        <QueryProvider>
                            {children}
                        </QueryProvider>
                        <Toaster richColors position="top-right" />
                    </GlobalStateProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
```

### 2. Migration Steps for Existing Code

1. **Replace Redux imports:**
   ```diff
   - import { useDispatch } from 'react-redux';
   - import { setErrorMsg } from '@/redux/slices/generalSlices';
   + import { useAsync } from '@/hooks';
   ```

2. **Update component logic:**
   ```diff
   function MyComponent() {
   -    const dispatch = useDispatch();
   +    const { tryCatch, errorMsg } = useAsync();
       
       const handleAction = async () => {
   -        await tryCatch(apiCall, "Loading", "Success", undefined, dispatch);
   +        await tryCatch(apiCall, "Loading", "Success");
       };
   }
   ```

3. **Remove Redux dependencies:**
   - Remove Redux store setup
   - Remove Redux slices
   - Update package.json (remove redux/react-redux if not used elsewhere)

## Benefits

### 1. Reduced Complexity
- No Redux boilerplate
- Simpler state management
- Less configuration

### 2. Better TypeScript Support
- Proper typing without Redux complexity
- Type-safe context usage
- Better IntelliSense

### 3. Performance
- Reduced bundle size
- No Redux DevTools overhead
- Simpler re-render logic

### 4. Maintainability
- Fewer dependencies
- Easier to understand
- Context API is built into React

## API Reference

### GlobalStateContext

```typescript
interface GlobalStateContextType {
    state: GlobalState;
    dispatch: React.Dispatch<GlobalAction>;
    setErrorMsg: (message: string) => void;
    setErrorDetails: (details: unknown) => void;
    setLoading: (loading: boolean) => void;
    clearError: () => void;
}
```

### useTryCatch Hook

```typescript
type tryCatch = (
    action: () => Promise<ApiResponse>,
    loadingMessage?: string,
    successMessage?: string,
    successAction?: () => void | Promise<void>
) => Promise<ApiResponse | undefined>;
```

### useAsync Hook

```typescript
function useAsync(): {
    tryCatch: tryCatch;
    errorMsg: string;
    errorDetails: unknown;
    isLoading: boolean;
    clearError: () => void;
}
```

## Migration Checklist

- [x] Create GlobalStateContext
- [x] Refactor tryCatch utility
- [x] Create useAsync convenience hook
- [x] Update layout.tsx with provider
- [x] Add Toaster for notifications
- [x] Create example component
- [x] Update TypeScript types
- [x] Fix compilation issues
- [ ] Update existing components to use new pattern
- [ ] Remove Redux dependencies
- [ ] Update tests

## Next Steps

1. **Identify all components using the old tryCatch pattern**
2. **Migrate each component to use the new useAsync hook**
3. **Remove Redux store and related files**
4. **Update package.json to remove Redux dependencies**
5. **Update tests to work with Context API**

## Notes

- The new implementation maintains backward compatibility through the standalone `tryCatch` function
- Toast notifications are now handled automatically through Sonner
- Error state is managed globally but can be cleared per component
- Loading states can be managed globally if needed in the future