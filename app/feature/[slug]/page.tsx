import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllFeatures, getFeatureBySlug, getFeatureSupport } from '@/lib/data-loader'
import PageContainer from '@/components/layout/PageContainer'
import FeatureHeader from '@/components/features/FeatureHeader'
import FeatureOverview from '@/components/features/FeatureOverview'
import AgentSupportMatrix from '@/components/features/AgentSupportMatrix'
import FeatureCTA from '@/components/features/FeatureCTA'
import FeatureBreadcrumb from '@/components/features/FeatureBreadcrumb'

interface FeaturePageProps {
  params: {
    slug: string
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: FeaturePageProps): Promise<Metadata> {
  const feature = await getFeatureBySlug(params.slug)
  
  if (!feature) {
    return {
      title: 'Feature Not Found',
      description: 'The requested feature could not be found.'
    }
  }

  const title = `${feature.name} - AI Coding Agent Feature Comparison`
  const description = feature.description || `Compare how different AI coding agents support ${feature.name}. See detailed implementation notes and support levels.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/feature/${params.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

// Generate static params for all features
export async function generateStaticParams() {
  const features = await getAllFeatures()
  
  return features.map((feature) => ({
    slug: feature.id,
  }))
}

export default async function FeaturePage({ params }: FeaturePageProps) {
  const feature = await getFeatureBySlug(params.slug)
  
  if (!feature) {
    notFound()
  }

  // Get support data for all agents for this feature
  const featureSupport = await getFeatureSupport(feature.id)

  // Get related features (same category, excluding current)
  const allFeatures = await getAllFeatures()
  const relatedFeatures = allFeatures
    .filter(f => f.id !== feature.id && f.category === feature.category)
    .slice(0, 3)
  const otherFeatures = allFeatures
    .filter(f => f.id !== feature.id && !relatedFeatures.includes(f))
    .slice(0, 3).sort(() => Math.random() - 0.5)

  // Extract any additional data that might be in the feature object
  const featureExtended = feature as any

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto">
        <FeatureBreadcrumb featureName={feature.name} />
        
        <FeatureHeader feature={feature} />
        
        <FeatureOverview 
          overview={featureExtended.overview}
          importance={featureExtended.importance}
          useCases={featureExtended.use_cases}
        />

        <AgentSupportMatrix supports={featureSupport} />

        {/* FAQ Section if available */}
        {featureExtended.faq && featureExtended.faq.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {featureExtended.faq.map((item: any, index: number) => (
                <details 
                  key={index}
                  className="group bg-gray-800/30 rounded-lg overflow-hidden"
                >
                  <summary className="p-4 cursor-pointer hover:bg-gray-800/50 transition-colors flex items-center justify-between">
                    <span className="font-medium">{item.question}</span>
                    <span className="text-gray-400 ml-2 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-300">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        <FeatureCTA 
          currentFeature={feature} 
          relatedFeatures={[...relatedFeatures, ...otherFeatures]}
        />
      </div>
    </PageContainer>
  )
} 