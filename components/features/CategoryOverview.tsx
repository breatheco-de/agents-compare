import Link from 'next/link'
import { Code2, Cpu, FileCode2, MoreHorizontal } from 'lucide-react'

interface CategoryOverviewProps {
  categories: Array<{
    category: string
    count: number
    description?: string
  }>
}

const categoryIcons: Record<string, React.ReactNode> = {
  'execution': <Code2 className="w-6 h-6" />,
  'model': <Cpu className="w-6 h-6" />,
  'ide': <FileCode2 className="w-6 h-6" />,
  'Other': <MoreHorizontal className="w-6 h-6" />
}

const categoryColors: Record<string, string> = {
  'execution': 'from-green-600 to-green-800',
  'model': 'from-blue-600 to-blue-800',
  'ide': 'from-purple-600 to-purple-800',
  'Other': 'from-gray-600 to-gray-800'
}

export default function CategoryOverview({ categories }: CategoryOverviewProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">Feature Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(({ category, count, description }) => (
          <Link
            key={category}
            href={`/feature?category=${encodeURIComponent(category)}`}
            className="group relative overflow-hidden rounded-lg border border-gray-700 
                       hover:border-gray-600 transition-all duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[category] || categoryColors.Other} opacity-10 
                            group-hover:opacity-20 transition-opacity`} />
            
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-800 rounded-lg text-gray-400 group-hover:text-gray-200 transition-colors">
                  {categoryIcons[category] || categoryIcons.Other}
                </div>
                <span className="text-2xl font-bold text-gray-200">{count}</span>
              </div>
              
              <h3 className="text-lg font-semibold mb-2 text-gray-100">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              
              <p className="text-sm text-gray-400 line-clamp-2">
                {description || `Explore ${count} features in this category`}
              </p>
              
              <div className="mt-4 text-sm text-blue-400 group-hover:text-blue-300 transition-colors">
                View features →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
} 