import { SUPPORT_LEVELS, SUPPORT_LEVEL_ORDER, SUPPORT_LEVEL_TEXT } from '@/lib/support-levels'

interface SupportLegendProps {
  compact?: boolean
  className?: string
}

// Legend explaining the support level emojis used in the comparison views
export function SupportLegend({ compact = false, className = '' }: SupportLegendProps) {
  return (
    <div className={`flex flex-wrap items-center text-gray-300 ${compact ? 'gap-x-3 gap-y-1 text-xs' : 'gap-x-6 gap-y-2 text-sm'} ${className}`}>
      <span className="font-medium text-gray-400">Legend:</span>
      <ul className={`flex flex-wrap items-center ${compact ? 'gap-x-3 gap-y-1' : 'gap-x-6 gap-y-2'}`}>
        {SUPPORT_LEVEL_ORDER.map(level => (
          <li key={level} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={compact ? 'text-sm' : 'text-base'}>
              {SUPPORT_LEVELS[level].icon}
            </span>
            <span>{compact ? SUPPORT_LEVEL_TEXT[level].short : SUPPORT_LEVEL_TEXT[level].full}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
