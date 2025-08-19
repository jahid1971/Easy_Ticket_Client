import { ColDef } from "@ag-grid-community/core";

export type ColumnPriority = "essential" | "high" | "medium" | "low";

export interface ResponsiveColDef extends ColDef {
    priority?: ColumnPriority;
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
}

/**
 * Filter columns based on screen size and priority
 */
export const getResponsiveColumns = (
    columns: ResponsiveColDef[],
    isMobile: boolean,
    isTablet: boolean = false
): ResponsiveColDef[] => {
    return columns.filter((col) => {
        // Always show essential columns
        if (col.priority === "essential") return true;
        
        // On mobile, be more aggressive - only show essential columns
        if (isMobile) {
            // Only show essential columns on mobile
            return false;
        }
        
        // Hide specific columns on tablet if marked  
        if (isTablet && col.hideOnTablet) return false;
        
        return true;
    });
};

/**
 * Apply responsive sizing to columns
 */
export const applyResponsiveSizing = (
    columns: ResponsiveColDef[],
    isMobile: boolean
): ResponsiveColDef[] => {
    return columns.map((col) => {
        const responsiveCol = { ...col };
        
        if (isMobile) {
            // Adjust column widths for mobile
            if (col.field === "actions") {
                responsiveCol.width = 70;
                responsiveCol.maxWidth = 70;
                responsiveCol.minWidth = 70;
                responsiveCol.flex = undefined;
            } else if (col.headerName === "SL") {
                responsiveCol.width = 40;
                responsiveCol.maxWidth = 40;
                responsiveCol.minWidth = 40;
                responsiveCol.flex = undefined;
            } else if (col.priority === "essential") {
                // Essential columns get more space on mobile
                responsiveCol.flex = 3;
                responsiveCol.minWidth = 200;
            } else {
                // Other visible columns get standard flex
                responsiveCol.flex = 1;
                responsiveCol.minWidth = 120;
            }
        }
        
        return responsiveCol;
    });
};

/**
 * Default column definitions with responsive properties
 */
export const createResponsiveDefaultColDef = (isMobile: boolean): ColDef => {
    return {
        flex: 1,
        minWidth: isMobile ? 100 : 150,
        resizable: !isMobile,
        sortable: true,
        filter: false,
        floatingFilter: false,
        suppressMenu: isMobile,
    };
};
