import { Agent, Feature, SupportLevel } from './index';

export interface ComparisonMatrix {
  agents: Agent[];
  features: Feature[];
  matrix: Record<string, Record<string, {
    level: SupportLevel;
    notes?: string;
    examples?: string[];
  }>>;
  statistics: {
    totalAgents: number;
    totalFeatures: number;
    totalComparisons: number;
    lastUpdated: string;
    supportDistribution: Record<SupportLevel, number>;
  };
} 