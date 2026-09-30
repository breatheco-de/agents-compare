'use client'

import React, { useState, useRef, useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import {
  SUPPORT_LEVELS,
  SUPPORT_LEVEL_TEXT,
  SUPPORT_LEVEL_DESCRIPTIONS,
  SUPPORT_DATA_DISCLAIMER,
  type SupportLevelKey
} from '@/lib/support-levels'

// Re-exported for existing client-side imports
export { SUPPORT_LEVELS, SUPPORT_LEVEL_ORDER, SUPPORT_LEVEL_TEXT } from '@/lib/support-levels'
export type { SupportLevelKey } from '@/lib/support-levels'

// Support Level Badge Component for consistency across the entire app
interface SupportLevelBadgeProps {
  level: 'yes' | 'partial' | 'no' | 'unknown'
  showIcon?: boolean
  children?: React.ReactNode
  showTooltip?: boolean
}

// Support level descriptions for tooltips
const supportLevelDescriptions = SUPPORT_LEVEL_DESCRIPTIONS

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
        className={`inline-block whitespace-nowrap px-2 py-1 rounded text-xs font-medium border ${config.className} cursor-help`}
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
              ℹ️ {SUPPORT_DATA_DISCLAIMER}
            </p>
          </div>
          
          {/* Arrow pointing to the badge */}
          {getArrowClasses()}
        </div>
      )}
    </div>
  )
}

interface SupportLevelIconProps {
  level: SupportLevelKey
  className?: string
  // Tooltip heading, e.g. "Cursor · MCP Server Support"
  context?: string
  // Support notes for this agent/feature, shown in the tooltip
  notes?: string
  // When set, the icon renders as a button (keyboard focus also shows the tooltip)
  onClick?: () => void
  buttonLabel?: string
  buttonClassName?: string
  showTooltip?: boolean
}

const TOOLTIP_WIDTH = 288

// Emoji-only support indicator with an accessible label and a detailed tooltip.
// The tooltip is rendered in a portal with fixed positioning so scroll containers don't clip it.
export function SupportLevelIcon({
  level,
  className = '',
  context,
  notes,
  onClick,
  buttonLabel,
  buttonClassName = '',
  showTooltip = true
}: SupportLevelIconProps) {
  const tooltipId = useId()
  const triggerRef = useRef<HTMLElement | null>(null)
  const [tip, setTip] = useState<{ left: number; top: number; above: boolean } | null>(null)

  const show = () => {
    if (!showTooltip || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const above = rect.top > 220
    const left = Math.min(
      Math.max(rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2, 8),
      window.innerWidth - TOOLTIP_WIDTH - 8
    )
    setTip({ left, top: above ? rect.top - 8 : rect.bottom + 8, above })
  }
  const hide = () => setTip(null)

  // Hide on any scroll or resize, since the tooltip is positioned against the viewport
  useEffect(() => {
    if (!tip) return
    window.addEventListener('scroll', hide, true)
    window.addEventListener('resize', hide)
    return () => {
      window.removeEventListener('scroll', hide, true)
      window.removeEventListener('resize', hide)
    }
  }, [tip])

  const emoji = (
    <span role="img" aria-label={SUPPORT_LEVEL_TEXT[level].full} className="text-lg leading-none">
      {SUPPORT_LEVELS[level].icon}
    </span>
  )

  const tooltip = tip && createPortal(
    <div
      id={tooltipId}
      role="tooltip"
      style={{ position: 'fixed', left: tip.left, top: tip.top, width: TOOLTIP_WIDTH, transform: tip.above ? 'translateY(-100%)' : undefined }}
      className="pointer-events-none z-[60] space-y-2 rounded-lg border border-gray-700 bg-gray-800 p-3 text-left text-sm shadow-xl"
    >
      {context && <p className="font-semibold text-gray-100">{context}</p>}
      <p className="text-gray-200">{SUPPORT_LEVELS[level].icon} {SUPPORT_LEVEL_DESCRIPTIONS[level]}</p>
      {notes && <p className="line-clamp-4 text-xs text-gray-300">{notes}</p>}
      <p className="border-t border-gray-700 pt-2 text-xs text-gray-400">ℹ️ {SUPPORT_DATA_DISCLAIMER}</p>
    </div>,
    document.body
  )

  if (onClick) {
    return (
      <>
        <button
          ref={el => { triggerRef.current = el }}
          type="button"
          onClick={onClick}
          onMouseEnter={show}
          onMouseLeave={hide}
          onFocus={show}
          onBlur={hide}
          aria-label={buttonLabel}
          aria-describedby={tip ? tooltipId : undefined}
          className={buttonClassName}
        >
          {emoji}
        </button>
        {tooltip}
      </>
    )
  }

  return (
    <>
      <span
        ref={el => { triggerRef.current = el }}
        onMouseEnter={show}
        onMouseLeave={hide}
        aria-describedby={tip ? tooltipId : undefined}
        className={`inline-flex items-center justify-center ${className}`}
      >
        {emoji}
      </span>
      {tooltip}
    </>
  )
}
