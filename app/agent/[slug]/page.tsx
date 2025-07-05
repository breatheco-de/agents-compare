import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { loadAgent, loadAgentFeatureSupport, loadIndex, loadFeatures } from '@/lib/data-loader'
import type { Agent, Feature, AgentFeatureSupport } from '@/types'
import SupportMatrix from '@/components/tables/SupportMatrix'
import FAQAccordion from '@/components/FAQAccordion'
import PageContainer from '@/components/layout/PageContainer'

interface PageProps {
  params: {
    slug: string
  }
}

// Generate static params for all agents at build time
export async function generateStaticParams() {
  try {
    const index = await loadIndex()
    return index.agents.map((agentId) => ({
      slug: agentId,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const agent = await loadAgent(params.slug)
    
    // Create a list of all names (primary + aliases) for SEO
    const allNames = [agent.name, ...agent.aliases].join(', ')
    
    return {
      title: `${agent.name} - AI Coding Agent Features & Capabilities`,
      description: agent.description.slice(0, 160), // Limit to 160 chars for SEO
      openGraph: {
        title: `${agent.name} - ${allNames}`,
        description: agent.description,
        type: 'website',
        url: `/agent/${params.slug}`,
      },
      twitter: {
        card: 'summary',
        title: `${agent.name} - AI Coding Agent`,
        description: agent.description,
      },
      alternates: {
        canonical: `/agent/${params.slug}`,
      },
    }
  } catch (error) {
    return {
      title: 'Agent Not Found',
      description: 'The requested agent could not be found.',
    }
  }
}

// Normalize slug for case-insensitive matching
function normalizeSlug(slug: string): string {
  return slug.toLowerCase().trim()
}

export default async function AgentDetailPage({ params }: PageProps) {
  try {
    // Normalize the slug for case-insensitive matching
    const normalizedSlug = normalizeSlug(params.slug)
    
    // Try to load the agent data
    let agent: Agent
    try {
      agent = await loadAgent(normalizedSlug)
    } catch (error) {
      // If direct loading fails, try to find agent by checking all agents
      const index = await loadIndex()
      const matchingAgentId = index.agents.find(id => normalizeSlug(id) === normalizedSlug)
      
      if (!matchingAgentId) {
        notFound()
      }
      
      agent = await loadAgent(matchingAgentId)
    }
    
    // Load support matrix for this agent
    const supportMatrix = await loadAgentFeatureSupport(agent.id)
    
    // Load all features to get feature details
    const features = await loadFeatures()
    
    // Create a map for quick feature lookup
    const featureMap = new Map(features.map(f => [f.id, f]))
    
    // Group support by category
    const supportByCategory = supportMatrix.reduce((acc, support) => {
      const feature = featureMap.get(support.feature_id)
      if (feature) {
        const category = feature.category
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push({ support, feature })
      }
      return acc
    }, {} as Record<string, Array<{ support: AgentFeatureSupport; feature: Feature }>>)

    return (
      <PageContainer>
          {/* Header Section */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{agent.name}</h1>
            {agent.aliases.length > 0 && (
              <p className="text-gray-400 mb-4">
                Also known as: {agent.aliases.join(', ')}
              </p>
            )}
            <p className="text-lg text-gray-300 mb-6">{agent.description}</p>
            
            {/* External Links */}
            <div className="flex gap-4 flex-wrap">
              <a
                href={agent.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Official Website
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </header>

          {/* Metadata Section */}
          <section aria-labelledby="metadata-heading" className="mb-8">
            <h2 id="metadata-heading" className="text-2xl font-semibold mb-4">Agent Information</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800 rounded-lg p-6">
              <div>
                <dt className="text-gray-400 text-sm">Provider</dt>
                <dd className="text-lg font-medium">{agent.provider}</dd>
              </div>
              <div>
                <dt className="text-gray-400 text-sm">Supported IDEs</dt>
                <dd className="text-lg font-medium">{agent.supported_ide.join(', ')}</dd>
              </div>
            </dl>
          </section>

          {/* Feature Support Matrix */}
          <section aria-labelledby="support-matrix-heading" className="mb-8">
            <h2 id="support-matrix-heading" className="text-2xl font-semibold mb-4">Feature Support Matrix</h2>
            
              <SupportMatrix 
                supportByCategory={supportByCategory} 
                agentName={agent.name}
              />
          </section>

          {/* Call-to-Action Section */}
          <section className="mb-8">
            <div className="flex gap-4 flex-wrap justify-center">
              <a
                href={`/compare/${agent.id}-vs-`}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Compare with another agent
              </a>
              <a
                href="/"
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
              >
                See all agents
              </a>
            </div>
          </section>

          {/* FAQ Section */}
          {agent.faq && agent.faq.length > 0 && (
            <section aria-labelledby="faq-heading" className="mb-8">
              <h2 id="faq-heading" className="text-2xl font-semibold mb-4">
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={agent.faq} />
            </section>
          )}
      </PageContainer>
    )
  } catch (error) {
    console.error('Error loading agent:', error)
    notFound()
  }
} 