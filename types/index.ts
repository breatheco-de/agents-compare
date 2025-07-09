export type SupportLevel = 'yes' | 'partial' | 'no' | 'unknown'

export type Category = 'Model Support' | 'Editor Integration' | 'Execution' | 'Planning' | 'Configuration' | 'Debugging'

// Enum constants for validation
export const SUPPORT_LEVELS = ['yes', 'partial', 'no', 'unknown'] as const
export const CATEGORIES = ['Model Support', 'Editor Integration', 'Execution', 'Planning', 'Configuration', 'Debugging'] as const

export interface FAQ {
  question: string
  answer: string
}

export interface Agent {
  id: string
  name: string
  aliases: string[]
  provider: string
  website: string
  supported_ide: string[]
  description: string
  faq?: FAQ[]
}

export interface Feature {
  id: string
  name: string
  aliases: string[]
  category: Category
  description: string
}

export interface AgentFeatureSupport {
  agent_id: string
  feature_id: string
  support_level: SupportLevel
  notes: string
  examples: string[]
  last_verified: string
  sources: string[]
}

export interface Index {
  features: string[]
  agents: string[]
  comparisons: string[]
}

export interface SearchResult {
  type: 'agent' | 'feature'
  id: string
  name: string
  description: string
  score: number
}

export interface ComparisonData {
  agents: Agent[]
  features: Feature[]
  support_matrix: AgentFeatureSupport[]
}

export interface ApiResponse<T> {
  data: T
  status: 'success' | 'error'
  message?: string
} 