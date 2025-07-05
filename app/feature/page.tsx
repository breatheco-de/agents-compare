import { Metadata } from 'next'
import Script from 'next/script'
import { getAllFeaturesWithStats, getFeatureCategories, getFeaturedFeatures, getAllAgents } from '@/lib/data-loader'
import FeaturesHeader from '@/components/features/FeaturesHeader'
import FeaturesContent from '@/components/features/FeaturesContent'
import CategoryOverview from '@/components/features/CategoryOverview'
import FeaturedFeatures from '@/components/features/FeaturedFeatures'
import FeaturesCTA from '@/components/features/FeaturesCTA'

export const metadata: Metadata = {
  title: 'AI Coding Agent Features - Complete Comparison Index',
  description: 'Explore all AI coding agent features. Compare support across Cursor, Claude, Windsurf, and more. Filter by category, search capabilities.',
  openGraph: {
    title: 'AI Coding Agent Features Comparison',
    description: 'Explore all AI coding agent features. Compare support across Cursor, Claude, Windsurf, and more.',
    type: 'website',
    url: '/feature',
  },
  twitter: {
    card: 'summary',
    title: 'AI Coding Agent Features Comparison',
    description: 'Explore all AI coding agent features. Compare support across Cursor, Claude, Windsurf, and more.',
  },
  alternates: {
    canonical: '/feature',
  },
}

export default async function FeaturesIndexPage() {
  // Load all necessary data
  const [featuresWithStats, categories, featuredFeatures, agents] = await Promise.all([
    getAllFeaturesWithStats(),
    getFeatureCategories(),
    getFeaturedFeatures(),
    getAllAgents()
  ])

  // Calculate page statistics
  const totalFeatures = featuresWithStats.length
  const totalCategories = categories.length
  const mostSupportedFeature = featuresWithStats.reduce((prev, current) => 
    current.supportStats.supportedCount > prev.supportStats.supportedCount ? current : prev
  )
  const mostVariedFeature = featuresWithStats.reduce((prev, current) => {
    const currentVariance = current.supportStats.partialCount + 
      (current.supportStats.notSupportedCount > 0 ? 1 : 0);
    const prevVariance = prev.supportStats.partialCount + 
      (prev.supportStats.notSupportedCount > 0 ? 1 : 0);
    return currentVariance > prevVariance ? current : prev;
  })

  // Generate Schema.org structured data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Coding Agent Features',
    description: 'Comprehensive collection of AI coding agent features with support comparison across multiple agents.',
    url: 'https://agents.4geeks.com/feature',
    numberOfItems: totalFeatures,
    keywords: 'AI coding agents, features comparison, Cursor, Claude, Windsurf, MCP support, context window',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalFeatures,
      itemListElement: featuresWithStats.map(({ feature }, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: feature.name,
        description: feature.description,
        url: `https://agents.4geeks.com/feature/${feature.id}`
      }))
    }
  }

  return (
    <>
      <Script
        id="features-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      <main className="min-h-screen bg-gray-900 text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <FeaturesHeader 
            totalFeatures={totalFeatures}
            totalCategories={totalCategories}
            mostSupportedFeature={mostSupportedFeature.feature.name}
            mostVariedFeature={mostVariedFeature.feature.name}
          />
          
          <FeaturesContent
            featuresWithStats={featuresWithStats}
            categories={categories}
            agents={agents}
          />
          
          <FeaturedFeatures features={featuredFeatures} />
          
          <FeaturesCTA />
        </div>
      </main>
    </>
  )
} 