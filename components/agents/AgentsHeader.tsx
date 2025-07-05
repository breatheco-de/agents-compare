'use client'

interface AgentsHeaderProps {
  totalAgents: number
  totalProviders: number
  totalFeatures: number
  averageSupportPercentage: number
  mostSupportedAgent: string
  mostVersatileAgent: string
}

export default function AgentsHeader({
  totalAgents,
  totalProviders,
  totalFeatures,
  averageSupportPercentage,
  mostSupportedAgent,
  mostVersatileAgent
}: AgentsHeaderProps) {
  return (
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
          <span className="text-blue-400 font-semibold">{mostSupportedAgent}</span> has the highest feature support percentage
        </p>
        <p className="text-gray-400">
          <span className="text-purple-400 font-semibold">{mostVersatileAgent}</span> offers the most versatile feature set
        </p>
      </div>
      
      {/* Call to Action */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
          Start Exploring
        </button>
        <button className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium">
          Compare Agents
        </button>
      </div>
    </div>
  )
} 