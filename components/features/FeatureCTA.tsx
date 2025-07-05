import Link from 'next/link'
import { Feature } from '@/types'

interface FeatureCTAProps {
  currentFeature: Feature
  relatedFeatures?: Feature[]
}

export default function FeatureCTA({ currentFeature, relatedFeatures }: FeatureCTAProps) {
  return (
    <div className="space-y-8">
      {/* Related Features */}
      {relatedFeatures && relatedFeatures.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Related Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedFeatures.slice(0, 3).map((feature) => (
              <Link
                key={feature.id}
                href={`/feature/${feature.id}`}
                className="block p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <h3 className="font-medium mb-2">{feature.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {feature.description}
                </p>
                {feature.category && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
                    {feature.category}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Main CTA */}
      <section className="mt-12">
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-8 border border-gray-700">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ready to Compare Agents?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              See how different AI coding agents stack up for {currentFeature.name} and other features.
              Make an informed decision based on your specific needs.
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
              >
                Compare All Agents
              </Link>
              <Link
                href="/"
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all"
              >
                Browse All Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <nav className="border-t border-gray-800 pt-8" aria-label="Feature navigation">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">Quick Links:</span>
            <Link href="/agent/cursor" className="text-blue-400 hover:underline">
              Cursor
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/agent/windsurf" className="text-blue-400 hover:underline">
              Windsurf
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/agent/claude-dev" className="text-blue-400 hover:underline">
              Claude Dev
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
} 