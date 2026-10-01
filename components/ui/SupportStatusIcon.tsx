import type { SupportLevelKey } from '@/lib/support-levels'
import { SUPPORT_LEVEL_TEXT } from '@/lib/support-levels'

// Status colors (fixed, not themed); the icons also differ by shape so color is never the only cue
const COLORS = {
  yes: '#0ca30c',
  partial: '#fab219',
  no: '#d03b3b',
  unknown: '#8a93a8'
} as const

interface SupportStatusIconProps {
  level: SupportLevelKey
  size?: number
  className?: string
  // Accessible label; pass null when a parent already describes the status
  label?: string | null
}

// ✓ in a green circle, ! in an amber triangle, × in a red square, ? in a dashed grey circle
export function SupportStatusIcon({ level, size = 20, className = '', label }: SupportStatusIconProps) {
  const a11y = label === null
    ? { 'aria-hidden': true as const }
    : { role: 'img', 'aria-label': label ?? SUPPORT_LEVEL_TEXT[level].full }

  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={`inline-block shrink-0 ${className}`} {...a11y}>
      {level === 'yes' && (
        <>
          <circle cx="10" cy="10" r="9" fill={COLORS.yes} />
          <path d="M5.6 10.4l3 3 5.9-6.5" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {level === 'partial' && (
        <>
          <path d="M10 1.6c.5 0 .9.3 1.2.7l7.9 13.9c.5.9-.1 2-1.2 2H2.1c-1 0-1.7-1.1-1.2-2L8.8 2.3c.3-.4.7-.7 1.2-.7z" fill={COLORS.partial} />
          <rect x="9" y="6.4" width="2" height="6.2" rx="1" fill="#1b1403" />
          <circle cx="10" cy="15" r="1.2" fill="#1b1403" />
        </>
      )}
      {level === 'no' && (
        <>
          <rect x="1.5" y="1.5" width="17" height="17" rx="4" fill={COLORS.no} />
          <path d="M6.6 6.6l6.8 6.8M13.4 6.6l-6.8 6.8" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}
      {level === 'unknown' && (
        <>
          <circle cx="10" cy="10" r="8.3" fill="none" stroke={COLORS.unknown} strokeWidth="1.6" strokeDasharray="3 2.3" />
          <path d="M7.7 7.9a2.4 2.4 0 1 1 3.5 2.1c-.8.4-1.2.9-1.2 1.7v.4" fill="none" stroke={COLORS.unknown} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="10" cy="14.6" r="1.1" fill={COLORS.unknown} />
        </>
      )}
    </svg>
  )
}
