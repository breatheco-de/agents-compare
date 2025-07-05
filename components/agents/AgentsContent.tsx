'use client'

import { useState, useMemo } from 'react'
import { Agent, Feature } from '@/types'
import AgentsSearchFilter from './AgentsSearchFilter'
import AgentCard from './AgentCard'
import AgentsTable from './AgentsTable'

interface AgentWithStats {
  agent: Agent
  supportStats: {
    totalFeatures: number
    supportedCount: number
    partialCount: number
    notSupportedCount: number
    unknownCount: number
    supportPercentage: number
  }
}

interface Provider {
  provider: string
  count: number
}

interface AgentsContentProps {
  agentsWithStats: AgentWithStats[]
  providers: Provider[]
  supportedIDEs: string[]
  features: Feature[]
}

export default function AgentsContent({
  agentsWithStats,
  providers,
  supportedIDEs,
  features
}: AgentsContentProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedIDE, setSelectedIDE] = useState('')
  const [selectedFeature, setSelectedFeature] = useState('')
  const [minSupportPercentage, setMinSupportPercentage] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'provider' | 'support' | 'features'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Filter and sort agents
  const filteredAndSortedAgents = useMemo(() => {
    let filtered = agentsWithStats.filter(({ agent, supportStats }) => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const matchesName = agent.name.toLowerCase().includes(searchLower)
        const matchesAlias = agent.aliases.some(alias => alias.toLowerCase().includes(searchLower))
        const matchesDescription = agent.description.toLowerCase().includes(searchLower)
        
        if (!matchesName && !matchesAlias && !matchesDescription) {
          return false
        }
      }
      
      // Provider filter
      if (selectedProvider && agent.provider !== selectedProvider) {
        return false
      }
      
      // IDE filter
      if (selectedIDE && !agent.supported_ide.includes(selectedIDE)) {
        return false
      }
      
      // Feature filter (would need support data to implement fully)
      if (selectedFeature) {
        // This would require loading support data for filtering
        // For now, we'll skip this filter
      }
      
      // Support percentage filter
      if (supportStats.supportPercentage < minSupportPercentage) {
        return false
      }
      
      return true
    })
    
    // Sort agents
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.agent.name.localeCompare(b.agent.name)
          break
        case 'provider':
          comparison = a.agent.provider.localeCompare(b.agent.provider)
          break
        case 'support':
          comparison = a.supportStats.supportPercentage - b.supportStats.supportPercentage
          break
        case 'features':
          comparison = a.supportStats.supportedCount - b.supportStats.supportedCount
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    return filtered
  }, [agentsWithStats, searchTerm, selectedProvider, selectedIDE, selectedFeature, minSupportPercentage, sortBy, sortOrder])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedProvider('')
    setSelectedIDE('')
    setSelectedFeature('')
    setMinSupportPercentage(0)
  }

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <section aria-labelledby="search-filter-heading">
        <h2 id="search-filter-heading" className="text-2xl font-semibold mb-6">
          Filter & Search Agents
        </h2>
        
        <AgentsSearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
          selectedIDE={selectedIDE}
          setSelectedIDE={setSelectedIDE}
          selectedFeature={selectedFeature}
          setSelectedFeature={setSelectedFeature}
          minSupportPercentage={minSupportPercentage}
          setMinSupportPercentage={setMinSupportPercentage}
          providers={providers}
          supportedIDEs={supportedIDEs}
          features={features}
          onClearFilters={clearFilters}
        />
      </section>

      {/* View Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <span className="text-gray-400">
            Showing {filteredAndSortedAgents.length} of {agentsWithStats.length} agents
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm text-gray-400">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-')
                setSortBy(sort as typeof sortBy)
                setSortOrder(order as typeof sortOrder)
              }}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="provider-asc">Provider (A-Z)</option>
              <option value="provider-desc">Provider (Z-A)</option>
              <option value="support-desc">Support % (High-Low)</option>
              <option value="support-asc">Support % (Low-High)</option>
              <option value="features-desc">Features (Most-Least)</option>
              <option value="features-asc">Features (Least-Most)</option>
            </select>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              aria-label="Grid view"
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              aria-label="Table view"
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <section aria-labelledby="results-heading">
        <h2 id="results-heading" className="sr-only">
          Search Results
        </h2>
        
        {filteredAndSortedAgents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              No agents match your current filters.
            </div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedAgents.map(({ agent, supportStats }) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                supportStats={supportStats}
              />
            ))}
          </div>
        ) : (
          <AgentsTable
            agentsWithStats={filteredAndSortedAgents}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={(newSortBy: 'name' | 'provider' | 'support' | 'features') => {
              if (newSortBy === sortBy) {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              } else {
                setSortBy(newSortBy)
                setSortOrder('asc')
              }
            }}
          />
        )}
      </section>
    </div>
  )
} 