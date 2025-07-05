'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Agent, Feature, SupportLevel } from '@/types';
import { ComparisonMatrix } from '@/types/comparison';
import SupportLevelBadge from '@/components/ui/SupportLevelBadge';
import { ComparisonCellModal } from './ComparisonCellModal';
import React from 'react';

interface ComparisonTableProps {
  agents: Agent[];
  features: Feature[];
  matrix: ComparisonMatrix['matrix'];
  viewMode: 'compact' | 'expanded';
  showNotes: boolean;
  selectedSupportLevels: SupportLevel[];
}

export function ComparisonTable({
  agents,
  features,
  matrix,
  viewMode,
  showNotes,
  selectedSupportLevels
}: ComparisonTableProps) {
  const [selectedCell, setSelectedCell] = useState<{
    agent: Agent;
    feature: Feature;
    support: ComparisonMatrix['matrix'][string][string];
  } | null>(null);

  // Group features by category
  const featuresByCategory = features.reduce((acc, feature) => {
    const category = feature.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  // Filter cells by support level if needed
  const shouldShowCell = (support: ComparisonMatrix['matrix'][string][string]) => {
    if (selectedSupportLevels.length === 0) return true;
    return selectedSupportLevels.includes(support.level);
  };

  return (
    <>
      <div className="relative overflow-x-auto bg-gray-900 rounded-lg shadow-xl mb-8">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-20 bg-gray-900">
            <tr>
              <th className="sticky left-0 z-30 bg-gray-900 border-r border-b border-gray-800 p-4 text-left">
                <div className="text-gray-400 font-medium">Features</div>
              </th>
              {agents.map((agent) => (
                <th
                  key={agent.id}
                  className="bg-gray-900 border-b border-gray-800 p-4 text-center min-w-[150px]"
                >
                  <Link
                    href={`/agent/${agent.id}`}
                    className="group flex flex-col items-center hover:text-blue-400 transition-colors"
                  >
                    <div className="font-semibold text-white group-hover:text-blue-400">
                      {agent.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{agent.provider}</div>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(featuresByCategory).map(([category, categoryFeatures]) => (
              <React.Fragment key={category}>
                <tr>
                  <td
                    colSpan={agents.length + 1}
                    className="bg-gray-800 p-3 text-sm font-semibold text-gray-300 sticky left-0"
                  >
                    {category} ({categoryFeatures.length})
                  </td>
                </tr>
                {categoryFeatures.map((feature) => (
                  <tr key={feature.id} className="hover:bg-gray-850 transition-colors">
                    <td className="sticky left-0 z-10 bg-gray-900 border-r border-gray-800 p-4">
                      <Link
                        href={`/feature/${feature.id}`}
                        className="group hover:text-blue-400 transition-colors"
                      >
                        <div className="font-medium text-white group-hover:text-blue-400">
                          {feature.name}
                        </div>
                        {viewMode === 'expanded' && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {feature.description}
                          </div>
                        )}
                      </Link>
                    </td>
                    {agents.map((agent) => {
                      const support = matrix[agent.id]?.[feature.id];
                      if (!support || !shouldShowCell(support)) {
                        return <td key={agent.id} className="p-4 text-center"></td>;
                      }

                      return (
                        <td
                          key={agent.id}
                          className="p-4 text-center border-l border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors"
                          onClick={() => setSelectedCell({ agent, feature, support })}
                        >
                          <div className="flex flex-col items-center">
                            <SupportLevelBadge level={support.level} />
                            {showNotes && support.notes && viewMode === 'expanded' && (
                              <div className="text-xs text-gray-500 mt-2 line-clamp-2">
                                {support.notes}
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCell && (
        <ComparisonCellModal
          agent={selectedCell.agent}
          feature={selectedCell.feature}
          support={selectedCell.support}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </>
  );
} 