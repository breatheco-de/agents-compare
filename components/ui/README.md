# UI Components

## Overview

This directory contains base UI components that are used throughout the application. These components provide standardized, reusable UI elements with consistent styling and behavior.

## Components

### `SupportLevelBadge.tsx` - Support Level Indicator

A standardized component for displaying support levels across the entire application. This component ensures visual consistency and includes built-in tooltips with explanations.

#### Features
- **Consistent Styling**: Standardized colors and icons for each support level
- **Built-in Tooltips**: Hover tooltips explaining what each level means
- **Data Source Disclaimer**: Tooltips include information about data sourcing and accuracy
- **Responsive Positioning**: Tooltips automatically position based on available space
- **Accessibility**: Full ARIA support and keyboard navigation

#### Usage
```tsx
import SupportLevelBadge from '@/components/ui/SupportLevelBadge'

// Basic usage with icon
<SupportLevelBadge level="yes" showIcon />

// Without icon
<SupportLevelBadge level="partial" />

// With custom label
<SupportLevelBadge level="no" showIcon>
  Not Available
</SupportLevelBadge>

// Without tooltip (rare use case)
<SupportLevelBadge level="unknown" showIcon showTooltip={false} />
```

#### Support Levels
- **yes** (✅): Full support - Feature is fully implemented and documented
- **partial** (⚠️): Partial support - Feature has limited implementation or requires workarounds
- **no** (❌): Not supported - Feature is not available in this agent
- **unknown** (❓): Unknown - Support status has not been verified

#### Props
```tsx
interface SupportLevelBadgeProps {
  level: 'yes' | 'partial' | 'no' | 'unknown'
  showIcon?: boolean      // Show emoji icon (default: false)
  children?: React.ReactNode // Custom label text
  showTooltip?: boolean   // Show hover tooltip (default: true)
}
```

#### Tooltip Features
- **Smart Positioning**: Automatically positions above, below, left, or right based on viewport space
- **Explanatory Text**: Each level has a clear explanation of what it means
- **Data Disclaimer**: Includes information about data accuracy and sourcing:
  > "Support information is sourced from official documentation and public information. While we strive for accuracy, there may be human or machine errors. Please verify critical features directly with the vendor."

#### Styling
The component uses standardized color schemes:
- **Yes**: Green (`text-green-400 bg-green-400/10 border-green-400/20`)
- **Partial**: Yellow (`text-yellow-400 bg-yellow-400/10 border-yellow-400/20`)
- **No**: Red (`text-red-400 bg-red-400/10 border-red-400/20`)
- **Unknown**: Gray (`text-gray-400 bg-gray-400/10 border-gray-400/20`)

## Best Practices

### ✅ DO
- Always use `SupportLevelBadge` for displaying support levels
- Include `showIcon` for better visual recognition
- Let the tooltip display by default for user education
- Use consistent support level values across the app

### ❌ DON'T
- Create custom support level displays
- Override the component's color scheme
- Disable tooltips without good reason
- Use inconsistent terminology for support levels

## Consistency Rules

This component is the **ONLY** way to display support levels in the application. Any custom implementations or variations are forbidden to maintain visual and functional consistency.

See the [Component Organization Rules](../.cursor/rules/components.mdc) for more details on the mandatory use of this component. 