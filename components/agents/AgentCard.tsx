'use client'

import Link from 'next/link'
import { Agent } from '@/types'
import SupportLevelBadge from '@/components/ui/SupportLevelBadge'

interface SupportStats {
  totalFeatures: number
  supportedCount: number
  partialCount: number
  notSupportedCount: number
  unknownCount: number
  supportPercentage: number
}

interface AgentCardProps {
  agent: Agent
  supportStats: SupportStats
}

export default function AgentCard({ agent, supportStats }: AgentCardProps) {
  const { 
    id, 
    name, 
    aliases, 
    provider, 
    website, 
    supported_ide, 
    description 
  } = agent

  const {
    totalFeatures,
    supportedCount,
    partialCount,
    notSupportedCount,
    unknownCount,
    supportPercentage
  } = supportStats

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
              <Link href={`/agent/${id}`} className="hover:underline">
                {name}
              </Link>
            </h3>
            
            {aliases && aliases.length > 0 && (
              <p className="text-sm text-gray-400 mt-1">
                Also known as: {aliases.join(', ')}
              </p>
            )}
            
            <p className="text-sm text-gray-500 mt-1">
              by {provider}
            </p>
          </div>
          
          {/* Support Percentage Badge */}
          <div className="flex-shrink-0 ml-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              supportPercentage >= 80 ? 'bg-green-500/20 text-green-400' :
              supportPercentage >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
              supportPercentage >= 40 ? 'bg-orange-500/20 text-orange-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {supportPercentage}%
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {description}
        </p>

        {/* Supported IDEs */}
        {supported_ide && supported_ide.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Supported IDEs
            </h4>
            <div className="flex flex-wrap gap-1">
              {supported_ide.map((ide) => (
                <span
                  key={ide}
                  className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                >
                  {ide}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Feature Support Statistics */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Feature Support
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Full Support:</span>
              <span className="text-green-400 font-medium">{supportedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Partial:</span>
              <span className="text-yellow-400 font-medium">{partialCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Not Supported:</span>
              <span className="text-red-400 font-medium">{notSupportedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Unknown:</span>
              <span className="text-gray-500 font-medium">{unknownCount}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-2">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${supportPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {supportedCount + partialCount} of {totalFeatures} features supported
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/agent/${id}`}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors text-center"
          >
            View Details
          </Link>
          
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-sm font-medium rounded-lg transition-colors"
            title={`Visit ${name} website`}
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
              />
            </svg>
            <span className="sr-only">Visit website</span>
          </a>
          
          <button
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
            title={`Compare ${name} with other agents`}
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
              />
            </svg>
            <span className="sr-only">Compare</span>
          </button>
        </div>
      </div>
    </div>
  )
} 