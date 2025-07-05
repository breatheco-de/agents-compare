import Link from 'next/link'

export default function AgentsCTA() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">
        Ready to Compare Agents?
      </h2>
      
      <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
        Dive deeper into specific agent comparisons, explore feature details, or discover how different agents stack up against each other.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => {
            // TODO: Implement comparison functionality
            alert('Comparison feature coming soon!')
          }}
        >
          Compare Agents
        </button>
        
        <Link
          href="/feature"
          className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
        >
          Explore Features
        </Link>
        
        <a
          href="/agent/index.json"
          className="px-8 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Data (JSON)
        </a>
      </div>
      
      <div className="mt-8 text-sm text-blue-100">
        <p>
          Want to contribute? <a href="https://github.com/4GeeksAcademy/agents-compare" className="underline hover:text-white">Help us improve this comparison</a>
        </p>
      </div>
    </section>
  )
} 