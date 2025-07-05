import { Feature } from '@/types'

interface FeatureHeaderProps {
  feature: Feature
}

export default function FeatureHeader({ feature }: FeatureHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold mb-4">{feature.name}</h1>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {feature.category && (
          <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 rounded-md text-sm">
            {feature.category}
          </span>
        )}
        {feature.aliases && feature.aliases.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Also known as:</span>
            {feature.aliases.map((alias, index) => (
              <span key={alias}>
                {alias}
                {index < feature.aliases.length - 1 && ','}
              </span>
            ))}
          </div>
        )}
      </div>
      {feature.description && (
        <p className="text-lg text-gray-300">{feature.description}</p>
      )}
    </header>
  )
} 