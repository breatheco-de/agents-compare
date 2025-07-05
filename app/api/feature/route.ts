import { NextResponse } from 'next/server'
import { getAllFeaturesWithStats, getFeatureCategories } from '@/lib/data-loader'

export async function GET() {
  try {
    const [featuresWithStats, categories] = await Promise.all([
      getAllFeaturesWithStats(),
      getFeatureCategories()
    ])

    // Transform the data to a cleaner API format
    const features = featuresWithStats.map(({ feature, supportStats }) => ({
      id: feature.id,
      name: feature.name,
      description: feature.description,
      category: feature.category,
      support: {
        totalAgents: supportStats.totalAgents,
        supported: supportStats.supportedCount,
        partial: supportStats.partialCount,
        notSupported: supportStats.notSupportedCount,
        unknown: supportStats.unknownCount,
        percentage: Math.round((supportStats.supportedCount / supportStats.totalAgents) * 100)
      }
    }))

    const response = {
      totalFeatures: features.length,
      categories: categories,
      features: features,
      generated: new Date().toISOString()
    }

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  } catch (error) {
    console.error('Error loading features:', error)
    return NextResponse.json(
      { error: 'Failed to load features' },
      { status: 500 }
    )
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
} 