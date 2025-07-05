'use client'

import { useState, useEffect, useCallback } from 'react'
import { Filter, ChevronDown, X } from 'lucide-react'
import type { Feature } from '@/types'

interface FeaturesSearchFilterProps {
  features: Array<{
    feature: Feature
    supportStats: {
      totalAgents: number
      supportedCount: number
      partialCount: number
      notSupportedCount: number
      unknownCount: number
    }
  }>
  categories: Array<{
    category: string
    count: number
  }>
  agents: Array<{ id: string; name: string }>
  onFilterChange: (filtered: any[]) => void
}

type SortOption = 'name-asc' | 'name-desc' | 'category' | 'support-desc' | 'support-asc'
type SupportFilter = 'all' | 'fully' | 'partial' | 'none'

// Searchable dropdown component
function SearchableDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder,
  label
}: {
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (value: string) => void
  placeholder: string
  label: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(search.toLowerCase())
  )
  
  const selectedOption = options.find(opt => opt.value === value)
  
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                   text-gray-100 text-left flex items-center justify-between
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>{selectedOption?.label || placeholder}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full px-4 py-2 bg-gray-800 border-b border-gray-700 rounded-t-lg 
                       text-gray-100 placeholder-gray-400 focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                  setSearch('')
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-700 text-gray-100"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function FeaturesSearchFilter({ 
  features, 
  categories, 
  agents,
  onFilterChange 
}: FeaturesSearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [supportFilter, setSupportFilter] = useState<SupportFilter>('all')
  const [sortOption, setSortOption] = useState<SortOption>('name-asc')

  // Create options for dropdowns
  const featureOptions = [
    { value: 'all', label: 'All Features' },
    ...features.map(({ feature }) => ({
      value: feature.id,
      label: feature.name
    }))
  ]

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(({ category, count }) => ({
      value: category,
      label: `${category} (${count})`
    }))
  ]

  const supportOptions = [
    { value: 'all', label: 'All Support Levels' },
    { value: 'fully', label: 'Fully Supported' },
    { value: 'partial', label: 'Partially Supported' },
    { value: 'none', label: 'Not Supported' }
  ]

  // Filter and sort features
  const filterAndSort = useCallback(() => {
    let filtered = [...features]

    // Feature name filter
    if (selectedFeature !== 'all') {
      filtered = filtered.filter(({ feature }) => 
        feature.id === selectedFeature
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(({ feature }) => 
        feature.category === selectedCategory
      )
    }

    // Support level filter
    if (supportFilter !== 'all') {
      filtered = filtered.filter(({ supportStats }) => {
        switch (supportFilter) {
          case 'fully':
            return supportStats.supportedCount >= supportStats.totalAgents * 0.5
          case 'partial':
            return supportStats.partialCount > 0
          case 'none':
            return supportStats.notSupportedCount > 0
          default:
            return true
        }
      })
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.feature.name.localeCompare(b.feature.name)
        case 'name-desc':
          return b.feature.name.localeCompare(a.feature.name)
        case 'category':
          return (a.feature.category || 'Other').localeCompare(b.feature.category || 'Other')
        case 'support-desc':
          return b.supportStats.supportedCount - a.supportStats.supportedCount
        case 'support-asc':
          return a.supportStats.supportedCount - b.supportStats.supportedCount
        default:
          return 0
      }
    })

    onFilterChange(filtered)
  }, [selectedFeature, selectedCategory, supportFilter, sortOption, features, onFilterChange])

  useEffect(() => {
    filterAndSort()
  }, [filterAndSort])

  const activeFiltersCount = [
    selectedFeature !== 'all',
    selectedCategory !== 'all',
    supportFilter !== 'all'
  ].filter(Boolean).length

  return (
    <section className="mb-8" aria-label="Search and Filter">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="mb-4 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                   text-gray-100 hover:bg-gray-700 transition-colors flex items-center gap-2"
        aria-expanded={showFilters}
      >
        <Filter className="w-4 h-4" />
        Filters
        {activeFiltersCount > 0 && (
          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Collapsible Filter Section */}
      {showFilters && (
        <div className="mb-6 p-6 bg-gray-800 rounded-lg border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <SearchableDropdown
              options={featureOptions}
              value={selectedFeature}
              onChange={setSelectedFeature}
              placeholder="Select a feature"
              label="Filter by Name"
            />
            
            <SearchableDropdown
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Select a category"
              label="Filter by Category"
            />
            
            <SearchableDropdown
              options={supportOptions}
              value={supportFilter}
              onChange={(value) => setSupportFilter(value as SupportFilter)}
              placeholder="Select support level"
              label="Filter by Support Level"
            />
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <label htmlFor="sort-option" className="text-sm font-medium text-gray-300">Sort by:</label>
            <select
              id="sort-option"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                         text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="category">Category</option>
              <option value="support-desc">Most Supported</option>
              <option value="support-asc">Least Supported</option>
            </select>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-400">Active filters:</span>
              {selectedFeature !== 'all' && (
                <button
                  onClick={() => setSelectedFeature('all')}
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm flex items-center gap-1 
                             hover:bg-gray-600 transition-colors"
                >
                  Feature: {featureOptions.find(opt => opt.value === selectedFeature)?.label}
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm flex items-center gap-1 
                             hover:bg-gray-600 transition-colors"
                >
                  Category: {selectedCategory}
                  <X className="w-3 h-3" />
                </button>
              )}
              {supportFilter !== 'all' && (
                <button
                  onClick={() => setSupportFilter('all')}
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm flex items-center gap-1 
                             hover:bg-gray-600 transition-colors"
                >
                  Support: {supportOptions.find(opt => opt.value === supportFilter)?.label}
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedFeature('all')
                  setSelectedCategory('all')
                  setSupportFilter('all')
                }}
                className="px-3 py-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
} 