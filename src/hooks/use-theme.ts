"use client"

import { useTheme as useNextTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useTheme() {
    const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Return consistent values during SSR to prevent hydration mismatch
    if (!mounted) {
        return {
            theme: "system" as const,
            setTheme,
            resolvedTheme: "light" as const,
            systemTheme: "light" as const,
            isDark: false,
            isLight: true,
            isSystem: true,
            mounted: false,
            toggleTheme: () => {},
            setDarkMode: () => {},
            setLightMode: () => {},
            setSystemMode: () => {},
        }
    }

    const isDark = resolvedTheme === "dark"
    const isLight = resolvedTheme === "light"
    const isSystem = theme === "system"

    const toggleTheme = () => {
        if (theme === "dark") {
            setTheme("light")
        } else if (theme === "light") {
            setTheme("dark")
        } else {
            // If system, toggle to opposite of current resolved theme
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
        }
    }

    const setDarkMode = () => setTheme("dark")
    const setLightMode = () => setTheme("light")
    const setSystemMode = () => setTheme("system")

    return {
        theme,
        setTheme,
        resolvedTheme,
        systemTheme,
        isDark,
        isLight,
        isSystem,
        mounted,
        toggleTheme,
        setDarkMode,
        setLightMode,
        setSystemMode,
    }
}