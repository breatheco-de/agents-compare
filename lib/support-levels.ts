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

// Longer description of each level, shown in tooltips
export const SUPPORT_LEVEL_DESCRIPTIONS: Record<SupportLevelKey, string> = {
  yes: 'Full support - This feature is fully implemented and documented',
  partial: 'Partial support - This feature has limited implementation or requires workarounds',
  no: 'Not supported - This feature is not available in this agent',
  unknown: 'Unknown - Support status has not been verified'
}

export const SUPPORT_DATA_DISCLAIMER =
  'Support information is sourced from official documentation and public information. ' +
  'While we strive for accuracy, there may be human or machine errors. ' +
  'Please verify critical features directly with the vendor.'
