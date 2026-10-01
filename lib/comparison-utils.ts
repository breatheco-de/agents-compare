import { AgentFeatureSupport, Feature } from '@/types';

// "Documented support" is the single support score used across the site:
// full support = 1, partial = 0.5, and no or unknown (not documented) = 0, averaged over every feature.
export const DOCUMENTED_SUPPORT_EXPLANATION =
  'Documented support: full support counts 1, partial 0.5, and "not supported" or "not documented" 0, averaged over all features. Coverage shows how many features have documented data.';

export function documentedSupportPercentage(supported: number, partial: number, total: number): number {
  return total > 0 ? Math.round(((supported + partial * 0.5) / total) * 100) : 0;
}

export interface SupportScore {
  total: number;
  // Features with documented data (anything other than "unknown")
  known: number;
  supported: number;
  partial: number;
  percentage: number;
}

function scoreEntries(entries: AgentFeatureSupport[], total: number): SupportScore {
  const supported = entries.filter(s => s.support_level === 'yes').length;
  const partial = entries.filter(s => s.support_level === 'partial').length;
  const known = entries.filter(s => s.support_level !== 'unknown').length;
  return { total, known, supported, partial, percentage: documentedSupportPercentage(supported, partial, total) };
}

// Documented support for one agent over the given features
export function getAgentScore(agentId: string, features: Feature[], supportMatrix: AgentFeatureSupport[]): SupportScore {
  const featureIds = new Set(features.map(f => f.id));
  return scoreEntries(supportMatrix.filter(s => s.agent_id === agentId && featureIds.has(s.feature_id)), features.length);
}

// Documented support for one feature across the given agents
export function getFeatureScore(featureId: string, agentIds: string[], supportMatrix: AgentFeatureSupport[]): SupportScore {
  const ids = new Set(agentIds);
  return scoreEntries(supportMatrix.filter(s => s.feature_id === featureId && ids.has(s.agent_id)), agentIds.length);
}
