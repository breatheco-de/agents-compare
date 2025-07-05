import { NextRequest, NextResponse } from 'next/server'
import { getFeatureBySlug, getFeatureSupport } from '@/lib/data-loader'

interface RouteParams {
  params: {
    slug: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const feature = await getFeatureBySlug(params.slug)
    
    if (!feature) {
      return NextResponse.json(
        {
          data: null,
          status: 'error',
          message: `Feature not found: ${params.slug}`
        },
        { status: 404 }
      )
    }

    // Get support data for all agents for this feature
    const agentSupport = await getFeatureSupport(feature.id)
    
    // Transform the support data for the API response
    const supportMatrix = agentSupport.map(support => ({
      agent: {
        id: support.agent.id,
        name: support.agent.name,
        provider: support.agent.provider
      },
      support_level: support.level,
      notes: support.notes,
      examples: support.examples,
      links: support.links
    }))

    const responseData = {
      data: {
        feature: feature,
        agent_support: supportMatrix,
        metadata: {
          total_agents: supportMatrix.length,
          support_summary: {
            yes: supportMatrix.filter(s => s.support_level === 'yes').length,
            partial: supportMatrix.filter(s => s.support_level === 'partial').length,
            no: supportMatrix.filter(s => s.support_level === 'no').length,
            unknown: supportMatrix.filter(s => s.support_level === 'unknown').length
          }
        }
      },
      status: 'success' as const
    }

    return NextResponse.json(responseData, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
      }
    })
  } catch (error) {
    console.error('Error in feature API route:', error)
    return NextResponse.json(
      {
        data: null,
        status: 'error',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 