"use client";

import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay = 300): T {
    // If no delay, return value directly to avoid unnecessary state/effects
    const [debounced, setDebounced] = useState<T>(value);

    useEffect(() => {
        if (!delay || delay <= 0) {
            setDebounced(value);
            return;
        }
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);

    return delay && delay > 0 ? debounced : value;
}
