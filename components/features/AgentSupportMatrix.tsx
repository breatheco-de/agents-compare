'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Agent } from '@/types'
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/tables/Table'
import SupportLevelBadge, { SUPPORT_LEVELS } from '@/components/ui/SupportLevelBadge'

interface AgentSupport {
  agent: Agent
  level: string
  notes?: string
  examples?: string[]
  links?: string[]
}

interface AgentSupportMatrixProps {
  supports: AgentSupport[]
}

export default function AgentSupportMatrix({ supports }: AgentSupportMatrixProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (agentId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(agentId)) {
      newExpanded.delete(agentId)
    } else {
      newExpanded.add(agentId)
    }
    setExpandedRows(newExpanded)
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">Agent Support</h2>
      <div className="overflow-x-auto">
        <Table ariaLabel="Agent support matrix">
          <TableHeader>
            <TableRow isHeader>
              <TableCell isHeader scope="col">Agent</TableCell>
              <TableCell isHeader scope="col">Support Level</TableCell>
              <TableCell isHeader scope="col">Notes</TableCell>
              <TableCell isHeader scope="col" className="w-16 text-center">
                <span className="sr-only">Actions</span>
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supports.map((support) => {
              const hasDetails = support.examples && support.examples.length > 0
              const isExpanded = expandedRows.has(support.agent.id)

              return (
                <>
                  <TableRow key={support.agent.id}>
                    <TableCell>
                      <Link 
                        href={`/agent/${support.agent.id}`} 
                        className="text-blue-400 hover:underline font-medium"
                      >
                        {support.agent.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <SupportLevelBadge 
                        level={support.level as 'yes' | 'partial' | 'no' | 'unknown'} 
                        showIcon 
                      />
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {support.notes || '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      {hasDetails && (
                        <button
                          onClick={() => toggleRow(support.agent.id)}
                          className="text-gray-400 hover:text-white transition-colors"
                          aria-expanded={isExpanded}
                          aria-controls={`details-${support.agent.id}`}
                        >
                          <svg
                            className={`w-5 h-5 transform transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                  {hasDetails && isExpanded && (
                    <TableRow 
                      id={`details-${support.agent.id}`}
                      hidden={!isExpanded}
                      hover={false}
                      className="bg-gray-800/30"
                    >
                      <TableCell colSpan={4} className="p-0">
                        <div className="p-6">
                          <h4 className="font-medium mb-3 text-gray-200">Examples:</h4>
                          <ul className="space-y-2">
                            {support.examples?.map((example, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-gray-500 mt-0.5">•</span>
                                <span className="text-gray-300">{example}</span>
                              </li>
                            ))}
                          </ul>
                          {support.links && support.links.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-medium mb-2 text-gray-200">Learn More:</h4>
                              <div className="flex flex-wrap gap-2">
                                {support.links.map((link, idx) => (
                                  <a
                                    key={idx}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline text-sm"
                                  >
                                    {new URL(link).hostname} →
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )
            })}
          </TableBody>
        </Table>
      </div>
      
    </section>
  )
} 