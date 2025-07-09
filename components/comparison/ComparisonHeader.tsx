import Link from 'next/link'

interface ComparisonHeaderProps {
  statistics: {
    totalAgents: number
    totalFeatures: number
    totalComparisons: number
    lastUpdated: string
  }
}

export function ComparisonHeader({ statistics }: ComparisonHeaderProps) {
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          All AI Coding Agents Compared Side-by-Side
        </h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Explore detailed support levels for every major AI coding agent across dozens of capabilities—from context handling and model support to execution strategies and IDE compatibility.
        </p>
      </div>

      {/* Statistics Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {statistics.totalAgents}
          </div>
          <div className="text-gray-300 text-sm">
            Agents Compared
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {statistics.totalFeatures}
          </div>
          <div className="text-gray-300 text-sm">
            Features Evaluated
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {statistics.totalComparisons}
          </div>
          <div className="text-gray-300 text-sm">
            Total Comparisons
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <div className="text-sm font-semibold text-yellow-400 mb-2">
            Last Updated
          </div>
          <div className="text-gray-300 text-xs">
            {formatDate(statistics.lastUpdated)}
          </div>
        </div>
      </div>

      {/* Call-to-Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/agent"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
        >
          See Individual Agents
        </Link>
        <Link
          href="/feature"
          className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
        >
          See All Features
        </Link>
      </div>
    </div>
  )
} 