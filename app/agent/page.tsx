import { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { getAllAgentsWithStats, getAgentProviders, getSupportedIDEs, getAllFeatures } from '@/lib/data-loader'

export const metadata: Metadata = {
  title: 'AI Coding Agents Directory - Compare Features & Capabilities',
  description: 'Explore and compare AI coding agents. Find the perfect assistant for your development workflow with detailed feature matrices and compatibility information.',
  openGraph: {
    title: 'AI Coding Agents Directory - Compare Features & Capabilities',
    description: 'Explore and compare AI coding agents. Find the perfect assistant for your development workflow with detailed feature matrices and compatibility information.',
    type: 'website',
    url: '/agent',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Coding Agents Directory',
    description: 'Explore and compare AI coding agents. Find the perfect assistant for your development workflow.',
  },
  alternates: {
    canonical: '/agent',
  },
}

export default async function AgentsIndexPage() {
  // Load all necessary data
  const [agentsWithStats, providers, supportedIDEs, features] = await Promise.all([
    getAllAgentsWithStats(),
    getAgentProviders(),
    getSupportedIDEs(),
    getAllFeatures()
  ])

  // Calculate page statistics
  const totalAgents = agentsWithStats.length
  const totalProviders = providers.length
  const totalFeatures = features.length
  const averageSupportPercentage = Math.round(
    agentsWithStats.reduce((sum, { supportStats }) => sum + supportStats.supportPercentage, 0) / totalAgents
  )
  
  const mostSupportedAgent = agentsWithStats.reduce((prev, current) => 
    current.supportStats.supportPercentage > prev.supportStats.supportPercentage ? current : prev
  )

  // Generate Schema.org structured data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Coding Agents Directory',
    description: 'Comprehensive directory of AI coding agents with feature comparison and compatibility information.',
    url: 'https://agents.4geeks.com/agent',
    numberOfItems: totalAgents,
    keywords: 'AI coding agents, Cursor, Claude, Windsurf, comparison, features, IDE compatibility',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalAgents,
      itemListElement: agentsWithStats.map(({ agent }, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: agent.name,
          alternateName: agent.aliases,
          description: agent.description,
          manufacturer: {
            '@type': 'Organization',
            name: agent.provider
          },
          url: `https://agents.4geeks.com/agent/${agent.id}`
        }
      }))
    }
  }

  return (
    <>
      <Script
        id="agents-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      <main className="min-h-screen bg-gray-900 text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Explore All AI Coding Agents
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Dive into the full list of coding agents and discover their strengths, capabilities, and integrations. 
              Compare features, find the perfect match for your workflow, and make informed decisions.
            </p>
            
            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">{totalAgents}</div>
                <div className="text-sm text-gray-400">Total Agents</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">{averageSupportPercentage}%</div>
                <div className="text-sm text-gray-400">Avg Support</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">{totalFeatures}</div>
                <div className="text-sm text-gray-400">Features Tracked</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">{totalProviders}</div>
                <div className="text-sm text-gray-400">Providers</div>
              </div>
            </div>
            
            {/* Key Insights */}
            <div className="text-center mb-8">
              <p className="text-gray-400 mb-2">
                <span className="text-blue-400 font-semibold">{mostSupportedAgent.agent.name}</span> has the highest feature support percentage
              </p>
            </div>
          </div>

          {/* Agents Grid */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">All Agents</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentsWithStats.map(({ agent, supportStats }) => (
                <div key={agent.id} className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white">
                          <Link href={`/agent/${agent.id}`} className="hover:text-blue-400 transition-colors hover:underline">
                            {agent.name}
                          </Link>
                        </h3>
                        
                        {agent.aliases && agent.aliases.length > 0 && (
                          <p className="text-sm text-gray-400 mt-1">
                            Also known as: {agent.aliases.join(', ')}
                          </p>
                        )}
                        
                        <p className="text-sm text-gray-500 mt-1">
                          by {agent.provider}
                        </p>
                      </div>
                      
                      {/* Support Percentage Badge */}
                      <div className="flex-shrink-0 ml-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          supportStats.supportPercentage >= 80 ? 'bg-green-500/20 text-green-400' :
                          supportStats.supportPercentage >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                          supportStats.supportPercentage >= 40 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {supportStats.supportPercentage}%
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {agent.description}
                    </p>

                    {/* Supported IDEs */}
                    {agent.supported_ide && agent.supported_ide.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                          Supported IDEs
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {agent.supported_ide.map((ide) => (
                            <span
                              key={ide}
                              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                            >
                              {ide}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Feature Support Statistics */}
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                        Feature Support
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Full Support:</span>
                          <span className="text-green-400 font-medium">{supportStats.supportedCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Partial:</span>
                          <span className="text-yellow-400 font-medium">{supportStats.partialCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Not Supported:</span>
                          <span className="text-red-400 font-medium">{supportStats.notSupportedCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Unknown:</span>
                          <span className="text-gray-500 font-medium">{supportStats.unknownCount}</span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-2">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${supportStats.supportPercentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {supportStats.supportedCount} of {supportStats.totalFeatures} fully supported features
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/agent/${agent.id}`}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors text-center"
                      >
                        View Details
                      </Link>
                      
                      <a
                        href={agent.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-sm font-medium rounded-lg transition-colors"
                        title={`Visit ${agent.name} website`}
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                          />
                        </svg>
                        <span className="sr-only">Visit website</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Compare Agents?
            </h2>
            
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Dive deeper into specific agent comparisons, explore feature details, or discover how different agents stack up against each other.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/feature"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Explore Features
              </Link>
              
              <a
                href="/api/agent"
                className="px-8 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Data (JSON)
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  )
} 