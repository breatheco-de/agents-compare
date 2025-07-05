'use client'

import React, { useState, useRef, useEffect } from 'react'

// Support Level Badge Component for consistency across the entire app
interface SupportLevelBadgeProps {
  level: 'yes' | 'partial' | 'no' | 'unknown'
  showIcon?: boolean
  children?: React.ReactNode
  showTooltip?: boolean
}

// Support level descriptions for tooltips
const supportLevelDescriptions = {
  yes: 'Full support - This feature is fully implemented and documented',
  partial: 'Partial support - This feature has limited implementation or requires workarounds',
  no: 'Not supported - This feature is not available in this agent',
  unknown: 'Unknown - Support status has not been verified'
}

export default function SupportLevelBadge({ 
  level, 
  showIcon = false, 
  children,
  showTooltip = true 
}: SupportLevelBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top')
  const badgeRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  
  const levelConfigs = {
    yes: {
      icon: '✅',
      label: 'Full Support',
      className: 'text-green-400 bg-green-400/10 border-green-400/20'
    },
    partial: {
      icon: '⚠️',
      label: 'Partial',
      className: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
    },
    no: {
      icon: '❌',
      label: 'No Support',
      className: 'text-red-400 bg-red-400/10 border-red-400/20'
    },
    unknown: {
      icon: '❓',
      label: 'Unknown',
      className: 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }
  
  const config = levelConfigs[level]

  // Determine optimal tooltip position based on available space
  useEffect(() => {
    if (isHovered && badgeRef.current && tooltipRef.current) {
      const badgeRect = badgeRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const scrollY = window.scrollY

      // Check if there's enough space above
      if (badgeRect.top - scrollY > tooltipRect.height + 10) {
        setTooltipPosition('top')
      }
      // Check if there's enough space below
      else if (viewportHeight - badgeRect.bottom > tooltipRect.height + 10) {
        setTooltipPosition('bottom')
      }
      // Check if there's enough space to the right
      else if (viewportWidth - badgeRect.right > tooltipRect.width + 10) {
        setTooltipPosition('right')
      }
      // Default to left
      else {
        setTooltipPosition('left')
      }
    }
  }, [isHovered])

  const getTooltipClasses = () => {
    const baseClasses = "absolute z-50 w-72 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-xl text-sm"
    
    switch (tooltipPosition) {
      case 'top':
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`
      case 'bottom':
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-2`
      case 'right':
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 ml-2`
      case 'left':
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 mr-2`
      default:
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`
    }
  }

  const getArrowClasses = () => {
    switch (tooltipPosition) {
      case 'top':
        return (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            <div className="absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-700 -top-px"></div>
          </div>
        )
      case 'bottom':
        return (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-1">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
            <div className="absolute w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-700 top-px"></div>
          </div>
        )
      case 'right':
        return (
          <div className="absolute top-1/2 right-full transform -translate-y-1/2 -mr-1">
            <div className="w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
            <div className="absolute w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-700 -left-px"></div>
          </div>
        )
      case 'left':
        return (
          <div className="absolute top-1/2 left-full transform -translate-y-1/2 -ml-1">
            <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800"></div>
            <div className="absolute w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-700 left-px"></div>
          </div>
        )
      default:
        return null
    }
  }
  
  return (
    <div className="relative inline-block" ref={badgeRef}>
      <span 
        className={`px-2 py-1 rounded text-xs font-medium border ${config.className} cursor-help`}
        onMouseEnter={() => showTooltip && setIsHovered(true)}
        onMouseLeave={() => showTooltip && setIsHovered(false)}
        aria-describedby={isHovered ? `tooltip-${level}` : undefined}
      >
        {showIcon && `${config.icon} `}
        {children || config.label}
      </span>
      
      {/* Tooltip */}
      {showTooltip && isHovered && (
        <div 
          ref={tooltipRef}
          id={`tooltip-${level}`}
          role="tooltip"
          className={getTooltipClasses()}
        >
          <div className="space-y-2">
            <p className="text-gray-200 font-medium">
              {supportLevelDescriptions[level]}
            </p>
            <p className="text-gray-400 text-xs border-t border-gray-700 pt-2">
              ℹ️ Support information is sourced from official documentation and public information. 
              While we strive for accuracy, there may be human or machine errors. 
              Please verify critical features directly with the vendor.
            </p>
          </div>
          
          {/* Arrow pointing to the badge */}
          {getArrowClasses()}
        </div>
      )}
    </div>
  )
}

// Export the support level configurations for consistent usage
export const SUPPORT_LEVELS = {
  yes: { icon: '✅', text: 'Yes', label: 'Full Support' },
  partial: { icon: '⚠️', text: 'Partial', label: 'Partial' },
  no: { icon: '❌', text: 'No', label: 'No Support' },
  unknown: { icon: '❓', text: 'Unknown', label: 'Unknown' }
} as const 