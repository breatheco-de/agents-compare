import { NextResponse } from 'next/server'
import { getAllAgentsWithStats, getAgentProviders, getSupportedIDEs } from '@/lib/data-loader'

export async function GET() {
  try {
    // Load all agents with statistics
    const [agentsWithStats, providers, supportedIDEs] = await Promise.all([
      getAllAgentsWithStats(),
      getAgentProviders(),
      getSupportedIDEs()
    ])

    // Calculate aggregate statistics
    const totalAgents = agentsWithStats.length
    const averageSupportPercentage = Math.round(
      agentsWithStats.reduce((sum, { supportStats }) => sum + supportStats.supportPercentage, 0) / totalAgents
    )
    
    const totalFeatures = agentsWithStats[0]?.supportStats.totalFeatures || 0
    const lastUpdated = new Date().toISOString()

    // Return the complete agents index data
    return NextResponse.json(
      {
        data: {
          agents: agentsWithStats,
          providers,
          supportedIDEs,
          statistics: {
            totalAgents,
            totalProviders: providers.length,
            totalFeatures,
            averageSupportPercentage,
            lastUpdated
          }
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
    console.error('Error loading agents index:', error)
    return NextResponse.json(
      {
        data: null,
        status: 'error',
        message: 'Failed to load agents index'
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