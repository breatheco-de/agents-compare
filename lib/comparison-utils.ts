import { Agent, Feature, SupportLevel } from '@/types';
import { ComparisonMatrix } from '@/types/comparison';

export function calculateAgentStatistics(
  agent: Agent,
  matrix: ComparisonMatrix['matrix'],
  features: Feature[]
): {
  supportPercentage: number;
  supportCounts: Record<SupportLevel, number>;
} {
  const supportCounts: Record<SupportLevel, number> = {
    yes: 0,
    partial: 0,
    no: 0,
    unknown: 0,
  };

  for (const feature of features) {
    const support = matrix[agent.id]?.[feature.id];
    if (support) {
      supportCounts[support.level]++;
    }
  }

  const supportPercentage = features.length > 0
    ? Math.round(((supportCounts.yes + supportCounts.partial * 0.5) / features.length) * 100)
    : 0;

  return { supportPercentage, supportCounts };
}

export function calculateFeatureStatistics(
  feature: Feature,
  matrix: ComparisonMatrix['matrix'],
  agents: Agent[]
): {
  supportCounts: Record<SupportLevel, number>;
  supportedAgents: string[];
} {
  const supportCounts: Record<SupportLevel, number> = {
    yes: 0,
    partial: 0,
    no: 0,
    unknown: 0,
  };
  const supportedAgents: string[] = [];

  for (const agent of agents) {
    const support = matrix[agent.id]?.[feature.id];
    if (support) {
      supportCounts[support.level]++;
      if (support.level === 'yes' || support.level === 'partial') {
        supportedAgents.push(agent.id);
      }
    }
  }

  return { supportCounts, supportedAgents };
} 