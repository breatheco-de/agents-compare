'use client'

import { useState } from 'react'
import FeaturesSearchFilter from './FeaturesSearchFilter'
import FeatureGrid from './FeatureGrid'
import type { Feature, Agent } from '@/types'

interface FeaturesContentProps {
  featuresWithStats: Array<{
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
    description?: string
  }>
  agents: Agent[]
}

export default function FeaturesContent({ 
  featuresWithStats, 
  categories, 
  agents 
}: FeaturesContentProps) {
  const [filteredFeatures, setFilteredFeatures] = useState(featuresWithStats)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  return (
    <>
      <FeaturesSearchFilter
        features={featuresWithStats}
        categories={categories}
        agents={agents}
        onFilterChange={setFilteredFeatures}
      />

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-400">
          Showing {filteredFeatures.length} of {featuresWithStats.length} features
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            aria-label="Grid view"
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            aria-label="List view"
          >
            List
          </button>
        </div>
      </div>

      {/* Features Display */}
      <FeatureGrid 
        features={filteredFeatures} 
        viewMode={viewMode}
      />
    </>
  )
} 