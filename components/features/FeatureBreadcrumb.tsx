import Link from 'next/link'

interface FeatureBreadcrumbProps {
  featureName: string
}

export default function FeatureBreadcrumb({ featureName }: FeatureBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            Home
          </Link>
        </li>
        <li className="text-gray-600">/</li>
        <li>
          <span className="text-gray-400">Features</span>
        </li>
        <li className="text-gray-600">/</li>
        <li>
          <span className="text-gray-200" aria-current="page">{featureName}</span>
        </li>
      </ol>
    </nav>
  )
} 