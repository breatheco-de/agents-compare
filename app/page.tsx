import { loadAgents, loadFeatures, loadAgentFeatureSupport } from '@/lib/data-loader'
import { AgentFeatureMatrix } from '@/components/comparison/AgentFeatureMatrix'
import PageContainer from '@/components/layout/PageContainer'
import { CompareSelector } from '@/components/home/CompareSelector'

export default async function HomePage() {
  const agents = await loadAgents()
  const features = await loadFeatures()
  const supportMatrix = await loadAgentFeatureSupport()

  return (
    <>
    <PageContainer>
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          Compare AI Coding Agents Feature by Feature
        </h1>
                 <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
          Find the perfect AI coding assistant for your needs. Compare agents like Cursor, GitHub Copilot, and Claude Code across key features including MCP support, context windows, and planning capabilities.
        </p>
        
        {/* Compare Selector */}
        <CompareSelector agents={agents} features={features} />
      </section>

    </PageContainer>

    {/* Full-width comparison: matrix on desktop, cards on mobile */}
    <section className="mx-auto mb-4 w-full max-w-[1920px] px-4 md:px-6">
      <h2 className="mb-6 text-center text-2xl font-bold">Quick Feature Comparison</h2>
      <AgentFeatureMatrix agents={agents} features={features} supportMatrix={supportMatrix} />
    </section>

    <PageContainer>
      {/* Quick Links */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Explore More</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-gray-600 rounded-lg p-6 hover:bg-gray-800/30 transition-colors">
            <h3 className="font-semibold mb-2">Individual Agents</h3>
            <p className="text-sm text-gray-400 mb-4">Detailed profiles for each AI coding agent</p>
            <div className="space-y-2">
              {agents.map(agent => (
                <a key={agent.id} href={`/agent/${agent.id}`} className="block text-sm text-blue-400 hover:underline">
                  {agent.name}
                </a>
              ))}
            </div>
          </div>
          
          <div className="border border-gray-600 rounded-lg p-6 hover:bg-gray-800/30 transition-colors">
            <h3 className="font-semibold mb-2">Features</h3>
            <p className="text-sm text-gray-400 mb-4">Compare agents by specific capabilities</p>
            <div className="space-y-2">
              {features.map(feature => (
                <a key={feature.id} href={`/feature/${feature.id}`} className="block text-sm text-blue-400 hover:underline">
                  {feature.name}
                </a>
              ))}
            </div>
          </div>
          
          <div className="border border-gray-600 rounded-lg p-6 hover:bg-gray-800/30 transition-colors">
            <h3 className="font-semibold mb-2">Direct Comparisons</h3>
            <p className="text-sm text-gray-400 mb-4">Head-to-head agent comparisons</p>
            <div className="space-y-2">
              <a href="/compare?agents=claude-code,cursor" className="block text-sm text-blue-400 hover:underline">
                Claude Code vs Cursor
              </a>
              <a href="/compare?agents=github-copilot,cursor" className="block text-sm text-blue-400 hover:underline">
                GitHub Copilot vs Cursor
              </a>
              <a href="/compare?agents=github-copilot,claude-code" className="block text-sm text-blue-400 hover:underline">
                GitHub Copilot vs Claude Code
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800/30 border border-gray-600 rounded-lg p-6">
            <p className="text-gray-400 mb-4">
              Our comparison data is sourced from static JSON files maintained in our GitHub repository. 
              This approach ensures transparency, accuracy, and allows the community to contribute through pull requests.
            </p>
            <p className="text-gray-400 mb-4">
              All data is optimized for both human readers and AI agents, with machine-readable JSON endpoints 
              available for programmatic access. The platform is designed with semantic HTML and schema.org 
              structured data for maximum discoverability.
            </p>
            <p className="text-gray-400">
                              <a href="https://github.com/breatheco-de/agents-compare" className="text-blue-400 hover:underline">
                View our GitHub repository
              </a> to see the data sources and contribute updates.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <div className="max-w-md mx-auto">
          <a 
            href="/compare"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-black bg-white hover:bg-gray-100 transition-colors"
          >
            Start Comparing Agents
          </a>
        </div>
      </section>
    </PageContainer>
    </>
  )
} 
