interface FeatureOverviewProps {
  overview?: string
  importance?: string
  useCases?: string[]
}

export default function FeatureOverview({ overview, importance, useCases }: FeatureOverviewProps) {
  if (!overview && !importance && !useCases) return null

  return (
    <section className="mb-12 space-y-6">
      {overview && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed">{overview}</p>
          </div>
        </div>
      )}

      {importance && (
        <div>
          <h3 className="text-xl font-semibold mb-3 text-blue-400">Why It Matters</h3>
          <p className="text-gray-300 leading-relaxed bg-gray-800/50 p-4 rounded-lg border-l-4 border-blue-500">
            {importance}
          </p>
        </div>
      )}

      {useCases && useCases.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-3">Common Use Cases</h3>
          <ul className="space-y-2">
            {useCases.map((useCase, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-blue-400 mt-0.5">▸</span>
                <span className="text-gray-300">{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
} 