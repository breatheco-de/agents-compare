'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { SupportLevelIcon } from '@/components/ui/SupportLevelBadge'
import { SupportStatusIcon } from '@/components/ui/SupportStatusIcon'
import { HoverTooltip } from '@/components/ui/HoverTooltip'
import { ScrollArea } from '@/components/tables/ScrollArea'
import { DOCUMENTED_SUPPORT_EXPLANATION, getAgentScore } from '@/lib/comparison-utils'
import {
  CATEGORY_SHORT_NAMES,
  FEATURE_SHORT_NAMES,
  SUPPORT_LEVEL_ORDER,
  SUPPORT_LEVEL_TEXT,
  orderFeaturesByCategory
} from '@/lib/support-levels'
import { ComparisonCellModal } from './ComparisonCellModal'
import { SupportLegendFilter } from './SupportLegend'
import type { Agent, Feature, AgentFeatureSupport, SupportLevel } from '@/types'

type SortOrder = 'none' | 'descending' | 'ascending'
type Score = ReturnType<typeof getAgentScore>

interface AgentFeatureMatrixProps {
  agents: Agent[]
  features: Feature[]
  supportMatrix: AgentFeatureSupport[]
  // Optional controlled status filter (e.g. shared with the /compare filter panel)
  shownLevels?: SupportLevel[]
  onShownLevelsChange?: (levels: SupportLevel[]) => void
}

interface SelectedCell {
  agent: Agent
  feature: Feature
  support: AgentFeatureSupport | null
}

const NEXT_SORT: Record<SortOrder, SortOrder> = { none: 'descending', descending: 'ascending', ascending: 'none' }

