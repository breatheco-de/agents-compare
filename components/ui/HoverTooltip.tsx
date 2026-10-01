'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const DEFAULT_WIDTH = 288

interface HoverTooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  // Element that triggers the tooltip; buttons and links also show it on keyboard focus
  as?: 'span' | 'button' | 'a'
  href?: string
  onClick?: () => void
  ariaLabel?: string
  className?: string
  width?: number
  enabled?: boolean
}

// Tooltip rendered in a portal with fixed positioning, so scroll containers and sticky cells don't clip it
export function HoverTooltip({
  content,
  children,
  as = 'span',
  href,
  onClick,
  ariaLabel,
  className = '',
  width = DEFAULT_WIDTH,
  enabled = true
}: HoverTooltipProps) {
  const tooltipId = useId()
  const triggerRef = useRef<HTMLElement | null>(null)
  const [tip, setTip] = useState<{ left: number; top: number; above: boolean } | null>(null)

  const show = () => {
    if (!enabled || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const above = rect.top > 220
    const left = Math.min(Math.max(rect.left + rect.width / 2 - width / 2, 8), window.innerWidth - width - 8)
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

  const setRef = (el: HTMLElement | null) => { triggerRef.current = el }
  const shared = {
    onMouseEnter: show,
    onMouseLeave: hide,
    'aria-describedby': tip ? tooltipId : undefined,
    className
  }

  const tooltip = tip && createPortal(
    <div
      id={tooltipId}
      role="tooltip"
      style={{ position: 'fixed', left: tip.left, top: tip.top, width, transform: tip.above ? 'translateY(-100%)' : undefined }}
      className="pointer-events-none z-[60] space-y-2 rounded-lg border border-gray-700 bg-gray-950 p-3 text-left text-sm font-normal normal-case tracking-normal text-gray-200 shadow-xl"
    >
      {content}
    </div>,
    document.body
  )

  let trigger: React.ReactNode
  if (as === 'button') {
    trigger = (
      <button ref={setRef} type="button" onClick={onClick} onFocus={show} onBlur={hide} aria-label={ariaLabel} {...shared}>
        {children}
      </button>
    )
  } else if (as === 'a') {
    trigger = (
      <a ref={setRef} href={href} onFocus={show} onBlur={hide} aria-label={ariaLabel} {...shared}>
        {children}
      </a>
    )
  } else {
    trigger = <span ref={setRef} {...shared}>{children}</span>
  }

  return (
    <>
      {trigger}
      {tooltip}
    </>
  )
}
