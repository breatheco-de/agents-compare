'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { SupportLevelIcon, SUPPORT_LEVELS } from '@/components/ui/SupportLevelBadge'
import { getAgentSupportStats } from '@/lib/comparison-utils'
import { ComparisonCellModal } from './ComparisonCellModal'
import { SupportLegend } from './SupportLegend'
import type { Agent, Feature, AgentFeatureSupport, SupportLevel } from '@/types'

interface ComparisonCardsProps {
  agents: Agent[]
  features: Feature[]
  supportMatrix: AgentFeatureSupport[]
  selectedSupportLevels: SupportLevel[]
}

// Mobile layout for the comparison: one card per agent with collapsible feature categories.
// Shown below the md breakpoint; wider screens use ComparisonTable.
export function ComparisonCards({ agents, features, supportMatrix, selectedSupportLevels }: ComparisonCardsProps) {
  // Categories start collapsed; keys are `${agentId}:${category}`
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [selectedCell, setSelectedCell] = useState<{
    agent: Agent
    feature: Feature
    support: AgentFeatureSupport | null
  } | null>(null)

  const getSupport = (agentId: string, featureId: string) =>
    supportMatrix.find(s => s.agent_id === agentId && s.feature_id === featureId) || null

  // An empty selection shows every level
  const isLevelShown = (level: SupportLevel) =>
    selectedSupportLevels.length === 0 || selectedSupportLevels.includes(level)

  const categories = Array.from(new Set(features.map(f => f.category)))

  const toggle = (key: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <div className="md:hidden">
      <SupportLegend compact className="mb-4" />

      <div className="space-y-4">
        {agents.map(agent => {
          const stats = getAgentSupportStats(agent.id, features, supportMatrix)

          return (
            <article key={agent.id} className="rounded-lg border border-gray-700 bg-gray-800">
              <header className="flex items-start justify-between gap-3 border-b border-gray-700 px-4 py-3">
                <div className="min-w-0">
                  <Link href={`/agent/${agent.id}`} className="font-semibold text-gray-100 hover:text-blue-400">
                    {agent.name}
                  </Link>
                  <p className="text-xs text-gray-400">{agent.provider}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-lg font-semibold text-green-400">{stats.percentage}%</div>
                  <div className="text-xs text-gray-400">support</div>
                </div>
              </header>

              <div className="divide-y divide-gray-700">
                {categories.map(category => {
                  const rows = features
                    .filter(f => f.category === category)
                    .map(feature => ({ feature, support: getSupport(agent.id, feature.id) }))
                    .filter(({ support }) => isLevelShown(support?.support_level || 'unknown'))

                  if (rows.length === 0) return null

                  const key = `${agent.id}:${category}`
                  const isOpen = expanded.has(key)
                  const panelId = `card-${agent.id}-${category.replace(/\s+/g, '-').toLowerCase()}`

                  return (
                    <section key={category}>
                      <h3>
                        <button
                          type="button"
                          onClick={() => toggle(key)}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-gray-200 hover:bg-gray-750"
                        >
                          {isOpen ? (
                            <ChevronDownIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                          )}
                          <span>{category}</span>
                          <span className="sr-only">, {rows.length} {rows.length === 1 ? 'feature' : 'features'}</span>
                          {/* Summary visible while collapsed: one emoji per feature */}
                          <span aria-hidden="true" className="ml-auto flex items-center gap-1 text-sm">
                            {rows.map(({ feature, support }) => (
                              <span key={feature.id}>
                                {SUPPORT_LEVELS[(support?.support_level || 'unknown') as SupportLevel].icon}
                              </span>
                            ))}
                          </span>
                        </button>
                      </h3>

                      {isOpen && (
                        <ul id={panelId} className="pb-2">
                          {rows.map(({ feature, support }) => {
                            const level = (support?.support_level || 'unknown') as SupportLevel
                            return (
                              <li key={feature.id}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedCell({ agent, feature, support })}
                                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-750"
                                >
                                  <SupportLevelIcon level={level} showTooltip={false} />
                                  <span>{feature.name}</span>
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </section>
                  )
                })}
              </div>
            </article>
          )
        })}
      </div>

      {selectedCell && (
        <ComparisonCellModal
          agent={selectedCell.agent}
          feature={selectedCell.feature}
          support={selectedCell.support}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </div>
  )
}
