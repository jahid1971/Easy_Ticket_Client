import { useEffect, useState } from "react"

// MUI Material breakpoint equivalent (599px)
const SMALL_SCREEN_BREAKPOINT = 599

/**
 * Server-safe hook to detect small screens
 * Prevents hydration mismatches by defaulting to false during SSR
 */
export const useIsSmallScreen = (): boolean => {
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const checkIsSmallScreen = () => {
      setIsSmallScreen(window.innerWidth <= SMALL_SCREEN_BREAKPOINT)
    }

    checkIsSmallScreen()

    const mediaQuery = window.matchMedia(`(max-width: ${SMALL_SCREEN_BREAKPOINT}px)`)
    const handleChange = () => checkIsSmallScreen()
    
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Return false during SSR to prevent hydration mismatch
  return mounted ? isSmallScreen : false
}
