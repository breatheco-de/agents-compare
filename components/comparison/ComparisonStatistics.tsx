'use client';

import { ComparisonMatrix } from '@/types/comparison';
import { calculateAgentStatistics, calculateFeatureStatistics } from '@/lib/comparison-utils';
import { Agent, Feature } from '@/types';

interface ComparisonStatisticsProps {
  data: ComparisonMatrix;
  filteredAgents: Agent[];
  filteredFeatures: Feature[];
}

export function ComparisonStatistics({ data, filteredAgents, filteredFeatures }: ComparisonStatisticsProps) {
  // Calculate statistics for filtered data
  const filteredStats = {
    totalComparisons: filteredAgents.length * filteredFeatures.length,
    supportDistribution: {
      yes: 0,
      partial: 0,
      no: 0,
      unknown: 0
    }
  };

  // Count support levels in filtered data
  filteredAgents.forEach(agent => {
    filteredFeatures.forEach(feature => {
      const support = data.matrix[agent.id]?.[feature.id];
      if (support) {
        filteredStats.supportDistribution[support.level]++;
      }
    });
  });

  // Find most and least supported features
  const featureStats = filteredFeatures.map(feature => ({
    feature,
    stats: calculateFeatureStatistics(feature, data.matrix, filteredAgents)
  })).sort((a, b) => {
    const aSupport = a.stats.supportCounts.yes + a.stats.supportCounts.partial * 0.5;
    const bSupport = b.stats.supportCounts.yes + b.stats.supportCounts.partial * 0.5;
    return bSupport - aSupport;
  });

  const mostSupported = featureStats.slice(0, 5);
  const leastSupported = featureStats.slice(-5).reverse();

  // Find agents with best support
  const agentStats = filteredAgents.map(agent => ({
    agent,
    stats: calculateAgentStatistics(agent, data.matrix, filteredFeatures)
  })).sort((a, b) => b.stats.supportPercentage - a.stats.supportPercentage);

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Comparison Statistics & Insights</h2>
      
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">
            {filteredStats.totalComparisons}
          </div>
          <div className="text-sm text-gray-400">Total Comparisons</div>
          {filteredStats.totalComparisons !== data.statistics.totalComparisons && (
            <div className="text-xs text-gray-500 mt-1">
              (of {data.statistics.totalComparisons} total)
            </div>
          )}
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">
            {filteredStats.supportDistribution.yes}
          </div>
          <div className="text-sm text-gray-400">Full Support</div>
          <div className="text-xs text-gray-500 mt-1">
            {filteredStats.totalComparisons > 0 
              ? `${Math.round((filteredStats.supportDistribution.yes / filteredStats.totalComparisons) * 100)}%`
              : '0%'}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">
            {filteredStats.supportDistribution.partial}
          </div>
          <div className="text-sm text-gray-400">Partial Support</div>
          <div className="text-xs text-gray-500 mt-1">
            {filteredStats.totalComparisons > 0 
              ? `${Math.round((filteredStats.supportDistribution.partial / filteredStats.totalComparisons) * 100)}%`
              : '0%'}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-400">
            {filteredStats.supportDistribution.no}
          </div>
          <div className="text-sm text-gray-400">Not Supported</div>
          <div className="text-xs text-gray-500 mt-1">
            {filteredStats.totalComparisons > 0 
              ? `${Math.round((filteredStats.supportDistribution.no / filteredStats.totalComparisons) * 100)}%`
              : '0%'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Supported Features */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Most Supported Features</h3>
          <div className="space-y-2">
            {mostSupported.map(({ feature, stats }) => (
              <div key={feature.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-300 truncate mr-2">{feature.name}</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-400">{stats.supportCounts.yes}</span>
                  <span className="text-gray-500">/</span>
                  <span className="text-gray-400">{filteredAgents.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Least Supported Features */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Least Supported Features</h3>
          <div className="space-y-2">
            {leastSupported.map(({ feature, stats }) => (
              <div key={feature.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-300 truncate mr-2">{feature.name}</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-400">{stats.supportCounts.yes}</span>
                  <span className="text-gray-500">/</span>
                  <span className="text-gray-400">{filteredAgents.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Rankings */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Agent Support Rankings</h3>
          <div className="space-y-2">
            {agentStats.map(({ agent, stats }, index) => (
              <div key={agent.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{index + 1}.</span>
                  <span className="text-sm text-gray-300">{agent.name}</span>
                </div>
                <div className="text-sm font-medium text-blue-400">
                  {stats.supportPercentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Support Distribution Chart */}
      <div className="mt-6 bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Support Distribution</h3>
        <div className="flex items-center gap-2 h-8 rounded overflow-hidden">
          {filteredStats.supportDistribution.yes > 0 && (
            <div 
              className="bg-green-500 h-full flex items-center justify-center text-xs font-medium text-white"
              style={{ width: `${(filteredStats.supportDistribution.yes / filteredStats.totalComparisons) * 100}%` }}
            >
              {Math.round((filteredStats.supportDistribution.yes / filteredStats.totalComparisons) * 100)}%
            </div>
          )}
          {filteredStats.supportDistribution.partial > 0 && (
            <div 
              className="bg-yellow-500 h-full flex items-center justify-center text-xs font-medium text-white"
              style={{ width: `${(filteredStats.supportDistribution.partial / filteredStats.totalComparisons) * 100}%` }}
            >
              {Math.round((filteredStats.supportDistribution.partial / filteredStats.totalComparisons) * 100)}%
            </div>
          )}
          {filteredStats.supportDistribution.no > 0 && (
            <div 
              className="bg-red-500 h-full flex items-center justify-center text-xs font-medium text-white"
              style={{ width: `${(filteredStats.supportDistribution.no / filteredStats.totalComparisons) * 100}%` }}
            >
              {Math.round((filteredStats.supportDistribution.no / filteredStats.totalComparisons) * 100)}%
            </div>
          )}
          {filteredStats.supportDistribution.unknown > 0 && (
            <div 
              className="bg-gray-600 h-full flex items-center justify-center text-xs font-medium text-white"
              style={{ width: `${(filteredStats.supportDistribution.unknown / filteredStats.totalComparisons) * 100}%` }}
            >
              {Math.round((filteredStats.supportDistribution.unknown / filteredStats.totalComparisons) * 100)}%
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-6 mt-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-400">Full Support</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-400">Partial</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-400">Not Supported</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-gray-600 rounded"></div>
            <span className="text-gray-400">Unknown</span>
          </div>
        </div>
      </div>
    </div>
  );
} 