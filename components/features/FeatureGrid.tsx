import Link from 'next/link'
import type { Feature } from '@/types'

interface FeatureGridProps {
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
  viewMode: 'grid' | 'list'
}

export default function FeatureGrid({ features, viewMode }: FeatureGridProps) {
  // Calculate support level
  const getSupportLevel = (stats: FeatureGridProps['features'][0]['supportStats']) => {
    const { totalAgents, supportedCount, partialCount, notSupportedCount } = stats
    
    if (supportedCount >= totalAgents * 0.6) return { level: 'high', label: '✅ Fully Supported', color: 'text-green-400' }
    if (partialCount > 0 || supportedCount > 0) return { level: 'partial', label: '⚠️ Partially Supported', color: 'text-yellow-400' }
    if (notSupportedCount >= totalAgents * 0.6) return { level: 'low', label: '❌ Limited Support', color: 'text-red-400' }
    return { level: 'unknown', label: '❓ Unknown', color: 'text-gray-400' }
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ feature, supportStats }) => {
          const supportLevel = getSupportLevel(supportStats)
          return (
            <Link
              key={feature.id}
              href={`/feature/${feature.id}`}
              className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors 
                         border border-gray-700 hover:border-gray-600"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-100">
                  {feature.name}
                </h3>
                <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-md">
                  {feature.category || 'Other'}
                </span>
              </div>
              
              <p className="text-gray-400 mb-4 line-clamp-2">
                {feature.description}
              </p>
              
              <div className="flex justify-between items-center">
                <span className={`text-sm ${supportLevel.color}`}>
                  {supportLevel.label}
                </span>
                <span className="text-sm text-gray-500">
                  {supportStats.supportedCount}/{supportStats.totalAgents} agents
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    )
  }

  // List view
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-4 font-medium text-gray-300">Feature</th>
            <th className="text-left py-3 px-4 font-medium text-gray-300">Category</th>
            <th className="text-left py-3 px-4 font-medium text-gray-300">Support</th>
            <th className="text-right py-3 px-4 font-medium text-gray-300">Agents</th>
          </tr>
        </thead>
        <tbody>
          {features.map(({ feature, supportStats }) => {
            const supportLevel = getSupportLevel(supportStats)
            return (
              <tr 
                key={feature.id} 
                className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
              >
                <td className="py-3 px-4">
                  <Link 
                    href={`/feature/${feature.id}`}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    {feature.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                    {feature.description}
                  </p>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-md">
                    {feature.category || 'Other'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-sm ${supportLevel.color}`}>
                    {supportLevel.label}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-gray-400">
                  {supportStats.supportedCount}/{supportStats.totalAgents}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
} 