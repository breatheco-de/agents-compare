import React from 'react'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'default' | 'narrow' | 'wide' | 'full'
  variant?: 'default' | 'fullscreen'
}

/**
 * Standardized page container component that ensures consistent layout across all pages.
 * 
 * This component MUST be used for ALL page layouts to prevent margin/spacing inconsistencies.
 * See .cursor/rules/layout.md for complete usage guidelines.
 * 
 * @param maxWidth - Controls the maximum width constraint
 *   - 'default': Standard container width (no max-width)
 *   - 'narrow': max-w-4xl (prose/article content)  
 *   - 'wide': max-w-6xl (dashboard/complex layouts)
 *   - 'full': max-w-full (full width layouts)
 * 
 * @param variant - Layout variant
 *   - 'default': Standard page layout
 *   - 'fullscreen': Full screen layout with dark background
 * 
 * @example
 * // Standard page
 * <PageContainer>
 *   <h1>Page Title</h1>
 * </PageContainer>
 * 
 * @example  
 * // Agent detail page
 * <PageContainer variant="fullscreen" maxWidth="wide">
 *   <h1>Agent Details</h1>
 * </PageContainer>
 */
export default function PageContainer({ 
  children, 
  className = '',
  maxWidth = 'default',
  variant = 'default'
}: PageContainerProps) {
  
  // Max width classes
  const maxWidthClasses = {
    default: 'max-w-6xl', // Uses container's built-in responsive max-widths
    narrow: 'max-w-4xl',
    wide: 'max-w-6xl', 
    full: 'max-w-full'
  }
  
  // Base container classes - STANDARDIZED
  const baseClasses = `container mx-auto px-4 py-8 ${maxWidthClasses[maxWidth]}`
  
  if (variant === 'fullscreen') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className={`${baseClasses} ${className}`}>
          {children}
        </div>
      </div>
    )
  }
  
  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  )
} 