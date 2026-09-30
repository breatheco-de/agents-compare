import { loadAgents, loadFeatures, loadAgentFeatureSupport } from '@/lib/data-loader'
import { Table } from '@/components/tables/Table'
import { ScrollArea } from '@/components/tables/ScrollArea'
import { SupportLevelIcon } from '@/components/ui/SupportLevelBadge'
import { SupportLegend } from '@/components/comparison/SupportLegend'
import { ComparisonCards } from '@/components/comparison/ComparisonCards'
import PageContainer from '@/components/layout/PageContainer'
import { CompareSelector } from '@/components/home/CompareSelector'

export default async function HomePage() {
  const agents = await loadAgents()
  const features = await loadFeatures()
  const supportMatrix = await loadAgentFeatureSupport()

  return (
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

      {/* Preview Comparison Table (3x5) */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Quick Feature Comparison</h2>
        {/* Desktop table; small screens use the card layout below */}
        <div className="hidden md:block">
        <SupportLegend className="mb-4" />
        <ScrollArea label="Quick feature comparison table" className="max-h-[70vh] rounded-lg border border-gray-600">
          <Table bare ariaLabel="Quick comparison of AI coding agents and their feature support" className="w-full border-separate border-spacing-0">
            {/* The whole header row is sticky with one background, so rotated labels can overflow into neighbouring columns */}
            <thead className="sticky top-0 z-20 bg-gray-800">
              <tr>
                <th scope="col" className="sticky left-0 z-30 w-48 min-w-[12rem] border-b border-r border-gray-600 bg-gray-800 px-4 py-3 text-left align-bottom text-sm font-semibold text-gray-200">
                  Agent
                </th>
                {features.map(feature => (
                  <th key={feature.id} scope="col" className="h-40 w-14 min-w-[3.5rem] border-b border-gray-600 p-0 align-bottom">
                    {/* Rotated label keeps columns narrow so the table fits without horizontal scroll */}
                    <div className="relative h-40 w-14">
                      <a
                        href={`/feature/${feature.id}`}
                        title={feature.name}
                        className="absolute bottom-3 left-1/2 block w-40 origin-bottom-left -rotate-45 text-left text-xs font-semibold leading-tight text-gray-200 hover:text-blue-400"
                      >
                        {feature.name}
                      </a>
                    </div>
                  </th>
                ))}
                {/* Spacer so the last rotated label isn't cut off */}
                <th aria-hidden="true" className="w-28 min-w-[7rem] border-b border-gray-600" />
              </tr>
            </thead>
            <tbody>
              {agents.map(agent => (
                <tr key={agent.id} className="group">
                  <th scope="row" className="sticky left-0 z-10 border-b border-r border-gray-700 bg-gray-900 px-4 py-3 text-left font-normal group-hover:bg-gray-800">
                    <a
                      href={`/agent/${agent.id}`}
                      className="font-semibold text-blue-400 hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                      {agent.name}
                    </a>
                    <div className="text-sm text-gray-400">{agent.provider}</div>
                  </th>
                  {features.map(feature => {
                    const support = supportMatrix.find(s => s.agent_id === agent.id && s.feature_id === feature.id)
                    const level = support?.support_level || 'unknown'

                    return (
                      <td key={feature.id} className="border-b border-gray-700 px-1 py-3 text-center group-hover:bg-gray-800/40">
                        <SupportLevelIcon
                          level={level as 'yes' | 'partial' | 'no' | 'unknown'}
                          context={`${agent.name} · ${feature.name}`}
                          notes={support?.notes}
                        />
                      </td>
                    )
                  })}
                  <td aria-hidden="true" className="border-b border-gray-700 group-hover:bg-gray-800/40" />
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollArea>
        </div>
        <ComparisonCards
          agents={agents}
          features={features}
          supportMatrix={supportMatrix}
          selectedSupportLevels={[]}
        />
      </section>

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
  )
} 