// Agents × features support matrix: a table from the md breakpoint, per-agent cards below it.
// Both views share the status filter (legend), score sorting, and the detail modal.
export function AgentFeatureMatrix({ agents, features, supportMatrix, shownLevels, onShownLevelsChange }: AgentFeatureMatrixProps) {
  const [ownShown, setOwnShown] = useState<SupportLevel[]>([...SUPPORT_LEVEL_ORDER])
  const shown = shownLevels ?? ownShown
  const setShown = onShownLevelsChange ?? setOwnShown
  const [sort, setSort] = useState<SortOrder>('none')
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null)

  const orderedFeatures = useMemo(() => orderFeaturesByCategory(features), [features])
  const supportIndex = useMemo(() => {
    const index = new Map<string, AgentFeatureSupport>()
    for (const s of supportMatrix) index.set(`${s.agent_id}:${s.feature_id}`, s)
    return index
  }, [supportMatrix])
  const getSupport = (agentId: string, featureId: string) => supportIndex.get(`${agentId}:${featureId}`) || null
  const levelOf = (agentId: string, featureId: string): SupportLevel => getSupport(agentId, featureId)?.support_level || 'unknown'

  const scores = useMemo(() => {
    const map = new Map<string, Score>()
    for (const a of agents) map.set(a.id, getAgentScore(a.id, orderedFeatures, supportMatrix))
    return map
  }, [agents, orderedFeatures, supportMatrix])

  const sortedAgents = useMemo(() => {
    if (sort === 'none') return agents
    const dir = sort === 'descending' ? -1 : 1
    return [...agents].sort((x, y) => {
      const sx = scores.get(x.id)!, sy = scores.get(y.id)!
      return (sx.percentage - sy.percentage) * dir || sy.known - sx.known || x.name.localeCompare(y.name)
    })
  }, [agents, scores, sort])

  const counts = useMemo(() => {
    const c = { yes: 0, partial: 0, no: 0, unknown: 0 } as Record<SupportLevel, number>
    for (const a of agents) for (const f of orderedFeatures) c[levelOf(a.id, f.id)]++
    return c
    // levelOf only reads supportIndex
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agents, orderedFeatures, supportIndex])

  // An empty selection (possible from the /compare filter panel) shows every status
  const isShown = (level: SupportLevel) => shown.length === 0 || shown.includes(level)
  const toggleLevel = (level: SupportLevel) =>
    setShown(shown.includes(level) ? shown.filter(l => l !== level) : [...shown, level])

  const openCell = (agent: Agent, feature: Feature) => setSelectedCell({ agent, feature, support: getSupport(agent.id, feature.id) })

  const shared = { agents: sortedAgents, features: orderedFeatures, scores, levelOf, getSupport, isShown, onOpen: openCell, sort, onSortChange: setSort }

  return (
    <div className="space-y-4">
      <SupportLegendFilter
        shown={shown}
        counts={counts}
        onToggle={toggleLevel}
        onShowAll={() => setShown([...SUPPORT_LEVEL_ORDER])}
      />
      <MatrixTable {...shared} />
      <MatrixCards {...shared} />
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

interface ViewProps {
  agents: Agent[]
  features: Feature[]
  scores: Map<string, Score>
  levelOf: (agentId: string, featureId: string) => SupportLevel
  getSupport: (agentId: string, featureId: string) => AgentFeatureSupport | null
  isShown: (level: SupportLevel) => boolean
  onOpen: (agent: Agent, feature: Feature) => void
  sort: SortOrder
  onSortChange: (sort: SortOrder) => void
}

// Below this share of documented features the score is flagged as based on limited data
const LIMITED_DATA_RATIO = 2 / 3

function Coverage({ score }: { score: Score }) {
  const limited = score.total > 0 && score.known / score.total < LIMITED_DATA_RATIO
  return (
    <span className={`text-xs ${limited ? 'text-amber-300' : 'text-gray-500'}`}>
      {score.known}/{score.total} documented{limited && ' · Limited data'}
    </span>
  )
}

function ScoreBar({ percentage }: { percentage: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-gray-800" aria-hidden="true">
      <div className="h-full rounded-full bg-blue-400" style={{ width: `${percentage}%` }} />
    </div>
  )
}

// Desktop: agents in rows, features in columns grouped by category
function MatrixTable({ agents, features, scores, levelOf, getSupport, isShown, onOpen, sort, onSortChange }: ViewProps) {
  const [hover, setHover] = useState<{ row: string | null; col: string | null }>({ row: null, col: null })

  const groups = useMemo(() => {
    const list: { category: string; count: number }[] = []
    for (const f of features) {
      const last = list[list.length - 1]
      if (last && last.category === f.category) last.count++
      else list.push({ category: f.category, count: 1 })
    }
    return list
  }, [features])
  const groupStarts = useMemo(() => {
    const starts = new Set<string>()
    features.forEach((f, i) => { if (i === 0 || features[i - 1].category !== f.category) starts.add(f.id) })
    return starts
  }, [features])

  const sortArrow = { none: '↕', descending: '↓', ascending: '↑' }[sort]
  const cellBg = (agentId: string, featureId?: string) => {
    if (featureId && hover.row === agentId && hover.col === featureId) return 'bg-gray-700/70'
    if (hover.row === agentId || (featureId && hover.col === featureId)) return 'bg-gray-800/80'
    return ''
  }

  return (
    <div className="hidden md:block">
      <ScrollArea label="Agent feature support matrix" className="rounded-lg border border-gray-700 bg-gray-900">
        <table
          className="w-full min-w-[66rem] table-fixed border-separate border-spacing-0 text-sm tabular-nums"
          aria-label="Feature support by agent"
          onMouseLeave={() => setHover({ row: null, col: null })}
        >
          <colgroup>
            <col className="w-[13.5rem]" />
            {/* Columns that are alone in their category get room for the category label */}
            {features.map(f => <col key={f.id} className={groups.find(g => g.category === f.category)?.count === 1 ? 'w-20' : ''} />)}
            <col className="w-[11rem]" />
          </colgroup>
          <thead>
            <tr>
              <th rowSpan={2} scope="col" className="sticky left-0 z-20 border-b border-r border-gray-700 bg-gray-800 px-4 pb-3 text-left align-bottom text-xs font-medium uppercase tracking-wider text-gray-400">
                Agent
              </th>
              {groups.map((g, i) => (
                <th
                  key={g.category}
                  colSpan={g.count}
                  scope="colgroup"
                  title={g.category}
                  className="relative h-8 overflow-hidden text-ellipsis whitespace-nowrap border-b border-l border-gray-700 bg-gray-800 px-2 text-left text-[10px] font-medium uppercase tracking-wide text-gray-500"
                >
                  <span aria-hidden="true" className={`absolute inset-x-1.5 top-0 h-[3px] rounded-b ${i % 2 ? 'bg-blue-400/60' : 'bg-gray-500/60'}`} />
                  {CATEGORY_SHORT_NAMES[g.category] || g.category}
                </th>
              ))}
              <th
                rowSpan={2}
                scope="col"
                aria-sort={sort}
                className="border-b border-l border-gray-700 bg-gray-800 px-3 pb-3 text-left align-bottom"
              >
                <button
                  type="button"
                  onClick={() => onSortChange(NEXT_SORT[sort])}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${sort === 'none' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-100'}`}
                >
                  <span className="text-left leading-tight">Documented<br />support</span>
                  <span aria-hidden="true" className="font-mono text-gray-500">{sortArrow}</span>
                </button>
                <HoverTooltip
                  width={260}
                  className="ml-1.5 inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-gray-500 align-middle text-[10px] font-semibold text-gray-400"
                  content={<p className="text-xs text-gray-300">{DOCUMENTED_SUPPORT_EXPLANATION}</p>}
                >
                  <span aria-label="How documented support is calculated">?</span>
                </HoverTooltip>
              </th>
            </tr>
            <tr>
              {features.map(f => (
                <th
                  key={f.id}
                  scope="col"
                  onMouseEnter={() => setHover({ row: null, col: f.id })}
                  className={`h-12 border-b border-gray-700 px-1 py-1.5 text-center align-middle text-xs font-semibold leading-tight ${groupStarts.has(f.id) ? 'border-l' : ''} ${hover.col === f.id ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                  <HoverTooltip
                    as="a"
                    href={`/feature/${f.id}`}
                    width={240}
                    className="inline-block border-b border-dotted border-gray-500 hover:text-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    content={
                      <>
                        <p className="font-semibold text-gray-100">{f.name}</p>
                        <p className="text-xs text-gray-400">{f.category}</p>
                      </>
                    }
                  >
                    {FEATURE_SHORT_NAMES[f.id] || f.name}
                  </HoverTooltip>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => {
              const score = scores.get(agent.id)!
              return (
                <tr key={agent.id} onMouseEnter={() => setHover({ row: agent.id, col: null })}>
                  <th scope="row" className={`sticky left-0 z-10 border-b border-r border-gray-800 px-4 py-2.5 text-left font-normal ${cellBg(agent.id) || 'bg-gray-900'}`}>
                    <Link href={`/agent/${agent.id}`} className="block truncate font-semibold text-gray-100 hover:text-blue-300">
                      {agent.name}
                    </Link>
                    <div className="truncate text-xs text-gray-500" title={agent.provider}>{agent.provider}</div>
                  </th>
                  {features.map(f => {
                    const level = levelOf(agent.id, f.id)
                    return (
                      <td
                        key={f.id}
                        onMouseEnter={() => setHover({ row: agent.id, col: f.id })}
                        className={`h-[52px] border-b border-gray-800 p-0 text-center ${groupStarts.has(f.id) ? 'border-l border-l-gray-700' : ''} ${cellBg(agent.id, f.id)}`}
                      >
                        {isShown(level) ? (
                          <SupportLevelIcon
                            level={level}
                            context={`${agent.name} · ${f.name}`}
                            notes={getSupport(agent.id, f.id)?.notes}
                            onClick={() => onOpen(agent, f)}
                            buttonLabel={`${agent.name}, ${f.name}: ${SUPPORT_LEVEL_TEXT[level].full}. Show details`}
                            buttonClassName="flex h-full w-full items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
                          />
                        ) : (
                          <span aria-hidden="true" className="mx-auto block h-1.5 w-1.5 rounded-full bg-gray-700" />
                        )}
                      </td>
                    )
                  })}
                  <td className={`border-b border-l border-gray-800 border-l-gray-700 px-3 py-2 ${cellBg(agent.id)}`}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-gray-100">{score.percentage}%</span>
                      <Coverage score={score} />
                    </div>
                    <div className="mt-1.5"><ScoreBar percentage={score.percentage} /></div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  )
}

// Mobile: one card per agent with the score up top and collapsible categories (collapsed by default)
function MatrixCards({ agents, features, scores, levelOf, isShown, onOpen, sort, onSortChange }: ViewProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const categories = Array.from(new Set(features.map(f => f.category)))
  const sortLabel = { none: 'A–Z', descending: 'High to low', ascending: 'Low to high' }[sort]

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
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm text-gray-400">{agents.length} {agents.length === 1 ? 'agent' : 'agents'}</span>
        <button
          type="button"
          onClick={() => onSortChange(NEXT_SORT[sort])}
          className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Sort by support: <span className="font-semibold">{sortLabel}</span>
        </button>
      </div>

      <div className="space-y-3">
        {agents.map(agent => {
          const score = scores.get(agent.id)!
          return (
            <article key={agent.id} className="rounded-lg border border-gray-700 bg-gray-800/60">
              <header className="space-y-2 border-b border-gray-700 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/agent/${agent.id}`} className="font-semibold text-gray-100 hover:text-blue-300">
                      {agent.name}
                    </Link>
                    <p className="truncate text-xs text-gray-500">{agent.provider}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-lg font-semibold tabular-nums text-gray-100">{score.percentage}%</div>
                    <div className="text-xs text-gray-500">documented support</div>
                    <Coverage score={score} />
                  </div>
                </div>
                <ScoreBar percentage={score.percentage} />
              </header>

              <div className="divide-y divide-gray-700/70">
                {categories.map(category => {
                  const rows = features
                    .filter(f => f.category === category)
                    .map(feature => ({ feature, level: levelOf(agent.id, feature.id) }))
                    .filter(({ level }) => isShown(level))
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
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
                        >
                          {isOpen
                            ? <ChevronDownIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                            : <ChevronRightIcon className="h-4 w-4 shrink-0" aria-hidden="true" />}
                          <span>{CATEGORY_SHORT_NAMES[category] || category}</span>
                          <span className="sr-only">, {rows.length} {rows.length === 1 ? 'feature' : 'features'}</span>
                          {/* Summary visible while collapsed: one icon per feature */}
                          <span aria-hidden="true" className="ml-auto flex items-center gap-1">
                            {rows.map(({ feature, level }) => (
                              <SupportStatusIcon key={feature.id} level={level} size={14} label={null} />
                            ))}
                          </span>
                        </button>
                      </h3>

                      {isOpen && (
                        <ul id={panelId} className="pb-2">
                          {rows.map(({ feature, level }) => (
                            <li key={feature.id}>
                              <button
                                type="button"
                                onClick={() => onOpen(agent, feature)}
                                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
                              >
                                <SupportStatusIcon level={level} size={18} />
                                <span>{feature.name}</span>
                                <ChevronRightIcon className="ml-auto h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />
                              </button>
                            </li>
                          ))}
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
    </div>
  )
}
