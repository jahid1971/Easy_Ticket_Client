# Responsive Table Implementation Guide

## Overview

This implementation provides a **fully reusable** responsive table solution using AG-Grid. The table adapts to mobile screens by **hiding columns and stacking information vertically** within the remaining essential columns, creating a mobile-friendly experience without separate components.

## Key Features

### 1. Reusable DataTable Component
- **Single component** works for all data types
- **No hardcoded data structures**
- **Completely generic** and reusable across the app

### 2. Aggressive Column Hiding on Mobile
- **Desktop**: All columns visible
- **Mobile**: Only essential columns shown (typically name/title + actions)
- **Vertical stacking**: Hidden column data appears within essential columns

### 3. Enhanced Mobile Cell Rendering
- Essential columns expand to show comprehensive information
- Card-like layout within table cells
- Better spacing and typography for mobile

## How It Works

### Desktop View
```
| SL | Route Name    | Source | Destination | Distance | Status | Actions |
|----|---------------|--------|-------------|----------|--------|---------|
| 1  | Route A       | City A | City B      | 150 km   | Active | Edit... |
```

### Mobile View
```
| SL | Route Name                              | Actions |
|----|----------------------------------------|---------|
| 1  | **Route A**                            | ...     |
|    | Source: City A                         |         |
|    | Destination: City B                    |         |
|    | Distance: 150 km  [Active Badge]      |         |
```

## Usage

### Basic Implementation

```tsx
// 1. Define responsive columns
const columnDefs: ResponsiveColDef[] = [
    {
        headerName: "Name",
        field: "name",
        priority: "essential", // Always visible
        cellRenderer: (params) => {
            const data = params.data;
            return (
                <div className="w-full py-2">
                    <div className="font-semibold text-base mb-2">
                        {data.name}
                    </div>
                    {/* Mobile-only details */}
                    <div className="md:hidden space-y-2">
                        <div>Email: {data.email}</div>
                        <div>Phone: {data.phone}</div>
                    </div>
                </div>
            );
        }
    },
    {
        headerName: "Email",
        field: "email", 
        priority: "high" // Hidden on mobile
    },
    {
        headerName: "Actions",
        field: "actions",
        priority: "essential" // Always visible
    }
];

// 2. Use DataTable (no mobile-specific props needed)
<DataTable
    columnDefs={columnDefs}
    rowData={data}
    title="Users"
    // ... other standard props
/>
```

### Column Priority System

```tsx
interface ResponsiveColDef extends ColDef {
    priority?: "essential" | "high" | "medium" | "low";
}
```

- **Essential**: Always visible (name, actions)
- **High/Medium/Low**: Hidden on mobile

### Mobile Cell Renderer Pattern

```tsx
cellRenderer: (params) => {
    const item = params.data;
    return (
        <div className="w-full py-2">
            {/* Desktop & Mobile: Main content */}
            <div className="font-semibold text-base mb-2">
                {item.primaryField}
            </div>
            
            {/* Mobile only: Additional details */}
            <div className="md:hidden space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Field 1: {item.field1}</div>
                    <div>Field 2: {item.field2}</div>
                </div>
                <div className="flex justify-between">
                    <span>Status: {item.status}</span>
                    <Badge>{item.category}</Badge>
                </div>
            </div>
        </div>
    );
}
```

## CSS Classes Used

- `md:hidden` - Show only on mobile (< 768px)
- `w-full py-2` - Full width with vertical padding
- `font-semibold text-base` - Prominent mobile headers
- `space-y-2` - Vertical spacing between elements
- `grid grid-cols-2 gap-2` - Two-column mobile layout

## Benefits

1. **Truly Reusable**: One DataTable component for all data
2. **No Hardcoding**: Works with any data structure
3. **Better Mobile UX**: Information presented clearly in vertical format
4. **Performance**: No additional components or complexity
5. **Maintainable**: Standard AG-Grid patterns with responsive enhancements

## Real-World Example

The routes table shows how this works in practice:
- **Desktop**: Shows all route details in separate columns
- **Mobile**: Shows route name with source/destination/distance/status stacked below
- **Reusable**: Same pattern works for users, products, orders, etc.

## Migration Guide

1. Replace `ColDef[]` with `ResponsiveColDef[]`
2. Add `priority: "essential"` to key columns (name, actions)
3. Add `priority: "high"` to important columns
4. Update essential columns with mobile-specific rendering
5. Test on mobile devices

This approach provides excellent mobile experience while keeping the DataTable component completely reusable and maintainable.
