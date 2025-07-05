# Table Components - Standardized Styling

## Overview

This directory contains standardized table components that ensure consistent styling across all tables in the application. **ALL tables must use these components** to maintain visual consistency.

## Components

### `Table.tsx` - Main Table Components

#### Core Components
- `Table` - Main table wrapper with overflow handling
- `TableHeader` - Table header section
- `TableBody` - Table body section  
- `TableRow` - Individual table rows with consistent styling
- `TableCell` - Table cells (handles both `<th>` and `<td>`)

#### Related Components
- `SupportLevelBadge` - Standardized support level indicators (located in `/components/ui/`)

#### Styling Standards
- **Borders**: `border-gray-600` for all table borders
- **Headers**: `bg-gray-800/50` background
- **Hover**: `hover:bg-gray-800/30` for interactive rows
- **Padding**: `p-4` for all cells
- **Font**: `font-semibold text-gray-200` for headers

## Usage Examples

### Basic Table
```tsx
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/tables/Table'

<Table ariaLabel="Description of table content">
  <TableHeader>
    <TableRow isHeader>
      <TableCell isHeader scope="col">Column 1</TableCell>
      <TableCell isHeader scope="col">Column 2</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Support Level Badge
```tsx
import SupportLevelBadge from '@/components/ui/SupportLevelBadge'

<SupportLevelBadge level="yes" showIcon />        // ✅ Full Support
<SupportLevelBadge level="partial" showIcon />    // ⚠️ Partial  
<SupportLevelBadge level="no" showIcon />         // ❌ No Support
<SupportLevelBadge level="unknown" showIcon />    // ❓ Unknown
```

### Advanced Features
```tsx
{/* Sticky header row */}
<TableRow isHeader isSticky>
  <TableCell isHeader scope="rowgroup" colSpan={3}>
    Category Header
  </TableCell>
</TableRow>

{/* Row without hover effects */}
<TableRow hover={false} className="bg-gray-800/50">
  <TableCell colSpan={3}>
    Expandable content
  </TableCell>
</TableRow>

{/* Row with data attributes */}
<TableRow data-feature="feature-id" id="row-id">
  <TableCell>Content</TableCell>
</TableRow>
```

## Accessibility Features

All table components include proper accessibility features:

- **ARIA Labels**: Tables require `ariaLabel` prop
- **Scope Attributes**: Headers use proper `scope` values
- **Semantic Markup**: Correct `<th>` vs `<td>` elements
- **Keyboard Navigation**: Focus management included
- **Screen Reader**: Proper table structure announced

## Consistency Rules

### ✅ ALWAYS Use These Components
- For any tabular data display
- For comparison matrices  
- For feature support tables
- For data grids

### ❌ NEVER Create Custom Tables
- Don't use raw `<table>` elements
- Don't create page-specific table components
- Don't use different border colors or spacing
- Don't skip accessibility attributes

### 🎨 Visual Consistency
- All tables use `border-gray-600` borders
- All headers use `bg-gray-800/50` backgrounds
- All hover states use `hover:bg-gray-800/30`
- All cells use `p-4` padding
- All support levels use `SupportLevelBadge` from `/components/ui/`

## Current Implementation

### ✅ Converted Tables
- **Homepage**: Quick Feature Comparison table
- **Agent Pages**: Support Matrix tables
- **Feature Pages**: Agent Support Matrix tables

### 📋 Future Tables
All new tables MUST use these components from day one.

## Props Reference

### Table
```tsx
interface TableProps {
  children: React.ReactNode
  className?: string        // Optional additional classes
  ariaLabel?: string       // Required for accessibility
}
```

### TableRow  
```tsx
interface TableRowProps {
  children: React.ReactNode
  className?: string       // Optional additional classes
  isHeader?: boolean      // Adds header background
  isSticky?: boolean      // Makes row sticky
  hover?: boolean         // Enable/disable hover (default: true)
  id?: string            // HTML id attribute
  hidden?: boolean       // Hide/show row
  'data-feature'?: string // Data attribute for features
}
```

### TableCell
```tsx
interface TableCellProps {
  children: React.ReactNode
  className?: string       // Optional additional classes
  scope?: 'row' | 'col' | 'rowgroup' | 'colgroup'
  colSpan?: number        // Column span
  isHeader?: boolean      // Renders as <th> vs <td>
}
```

### SupportLevelBadge (in `/components/ui/`)
```tsx
interface SupportLevelBadgeProps {
  level: 'yes' | 'partial' | 'no' | 'unknown'
  showIcon?: boolean      // Show emoji icons (recommended: always true)
  children?: React.ReactNode // Custom label override
}
```

## Migration Guide

When updating existing tables:

1. Import the table components
2. Replace `<table>` with `<Table>`
3. Replace `<thead>` with `<TableHeader>`
4. Replace `<tbody>` with `<TableBody>`
5. Replace `<tr>` with `<TableRow>`
6. Replace `<th>/<td>` with `<TableCell>`
7. Add proper props (`isHeader`, `scope`, etc.)
8. Replace support level spans with `<SupportLevelBadge>` from `/components/ui/`

This ensures all tables maintain the same visual appearance and accessibility standards across the entire application. 