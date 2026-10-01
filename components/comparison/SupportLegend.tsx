'use client'

import { SupportStatusIcon } from '@/components/ui/SupportStatusIcon'
import { SUPPORT_LEVEL_ORDER, SUPPORT_LEVEL_TEXT, type SupportLevelKey } from '@/lib/support-levels'

interface SupportLegendFilterProps {
  shown: SupportLevelKey[]
  onToggle: (level: SupportLevelKey) => void
  onShowAll: () => void
  counts: Record<SupportLevelKey, number>
  className?: string
}

// Legend that doubles as a filter: each status chip shows or hides that status in the matrix
export function SupportLegendFilter({ shown, onToggle, onShowAll, counts, className = '' }: SupportLegendFilterProps) {
  const allShown = SUPPORT_LEVEL_ORDER.every(level => shown.includes(level))

  return (
    <fieldset className={`m-0 flex min-w-0 flex-wrap items-center gap-2 border-0 p-0 ${className}`}>
      <legend className="float-left mr-1 text-xs font-medium uppercase tracking-wider text-gray-500">Legend</legend>
      {SUPPORT_LEVEL_ORDER.map(level => {
        const isShown = shown.includes(level)
        // Keep at least one status visible
        const isLast = isShown && shown.length === 1
        let title = `${isShown ? 'Hide' : 'Show'} "${SUPPORT_LEVEL_TEXT[level].full}"`
        if (isLast) title = 'At least one status must stay visible'
        return (
          <button
            key={level}
            type="button"
            aria-pressed={isShown}
            disabled={isLast}
            onClick={() => onToggle(level)}
            title={title}
            className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed ${
              isShown
                ? 'border-gray-600 bg-gray-800 text-gray-100 hover:bg-gray-700'
                : 'border-dashed border-gray-700 bg-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className={isShown ? '' : 'opacity-40'}>
              <SupportStatusIcon level={level} size={16} label={null} />
            </span>
            <span className={isShown ? '' : 'line-through'}>
              <span className="hidden sm:inline">{SUPPORT_LEVEL_TEXT[level].full}</span>
              <span className="sm:hidden">{SUPPORT_LEVEL_TEXT[level].short}</span>
            </span>
            <span className="font-mono text-xs tabular-nums text-gray-500">{counts[level]}</span>
          </button>
        )
      })}
      {!allShown && (
        <button type="button" onClick={onShowAll} className="px-1 text-sm font-medium text-blue-400 hover:text-blue-300 focus:outline-none focus-visible:underline">
          Show all
        </button>
      )}
    </fieldset>
  )
}
