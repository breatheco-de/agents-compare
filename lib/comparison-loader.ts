import { loadAgents, loadFeatures, loadAgentFeatureSupport } from './data-loader';
import { Agent, Feature, SupportLevel, AgentFeatureSupport } from '@/types';
import { ComparisonMatrix } from '@/types/comparison';

export type { ComparisonMatrix };

export async function loadComparisonMatrix(): Promise<ComparisonMatrix> {
  const agents = await loadAgents();
  const features = await loadFeatures();
  const allSupport = await loadAgentFeatureSupport();
  const matrix: ComparisonMatrix['matrix'] = {};
  
  // Initialize support distribution
  const supportDistribution: Record<SupportLevel, number> = {
    yes: 0,
    partial: 0,
    no: 0,
    unknown: 0,
  };

  // Build the comparison matrix
  for (const agent of agents) {
    matrix[agent.id] = {};
    const agentSupport = allSupport.filter((s: AgentFeatureSupport) => s.agent_id === agent.id);
    
    for (const feature of features) {
      const support = agentSupport.find((s: AgentFeatureSupport) => s.feature_id === feature.id);
      if (support) {
        matrix[agent.id][feature.id] = {
          level: support.support_level,
          notes: support.notes,
          examples: support.examples,
        };
        supportDistribution[support.support_level]++;
      } else {
        matrix[agent.id][feature.id] = {
          level: 'unknown',
        };
        supportDistribution.unknown++;
      }
    }
  }

  // Find the most recent update date (use current date as placeholder)
  const lastUpdated = new Date().toISOString().split('T')[0];

  return {
    agents,
    features,
    matrix,
    statistics: {
      totalAgents: agents.length,
      totalFeatures: features.length,
      totalComparisons: agents.length * features.length,
      lastUpdated,
      supportDistribution,
    },
  };
}

 