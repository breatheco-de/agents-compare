'use client'

import React, { useState } from 'react'
import type { AgentFeatureSupport, Feature } from '@/types'
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/tables/Table'
import SupportLevelBadge from '@/components/ui/SupportLevelBadge'

interface SupportMatrixProps {
  supportByCategory: Record<string, Array<{ support: AgentFeatureSupport; feature: Feature }>>
  agentName: string
}

export default function SupportMatrix({ supportByCategory, agentName }: SupportMatrixProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (featureId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(featureId)) {
        newSet.delete(featureId)
      } else {
        newSet.add(featureId)
      }
      return newSet
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent, featureId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleRow(featureId)
    }
  }

  // Helper function to truncate text to specified length
  const truncateText = (text: string, maxLength: number): { truncated: string; wasTruncated: boolean } => {
    if (text.length <= maxLength) {
      return { truncated: text, wasTruncated: false }
    }
    return { truncated: text.substring(0, maxLength), wasTruncated: true }
  }

  return (
    <Table ariaLabel={`Feature support matrix for ${agentName}`}>
      <TableHeader>
        <TableRow isHeader>
          <TableCell isHeader scope="col">
            Feature
          </TableCell>
          <TableCell isHeader scope="col" className="min-w-[150px]">
            Support Level
          </TableCell>
          <TableCell isHeader scope="col">
            Details
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
          {Object.entries(supportByCategory).map(([category, items]) => (
            <React.Fragment key={category}>
              {/* Category Header Row */}
              <TableRow isHeader isSticky hover={false}>
                <TableCell 
                  isHeader
                  scope="rowgroup" 
                  colSpan={3} 
                  className="font-semibold text-gray-300 uppercase text-sm tracking-wider"
                >
                  {category}
                </TableCell>
              </TableRow>
              
              {/* Feature Rows */}
              {items.map(({ support, feature }) => {
                const isExpanded = expandedRows.has(feature.id)
                
                return (
                  <React.Fragment key={feature.id}>
                    {/* Main Feature Row */}
                    <TableRow data-feature={feature.id}>
                      <TableCell isHeader scope="row" className="font-medium text-gray-200">
                        {feature.name}
                      </TableCell>
                      <TableCell>
                        <SupportLevelBadge 
                          level={support.support_level as 'yes' | 'partial' | 'no' | 'unknown'} 
                          showIcon
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {/* Notes Preview */}
                          {support.notes && (
                            <div className="text-sm text-gray-300">
                              {(() => {
                                const { truncated, wasTruncated } = truncateText(support.notes, 120)
                                return (
                                  <>
                                    {truncated}
                                    {wasTruncated && <span className="text-gray-500">...</span>}
                                  </>
                                )
                              })()}
                            </div>
                          )}
                          
                          {/* Show Details Button */}
                          <button
                            aria-expanded={isExpanded}
                            aria-controls={`details-${feature.id}`}
                            onClick={() => toggleRow(feature.id)}
                            onKeyDown={(e) => handleKeyDown(e, feature.id)}
                            className="text-blue-400 hover:text-blue-300 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1 text-sm"
                          >
                            {isExpanded ? 'Hide Details' : 'Show Details'}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expandable Details Row */}
                    <TableRow 
                      id={`details-${feature.id}`}
                      className={`${isExpanded ? '' : 'hidden'} bg-gray-800/50`}
                      hidden={!isExpanded}
                      hover={false}
                    >
                      <TableCell colSpan={3}>
                        <div className="space-y-3 max-w-4xl">
                          {support.notes && (
                            <div>
                              <h4 className="font-semibold text-gray-200 mb-1">Notes</h4>
                              <p className="text-gray-300">{support.notes}</p>
                            </div>
                          )}
                          
                          {support.examples.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-200 mb-1">Examples</h4>
                              <ul className="list-disc list-inside text-gray-300 space-y-1">
                                {support.examples.map((example, idx) => (
                                  <li key={idx}>{example}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {support.sources.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-200 mb-1">Sources</h4>
                              <ul className="space-y-1">
                                {support.sources.map((source, idx) => (
                                  <li key={idx}>
                                    <a 
                                      href={source}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:text-blue-300 underline"
                                    >
                                      {source}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="pt-2">
                            <a
                              href={`/feature/${feature.id}`}
                              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium"
                            >
                              Compare this feature across all agents
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                )
              })}
            </React.Fragment>
          ))}
      </TableBody>
    </Table>
  )
} 