'use client'

import Link from 'next/link'
import { Agent } from '@/types'

interface SupportStats {
  totalFeatures: number
  supportedCount: number
  partialCount: number
  notSupportedCount: number
  unknownCount: number
  supportPercentage: number
}

interface AgentWithStats {
  agent: Agent
  supportStats: SupportStats
}

interface AgentsTableProps {
  agentsWithStats: AgentWithStats[]
  sortBy: 'name' | 'provider' | 'support' | 'features'
  sortOrder: 'asc' | 'desc'
  onSort: (sortBy: 'name' | 'provider' | 'support' | 'features') => void
}

export default function AgentsTable({
  agentsWithStats,
  sortBy,
  sortOrder,
  onSort
}: AgentsTableProps) {
  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }
    
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center gap-2">
                  Agent Name
                  {getSortIcon('name')}
                </div>
              </th>
              
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => onSort('provider')}
              >
                <div className="flex items-center gap-2">
                  Provider
                  {getSortIcon('provider')}
                </div>
              </th>
              
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Supported IDEs
              </th>
              
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => onSort('features')}
              >
                <div className="flex items-center gap-2">
                  Features Supported
                  {getSortIcon('features')}
                </div>
              </th>
              
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => onSort('support')}
              >
                <div className="flex items-center gap-2">
                  Support %
                  {getSortIcon('support')}
                </div>
              </th>
              
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-700">
            {agentsWithStats.map(({ agent, supportStats }) => (
              <tr key={agent.id} className="hover:bg-gray-750 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">
                      <Link href={`/agent/${agent.id}`} className="hover:text-blue-400 transition-colors">
                        {agent.name}
                      </Link>
                    </div>
                    {agent.aliases && agent.aliases.length > 0 && (
                      <div className="text-xs text-gray-400 mt-1">
                        {agent.aliases.join(', ')}
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{agent.provider}</div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {agent.supported_ide.slice(0, 3).map((ide) => (
                      <span
                        key={ide}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-700 text-gray-300"
                      >
                        {ide}
                      </span>
                    ))}
                    {agent.supported_ide.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-600 text-gray-400">
                        +{agent.supported_ide.length - 3} more
                      </span>
                    )}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    <div className="flex items-center gap-4">
                      <span className="text-green-400">{supportStats.supportedCount}</span>
                      <span className="text-yellow-400">{supportStats.partialCount}</span>
                      <span className="text-red-400">{supportStats.notSupportedCount}</span>
                      <span className="text-gray-500">{supportStats.unknownCount}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {supportStats.supportedCount + supportStats.partialCount} of {supportStats.totalFeatures}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-1 mr-4">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            supportStats.supportPercentage >= 80 ? 'bg-green-500' :
                            supportStats.supportPercentage >= 60 ? 'bg-yellow-500' :
                            supportStats.supportPercentage >= 40 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${supportStats.supportPercentage}%` }}
                        />
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      supportStats.supportPercentage >= 80 ? 'text-green-400' :
                      supportStats.supportPercentage >= 60 ? 'text-yellow-400' :
                      supportStats.supportPercentage >= 40 ? 'text-orange-400' :
                      'text-red-400'
                    }`}>
                      {supportStats.supportPercentage}%
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <Link
                      href={`/agent/${agent.id}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View
                    </Link>
                    
                    <a
                      href={agent.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      Website
                    </a>
                    
                    <button className="text-purple-400 hover:text-purple-300 transition-colors">
                      Compare
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Legend */}
      <div className="bg-gray-900 px-6 py-3 border-t border-gray-700">
        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span>Full Support</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            <span>Partial Support</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span>No Support</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span>Unknown</span>
          </div>
        </div>
      </div>
    </div>
  )
} 