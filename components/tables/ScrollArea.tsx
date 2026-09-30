'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollAreaProps {
  children: React.ReactNode
  className?: string
  label: string
}

// Scrollable region that shows a fade and a "Scroll →" hint while content is hidden on the right
export function ScrollArea({ children, className = '', label }: ScrollAreaProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
    update()
    el.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="relative">
      <div ref={ref} role="region" aria-label={label} tabIndex={0} className={`overflow-auto ${className}`}>
        {children}
      </div>
      {canScrollRight && (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-900 to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute right-3 top-3 z-40 rounded bg-blue-600/90 px-2 py-1 text-xs font-medium text-white shadow">
            Scroll →
          </div>
        </>
      )}
    </div>
  )
}
