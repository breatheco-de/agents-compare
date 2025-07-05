import Link from 'next/link'
import { Star, TrendingUp } from 'lucide-react'
import type { Feature } from '@/types'

interface FeaturedFeaturesProps {
  features: Feature[]
}

export default function FeaturedFeatures({ features }: FeaturedFeaturesProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <Star className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-semibold">Most Important Features</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.id}
            href={`/feature/${feature.id}`}
            className="group relative overflow-hidden rounded-lg bg-gradient-to-br 
                       from-gray-800 to-gray-850 p-[1px] hover:from-blue-600 hover:to-purple-600 
                       transition-all duration-300"
          >
            <div className="relative bg-gray-900 rounded-lg p-6 h-full">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-100 group-hover:text-blue-300 transition-colors">
                  {feature.name}
                </h3>
                <TrendingUp className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
              </div>
              
              <p className="text-gray-400 mb-4 line-clamp-3">
                {feature.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 text-xs font-medium bg-gray-800 text-gray-300 rounded-full">
                  {feature.category || 'General'}
                </span>
                <span className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors">
                  Learn more →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-400 mb-4">
          These features are commonly requested and represent core capabilities that differentiate AI coding agents.
        </p>
      </div>
    </section>
  )
} 