'use client'

import { Agent, Feature } from '@/types'

interface Provider {
  provider: string
  count: number
}

interface AgentsSearchFilterProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedProvider: string
  setSelectedProvider: (provider: string) => void
  selectedIDE: string
  setSelectedIDE: (ide: string) => void
  selectedFeature: string
  setSelectedFeature: (feature: string) => void
  minSupportPercentage: number
  setMinSupportPercentage: (percentage: number) => void
  providers: Provider[]
  supportedIDEs: string[]
  features: Feature[]
  onClearFilters: () => void
}

export default function AgentsSearchFilter({
  searchTerm,
  setSearchTerm,
  selectedProvider,
  setSelectedProvider,
  selectedIDE,
  setSelectedIDE,
  selectedFeature,
  setSelectedFeature,
  minSupportPercentage,
  setMinSupportPercentage,
  providers,
  supportedIDEs,
  features,
  onClearFilters
}: AgentsSearchFilterProps) {
  const hasActiveFilters = searchTerm || selectedProvider || selectedIDE || selectedFeature || minSupportPercentage > 0

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      {/* Search Bar */}
      <div className="space-y-2">
        <label htmlFor="agent-search" className="block text-sm font-medium text-gray-300">
          Search Agents
        </label>
        <input
          id="agent-search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, alias, or description..."
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
          aria-describedby="search-help"
        />
        <p id="search-help" className="text-xs text-gray-400">
          Search across agent names, aliases, and descriptions
        </p>
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Provider Filter */}
        <div className="space-y-2">
          <label htmlFor="provider-filter" className="block text-sm font-medium text-gray-300">
            Provider
          </label>
          <select
            id="provider-filter"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
          >
            <option value="">All Providers</option>
            {providers.map(({ provider, count }) => (
              <option key={provider} value={provider}>
                {provider} ({count})
              </option>
            ))}
          </select>
        </div>

        {/* IDE Filter */}
        <div className="space-y-2">
          <label htmlFor="ide-filter" className="block text-sm font-medium text-gray-300">
            IDE Compatibility
          </label>
          <select
            id="ide-filter"
            value={selectedIDE}
            onChange={(e) => setSelectedIDE(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
          >
            <option value="">All IDEs</option>
            {supportedIDEs.map((ide) => (
              <option key={ide} value={ide}>
                {ide}
              </option>
            ))}
          </select>
        </div>

        {/* Feature Filter */}
        <div className="space-y-2">
          <label htmlFor="feature-filter" className="block text-sm font-medium text-gray-300">
            Feature Support
          </label>
          <select
            id="feature-filter"
            value={selectedFeature}
            onChange={(e) => setSelectedFeature(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
          >
            <option value="">All Features</option>
            {features.map((feature) => (
              <option key={feature.id} value={feature.id}>
                {feature.name}
              </option>
            ))}
          </select>
        </div>

        {/* Support Percentage Filter */}
        <div className="space-y-2">
          <label htmlFor="support-filter" className="block text-sm font-medium text-gray-300">
            Min Support Level
          </label>
          <select
            id="support-filter"
            value={minSupportPercentage}
            onChange={(e) => setMinSupportPercentage(Number(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
          >
            <option value={0}>Any Support Level</option>
            <option value={25}>25%+ Support</option>
            <option value={50}>50%+ Support</option>
            <option value={75}>75%+ Support</option>
            <option value={90}>90%+ Support</option>
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
              Search: &quot;{searchTerm}&quot;
              <button
                onClick={() => setSearchTerm('')}
                className="ml-1 hover:bg-blue-700 rounded-full p-0.5"
                aria-label="Clear search"
              >
                ×
              </button>
            </span>
          )}
          
          {selectedProvider && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
              Provider: {selectedProvider}
              <button
                onClick={() => setSelectedProvider('')}
                className="ml-1 hover:bg-purple-700 rounded-full p-0.5"
                aria-label="Clear provider filter"
              >
                ×
              </button>
            </span>
          )}
          
          {selectedIDE && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-full">
              IDE: {selectedIDE}
              <button
                onClick={() => setSelectedIDE('')}
                className="ml-1 hover:bg-green-700 rounded-full p-0.5"
                aria-label="Clear IDE filter"
              >
                ×
              </button>
            </span>
          )}
          
          {selectedFeature && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-600 text-white text-sm rounded-full">
              Feature: {features.find(f => f.id === selectedFeature)?.name || selectedFeature}
              <button
                onClick={() => setSelectedFeature('')}
                className="ml-1 hover:bg-yellow-700 rounded-full p-0.5"
                aria-label="Clear feature filter"
              >
                ×
              </button>
            </span>
          )}
          
          {minSupportPercentage > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded-full">
              Min Support: {minSupportPercentage}%
              <button
                onClick={() => setMinSupportPercentage(0)}
                className="ml-1 hover:bg-red-700 rounded-full p-0.5"
                aria-label="Clear support filter"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
} 