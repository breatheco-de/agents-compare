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

// Short column labels for the comparison matrix (the full name is shown in a tooltip)
export const FEATURE_SHORT_NAMES: Record<string, string> = {
  'automatic-context-awareness': 'Auto context',
  'filesystem-access': 'File access',
  'mcp-support': 'MCP',
  'broad-ide-integration': 'IDEs',
  'claude-latest-support': 'Claude 4.5+',
  'context-window': 'Context window',
  'console-error-integration': 'Console errors',
  'interactive-element-selection': 'UI selection',
  'live-web-preview': 'Web preview',
  'dedicated-instruction-file': 'Rules file',
  'fine-grained-instruction-control': 'Pattern rules',
  'supports-scoped-instructions': 'Rule scopes',
  'planner-strategy': 'Planning'
}

// Category display order and short band labels for the comparison matrix
export const CATEGORY_ORDER = ['Execution', 'Editor Integration', 'Model Support', 'Debugging', 'Configuration', 'Planning']

export const CATEGORY_SHORT_NAMES: Record<string, string> = {
  'Execution': 'Execution',
  'Editor Integration': 'Editor',
  'Model Support': 'Models',
  'Debugging': 'Debugging',
  'Configuration': 'Configuration',
  'Planning': 'Planning'
}

// Features sorted by CATEGORY_ORDER, keeping their original order within each category
export function orderFeaturesByCategory<T extends { category: string }>(features: T[]): T[] {
  const rank = (c: string) => {
    const i = CATEGORY_ORDER.indexOf(c)
    return i === -1 ? CATEGORY_ORDER.length : i
  }
  return features
    .map((f, i) => ({ f, i }))
    .sort((a, b) => rank(a.f.category) - rank(b.f.category) || a.i - b.i)
    .map(({ f }) => f)
}
