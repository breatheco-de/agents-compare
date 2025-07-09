'use client'

import React from 'react'
import Link from 'next/link'
import { XMarkIcon, LinkIcon } from '@heroicons/react/24/outline'
import SupportLevelBadge from '@/components/ui/SupportLevelBadge'
import type { Agent, Feature, AgentFeatureSupport } from '@/types'

interface ComparisonCellModalProps {
  agent: Agent
  feature: Feature
  support: AgentFeatureSupport | null
  onClose: () => void
}

export function ComparisonCellModal({ agent, feature, support, onClose }: ComparisonCellModalProps) {
  const supportLevel = support?.support_level || 'unknown'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {agent.name} × {feature.name}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {agent.provider} • {feature.category}
              </p>
            </div>
            <SupportLevelBadge level={supportLevel} showIcon={true} />
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Agent Info */}
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Agent Information</h3>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-300">{agent.name}</span>
                <Link
                  href={`/agent/${agent.id}`}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                >
                  <LinkIcon className="h-4 w-4" />
                  View Details
                </Link>
              </div>
              <p className="text-gray-400 text-sm mb-2">{agent.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Provider: {agent.provider}</span>
                <span>IDE: {agent.supported_ide.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Feature Info */}
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Feature Information</h3>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-300">{feature.name}</span>
                <Link
                  href={`/feature/${feature.id}`}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                >
                  <LinkIcon className="h-4 w-4" />
                  View Details
                </Link>
              </div>
              <p className="text-gray-400 text-sm mb-2">{feature.description}</p>
              <div className="text-xs text-gray-500">
                Category: {feature.category}
              </div>
            </div>
          </div>

          {/* Support Details */}
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Support Details</h3>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-gray-300">Support Level:</span>
                <SupportLevelBadge level={supportLevel} showIcon={true} />
              </div>
              
              {support?.notes && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Notes</h4>
                  <p className="text-gray-400 text-sm">{support.notes}</p>
                </div>
              )}

              {support?.examples && support.examples.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Examples</h4>
                  <div className="space-y-2">
                    {support.examples.map((example, index) => (
                      <div key={index} className="bg-gray-800 rounded p-3">
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap">{example}</pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {support?.links && support.links.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Related Links</h4>
                  <div className="space-y-1">
                    {support.links.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                      >
                        <LinkIcon className="h-3 w-3" />
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {support?.last_verified && (
                <div className="text-xs text-gray-500 border-t border-gray-600 pt-3">
                  Last verified: {new Date(support.last_verified).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <Link
            href={`/agent/${agent.id}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            View Agent
          </Link>
          <Link
            href={`/feature/${feature.id}`}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            View Feature
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
} 