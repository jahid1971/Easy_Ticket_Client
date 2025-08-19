/**
 * CSS-based responsive utilities for Next.js
 * This approach avoids hydration mismatches by using CSS media queries
 */

// Tailwind breakpoints (you can adjust these to match your design system)
export const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const

// CSS class utilities for responsive design
export const responsive = {
  // Show only on mobile (below md breakpoint)
  showOnMobile: 'block md:hidden',
  
  // Hide on mobile (show on md and above)
  hideOnMobile: 'hidden md:block',
  
  // Show only on desktop (md and above)
  showOnDesktop: 'hidden md:block',
  
  // Hide on desktop (show only on mobile)
  hideOnDesktop: 'block md:hidden',
  
  // Responsive grid
  responsiveGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  
  // Responsive flex
  responsiveFlex: 'flex flex-col md:flex-row',
  
  // Responsive padding/spacing
  responsivePadding: 'p-4 md:p-6 lg:p-8',
  responsiveMargin: 'm-4 md:m-6 lg:m-8',
  
  // Responsive text sizes
  responsiveText: 'text-sm md:text-base lg:text-lg',
  responsiveHeading: 'text-lg md:text-xl lg:text-2xl',
} as const

/**
 * Server-safe responsive hook with proper hydration handling
 * This is the recommended approach for dynamic responsive behavior
 */
import { useEffect, useState } from 'react'

export function useResponsive(breakpoint: keyof typeof breakpoints = 'md') {
  const [matches, setMatches] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const query = `(min-width: ${breakpoints[breakpoint]})`
    const media = window.matchMedia(query)
    
    setMatches(media.matches)
    
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }
    
    media.addEventListener('change', listener)
    
    return () => media.removeEventListener('change', listener)
  }, [breakpoint])

  // Return false during SSR to prevent hydration mismatch
  return mounted ? matches : false
}

/**
 * Hook to check if screen is mobile (below md breakpoint)
 */
export function useIsMobileScreen() {
  const isDesktop = useResponsive('md')
  return !isDesktop
}

/**
 * Hook to get current breakpoint
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<keyof typeof breakpoints>('sm')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const updateBreakpoint = () => {
      const width = window.innerWidth
      
      if (width >= 1536) setBreakpoint('2xl')
      else if (width >= 1280) setBreakpoint('xl')
      else if (width >= 1024) setBreakpoint('lg')
      else if (width >= 768) setBreakpoint('md')
      else if (width >= 640) setBreakpoint('sm')
      else setBreakpoint('sm')
    }
    
    updateBreakpoint()
    
    window.addEventListener('resize', updateBreakpoint)
    
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return mounted ? breakpoint : 'sm'
}
