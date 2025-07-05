'use client'

import React, { ReactNode } from 'react'
import SupportLevelBadge from '@/components/ui/SupportLevelBadge'

interface TableProps {
  children: React.ReactNode
  className?: string
  ariaLabel?: string
}

interface TableHeaderProps {
  children: React.ReactNode
  className?: string
}

interface TableBodyProps {
  children: React.ReactNode
  className?: string
}

interface TableRowProps {
  children: React.ReactNode
  className?: string
  isHeader?: boolean
  isSticky?: boolean
  hover?: boolean
  id?: string
  hidden?: boolean
  'data-feature'?: string
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
  scope?: 'row' | 'col' | 'rowgroup' | 'colgroup'
  colSpan?: number
  isHeader?: boolean
}

// Main Table Component
export function Table({ children, className = '', ariaLabel }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table 
        role="table"
        aria-label={ariaLabel}
        className={`w-full border border-gray-600 ${className}`}
      >
        {children}
      </table>
    </div>
  )
}

// Table Header Component
export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={className}>
      {children}
    </thead>
  )
}

// Table Body Component
export function TableBody({ children, className = '' }: TableBodyProps) {
  return (
    <tbody className={className}>
      {children}
    </tbody>
  )
}

// Table Row Component
export function TableRow({ 
  children, 
  className = '', 
  isHeader = false, 
  isSticky = false,
  hover = true,
  id,
  hidden,
  'data-feature': dataFeature
}: TableRowProps) {
  const baseClasses = 'border-b border-gray-600 last:border-b-0'
  const hoverClasses = hover ? 'hover:bg-gray-800/30 transition-colors' : ''
  const headerClasses = isHeader ? 'bg-gray-800/50' : ''
  const stickyClasses = isSticky ? 'sticky top-0 z-10' : ''
  
  return (
    <tr 
      id={id}
      hidden={hidden}
      data-feature={dataFeature}
      className={`${baseClasses} ${hoverClasses} ${headerClasses} ${stickyClasses} ${className}`}
    >
      {children}
    </tr>
  )
}

// Table Cell Component
export function TableCell({ 
  children, 
  className = '', 
  scope,
  colSpan,
  isHeader = false 
}: TableCellProps) {
  const baseClasses = 'p-4 text-left'
  const headerClasses = isHeader ? 'font-semibold text-gray-200' : ''
  
  const Component = isHeader ? 'th' : 'td'
  
  return (
    <Component 
      scope={scope}
      colSpan={colSpan}
      className={`${baseClasses} ${headerClasses} ${className}`}
    >
      {children}
    </Component>
  )
}

// Export all components as named exports and also as default
const TableComponents = {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  SupportLevelBadge
}

export default TableComponents 