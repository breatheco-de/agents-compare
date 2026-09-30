// Support level display constants shared by server and client components.
// Kept outside 'use client' modules so server components (e.g. SupportLegend on the home page) can use them.

export const SUPPORT_LEVELS = {
  yes: { icon: '✅', text: 'Yes', label: 'Full Support' },
  partial: { icon: '⚠️', text: 'Partial', label: 'Partial' },
  no: { icon: '❌', text: 'No', label: 'No Support' },
  unknown: { icon: '❓', text: 'Unknown', label: 'Unknown' }
} as const

export type SupportLevelKey = keyof typeof SUPPORT_LEVELS

// Display order and accessible text for each level (used by icons and legends)
export const SUPPORT_LEVEL_ORDER: SupportLevelKey[] = ['yes', 'partial', 'no', 'unknown']

export const SUPPORT_LEVEL_TEXT: Record<SupportLevelKey, { full: string; short: string }> = {
  yes: { full: 'Full support', short: 'Full' },
  partial: { full: 'Partial support', short: 'Partial' },
  no: { full: 'Not supported', short: 'No' },
  unknown: { full: 'Unknown (not verified)', short: 'Unknown' }
}
