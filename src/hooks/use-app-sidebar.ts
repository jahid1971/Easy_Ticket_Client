import { useSidebar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

export function useAppSidebar() {
    const sidebar = useSidebar();
    const [isAnimating, setIsAnimating] = useState(false);
    
    useEffect(() => {
        // Add a short animation state when toggling
        setIsAnimating(true);
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 200); // Match the CSS transition duration
        
        return () => clearTimeout(timer);
    }, [sidebar.state]);
    
    return {
        ...sidebar,
        isAnimating,
        isCollapsed: sidebar.state === "collapsed",
        isExpanded: sidebar.state === "expanded",
    };
}