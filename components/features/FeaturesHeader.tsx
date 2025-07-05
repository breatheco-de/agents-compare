import Link from 'next/link'

interface FeaturesHeaderProps {
  totalFeatures: number
  totalCategories: number
  mostSupportedFeature: string
  mostVariedFeature: string
}

export default function FeaturesHeader({ 
  totalFeatures, 
  totalCategories, 
  mostSupportedFeature,
  mostVariedFeature 
}: FeaturesHeaderProps) {
  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-400">
          <li>
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <span className="text-gray-200">Features</span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-0">
            AI Coding Agent Features
          </h1>
          <div className="bg-red-600 text-white px-4 py-2 rounded-lg">
            <p className="text-2xl font-bold">{totalFeatures}</p>
            <p className="text-sm">total features</p>
          </div>
        </div>
        <p className="text-xl text-gray-400 max-w-3xl">
          Explore comprehensive feature comparisons across all AI coding agents. 
          Find the capabilities that matter most to your development workflow.
        </p>
      </header>
    </>
  )
} 