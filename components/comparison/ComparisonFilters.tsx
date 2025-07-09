'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { Agent, Feature, SupportLevel } from '@/types'

interface ComparisonFiltersProps {
  agents: Agent[]
  features: Feature[]
  selectedAgents: string[]
  setSelectedAgents: (agents: string[]) => void
  selectedFeatures: string[]
  setSelectedFeatures: (features: string[]) => void
  selectedCategories: string[]
  setSelectedCategories: (categories: string[]) => void
  selectedSupportLevels: SupportLevel[]
  setSelectedSupportLevels: (levels: SupportLevel[]) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  viewMode: 'compact' | 'expanded'
  setViewMode: (mode: 'compact' | 'expanded') => void
  showNotes: boolean
  setShowNotes: (show: boolean) => void
  onFiltersChange?: (filters: FilterState) => void
}

export interface FilterState {
  searchTerm: string
  selectedAgents: string[]
  selectedFeatures: string[]
  selectedCategories: string[]
  supportLevels: string[]
  showUnknown: boolean
}

export function ComparisonFilters({ 
  agents, 
  features, 
  selectedAgents,
  setSelectedAgents,
  selectedFeatures,
  setSelectedFeatures,
  selectedCategories,
  setSelectedCategories,
  selectedSupportLevels,
  setSelectedSupportLevels,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  showNotes,
  setShowNotes,
  onFiltersChange 
}: ComparisonFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedAgents: [],
    selectedFeatures: [],
    selectedCategories: [],
    supportLevels: ['yes', 'partial', 'no', 'unknown'],
    showUnknown: true
  })

  const [isExpanded, setIsExpanded] = useState(false)

  // Get unique categories from features
  const categories = Array.from(new Set(features.map(f => f.category)))

  // Get unique providers from agents
  const providers = Array.from(new Set(agents.map(a => a.provider)))

  useEffect(() => {
    onFiltersChange?.(filters)
  }, [filters, onFiltersChange])

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }))
  }

  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      selectedAgents: [],
      selectedFeatures: [],
      selectedCategories: [],
      supportLevels: ['yes', 'partial', 'no', 'unknown'],
      showUnknown: true
    })
  }

  const toggleArrayFilter = (array: string[], value: string) => {
    return array.includes(value) 
      ? array.filter(item => item !== value)
      : [...array, value]
  }

  return (
    <div className="mb-8">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 bg-gray-800 hover:text-white transition-colors"
          >
            {isExpanded ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-6">
            {/* Agent Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">Agents</h3>
              <div className="flex flex-wrap gap-2">
                {agents.map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgents(toggleArrayFilter(selectedAgents, agent.id))}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedAgents.includes(agent.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {agent.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategories(toggleArrayFilter(selectedCategories, category))}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategories.includes(category)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Support Level Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">Support Levels</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'yes', label: 'Yes ✅', color: 'bg-green-600' },
                  { value: 'partial', label: 'Partial 🟡', color: 'bg-yellow-600' },
                  { value: 'no', label: 'No ❌', color: 'bg-red-600' },
                  { value: 'unknown', label: 'Unknown ❓', color: 'bg-gray-600' }
                ].map(level => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedSupportLevels(toggleArrayFilter(selectedSupportLevels, level.value as SupportLevel) as SupportLevel[])}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedSupportLevels.includes(level.value as SupportLevel)
                        ? `${level.color} text-white`
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* View Options */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">View Options</h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={filters.showUnknown}
                    onChange={(e) => updateFilters({ showUnknown: e.target.checked })}
                    className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                  Show Unknown Status
                </label>
              </div>
            </div>

            {/* Clear All Button */}
            <div className="flex justify-end">
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {(selectedAgents.length > 0 || selectedCategories.length > 0 || filters.searchTerm) && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Active filters:</span>
              {filters.searchTerm && (
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  Search: &quot;{filters.searchTerm}&quot;
                </span>
              )}
              {selectedAgents.length > 0 && (
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  {selectedAgents.length} agent{selectedAgents.length > 1 ? 's' : ''}
                </span>
              )}
              {selectedCategories.length > 0 && (
                <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                  {selectedCategories.length} categor{selectedCategories.length > 1 ? 'ies' : 'y'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 