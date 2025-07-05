import { NextResponse } from 'next/server'
import { loadAgent, loadAgentFeatureSupport, loadIndex } from '@/lib/data-loader'
import type { Agent, AgentFeatureSupport } from '@/types'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const normalizedSlug = params.slug.toLowerCase().trim()
    
    // Try to load the agent
    let agent: Agent
    let supportMatrix: AgentFeatureSupport[]
    
    try {
      agent = await loadAgent(normalizedSlug)
      supportMatrix = await loadAgentFeatureSupport(agent.id)
    } catch (error) {
      // If direct loading fails, try to find agent by checking all agents
      const index = await loadIndex()
      const matchingAgentId = index.agents.find(id => id.toLowerCase() === normalizedSlug)
      
      if (!matchingAgentId) {
        return NextResponse.json(
          {
            data: null,
            status: 'error',
            message: 'Agent not found'
          },
          { 
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET',
              'Access-Control-Allow-Headers': 'Content-Type'
            }
          }
        )
      }
      
      agent = await loadAgent(matchingAgentId)
      supportMatrix = await loadAgentFeatureSupport(matchingAgentId)
    }
    
    // Return the agent data with support matrix
    return NextResponse.json(
      {
        data: {
          agent,
          supportMatrix
        },
        status: 'success'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
      }
    )
  } catch (error) {
    console.error('Error in agent API route:', error)
    return NextResponse.json(
      {
        data: null,
        status: 'error',
        message: 'Internal server error'
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    )
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
} 