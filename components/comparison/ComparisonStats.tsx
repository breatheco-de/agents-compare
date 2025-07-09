'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { ChartBarIcon, TrophyIcon, ClockIcon } from '@heroicons/react/24/outline'
import type { Agent, Feature, AgentFeatureSupport } from '@/types'

interface ComparisonStatsProps {
  agents: Agent[]
  features: Feature[]
  supportMatrix: AgentFeatureSupport[]
}

export function ComparisonStats({ agents, features, supportMatrix }: ComparisonStatsProps) {
  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    // Agent statistics
    const agentStats = agents.map(agent => {
      const agentSupport = supportMatrix.filter(s => s.agent_id === agent.id)
      const supported = agentSupport.filter(s => s.support_level === 'yes').length
      const partial = agentSupport.filter(s => s.support_level === 'partial').length
      const total = features.length
      const percentage = Math.round((supported + partial * 0.5) / total * 100)
      
      return {
        agent,
        supported,
        partial,
        total,
        percentage
      }
    }).sort((a, b) => b.percentage - a.percentage)

    // Feature statistics
    const featureStats = features.map(feature => {
      const featureSupport = supportMatrix.filter(s => s.feature_id === feature.id)
      const supported = featureSupport.filter(s => s.support_level === 'yes').length
      const partial = featureSupport.filter(s => s.support_level === 'partial').length
      const total = agents.length
      const percentage = Math.round((supported + partial * 0.5) / total * 100)
      
      return {
        feature,
        supported,
        partial,
        total,
        percentage
      }
    }).sort((a, b) => b.percentage - a.percentage)

    // Category statistics
    const categoryStats = features.reduce((acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = {
          category: feature.category,
          features: [],
          totalSupport: 0,
          totalPartial: 0,
          totalFeatures: 0
        }
      }
      
      acc[feature.category].features.push(feature)
      acc[feature.category].totalFeatures++
      
      const featureSupport = supportMatrix.filter(s => s.feature_id === feature.id)
      acc[feature.category].totalSupport += featureSupport.filter(s => s.support_level === 'yes').length
      acc[feature.category].totalPartial += featureSupport.filter(s => s.support_level === 'partial').length
      
      return acc
    }, {} as Record<string, any>)

    // Overall statistics
    const totalComparisons = agents.length * features.length
    const totalYes = supportMatrix.filter(s => s.support_level === 'yes').length
    const totalPartial = supportMatrix.filter(s => s.support_level === 'partial').length
    const totalNo = supportMatrix.filter(s => s.support_level === 'no').length
    const totalUnknown = supportMatrix.filter(s => s.support_level === 'unknown').length
    const overallSupportPercentage = Math.round((totalYes + totalPartial * 0.5) / totalComparisons * 100)

    return {
      agentStats,
      featureStats,
      categoryStats: Object.values(categoryStats),
      overall: {
        totalComparisons,
        totalYes,
        totalPartial,
        totalNo,
        totalUnknown,
        overallSupportPercentage
      }
    }
  }, [agents, features, supportMatrix])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Comparison Statistics & Insights
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Comprehensive analysis of feature support across all AI coding agents
        </p>
      </div>

      {/* Overall Statistics */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <ChartBarIcon className="h-5 w-5" />
          Overall Support Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {stats.overall.totalYes}
            </div>
            <div className="text-sm text-gray-400">Full Support</div>
            <div className="text-xs text-gray-500">
              {Math.round(stats.overall.totalYes / stats.overall.totalComparisons * 100)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {stats.overall.totalPartial}
            </div>
            <div className="text-sm text-gray-400">Partial Support</div>
            <div className="text-xs text-gray-500">
              {Math.round(stats.overall.totalPartial / stats.overall.totalComparisons * 100)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {stats.overall.totalNo}
            </div>
            <div className="text-sm text-gray-400">No Support</div>
            <div className="text-xs text-gray-500">
              {Math.round(stats.overall.totalNo / stats.overall.totalComparisons * 100)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">
              {stats.overall.totalUnknown}
            </div>
            <div className="text-sm text-gray-400">Unknown</div>
            <div className="text-xs text-gray-500">
              {Math.round(stats.overall.totalUnknown / stats.overall.totalComparisons * 100)}%
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {stats.overall.overallSupportPercentage}%
          </div>
          <div className="text-gray-400">Overall Support Rate</div>
        </div>
      </div>

      {/* Top Performing Agents */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <TrophyIcon className="h-5 w-5" />
          Top Performing Agents
        </h3>
        <div className="space-y-3">
          {stats.agentStats.slice(0, 5).map((agentStat, index) => (
            <div key={agentStat.agent.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold text-blue-400">
                  #{index + 1}
                </div>
                <div>
                  <Link
                    href={`/agent/${agentStat.agent.id}`}
                    className="font-medium text-white hover:text-blue-400 transition-colors"
                  >
                    {agentStat.agent.name}
                  </Link>
                  <div className="text-sm text-gray-400">
                    {agentStat.agent.provider}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-400">
                  {agentStat.percentage}%
                </div>
                <div className="text-xs text-gray-400">
                  {agentStat.supported + agentStat.partial}/{agentStat.total} features
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Supported Features */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <ChartBarIcon className="h-5 w-5" />
          Most Supported Features
        </h3>
        <div className="space-y-3">
          {stats.featureStats.slice(0, 5).map((featureStat, index) => (
            <div key={featureStat.feature.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold text-purple-400">
                  #{index + 1}
                </div>
                <div>
                  <Link
                    href={`/feature/${featureStat.feature.id}`}
                    className="font-medium text-white hover:text-blue-400 transition-colors"
                  >
                    {featureStat.feature.name}
                  </Link>
                  <div className="text-sm text-gray-400">
                    {featureStat.feature.category}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-400">
                  {featureStat.percentage}%
                </div>
                <div className="text-xs text-gray-400">
                  {featureStat.supported + featureStat.partial}/{featureStat.total} agents
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Support by Category
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.categoryStats.map((categoryStat: any) => {
            const totalPossible = categoryStat.totalFeatures * agents.length
            const supportPercentage = Math.round((categoryStat.totalSupport + categoryStat.totalPartial * 0.5) / totalPossible * 100)
            
            return (
              <div key={categoryStat.category} className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">{categoryStat.category}</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">
                    {categoryStat.totalFeatures} features
                  </span>
                  <span className="text-sm font-medium text-green-400">
                    {supportPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${supportPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {categoryStat.totalSupport + categoryStat.totalPartial} / {totalPossible} supported
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Export & Share
        </h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Export as CSV
          </button>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            Export as JSON
          </button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            Share Comparison
          </button>
        </div>
      </div>
    </div>
  )
} 