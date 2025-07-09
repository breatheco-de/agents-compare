import { Metadata } from 'next'
import { loadAgents, loadFeatures, loadAgentFeatureSupport } from '@/lib/data-loader'
import { ComparisonTable } from '@/components/comparison/ComparisonTable'
import { ComparisonHeader } from '@/components/comparison/ComparisonHeader'
import { ComparisonFilters } from '@/components/comparison/ComparisonFilters'
import { ComparisonStats } from '@/components/comparison/ComparisonStats'
import PageContainer from '@/components/layout/PageContainer'
import type { Agent, Feature, AgentFeatureSupport } from '@/types'

export const metadata: Metadata = {
  title: 'Complete AI Coding Agents Comparison - Feature Matrix & Capabilities',
  description: 'Compare all AI coding agents side-by-side. Complete feature matrix showing support levels, capabilities, and compatibility across every major coding assistant.',
  openGraph: {
    title: 'Complete AI Coding Agents Comparison - Feature Matrix & Capabilities',
    description: 'Compare all AI coding agents side-by-side. Complete feature matrix showing support levels, capabilities, and compatibility across every major coding assistant.',
    type: 'website',
    url: '/compare',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Complete AI Coding Agents Comparison - Feature Matrix & Capabilities',
    description: 'Compare all AI coding agents side-by-side. Complete feature matrix showing support levels, capabilities, and compatibility across every major coding assistant.',
  },
  alternates: {
    canonical: '/compare',
  },
}

interface ComparisonData {
  agents: Agent[]
  features: Feature[]
  supportMatrix: AgentFeatureSupport[]
  statistics: {
    totalAgents: number
    totalFeatures: number
    totalComparisons: number
    lastUpdated: string
  }
}

async function getComparisonData(): Promise<ComparisonData> {
  const [agents, features, supportMatrix] = await Promise.all([
    loadAgents(),
    loadFeatures(),
    loadAgentFeatureSupport()
  ])

  const statistics = {
    totalAgents: agents.length,
    totalFeatures: features.length,
    totalComparisons: agents.length * features.length,
    lastUpdated: new Date().toISOString()
  }

  return {
    agents,
    features,
    supportMatrix,
    statistics
  }
}

// Generate structured data for SEO
function generateStructuredData(data: ComparisonData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Coding Agents Complete Feature Comparison',
    description: 'Comprehensive comparison table of AI coding agents and their feature support levels',
    url: '/compare',
    numberOfItems: data.statistics.totalComparisons,
    itemListElement: data.agents.map((agent, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: agent.name,
        description: agent.description,
        url: `/agent/${agent.id}`,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: agent.supported_ide.join(', '),
        provider: {
          '@type': 'Organization',
          name: agent.provider
        }
      }
    }))
  }
}

export default async function ComparePage() {
  const data = await getComparisonData()
  const structuredData = generateStructuredData(data)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <PageContainer>
        <div className="min-h-screen bg-gray-950 text-white">
          {/* Header Section */}
          <ComparisonHeader statistics={data.statistics} />
          
          {/* Filters Section */}
          <ComparisonFilters 
            agents={data.agents} 
            features={data.features} 
          />
          
          {/* Main Comparison Table */}
          <div className="mb-12">
            <ComparisonTable 
              agents={data.agents}
              features={data.features}
              supportMatrix={data.supportMatrix}
            />
          </div>
          
          {/* Statistics Section */}
          <ComparisonStats 
            agents={data.agents}
            features={data.features}
            supportMatrix={data.supportMatrix}
          />
        </div>
      </PageContainer>
    </>
  )
} 