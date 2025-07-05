import { NextResponse } from 'next/server';
import { loadComparisonMatrix } from '@/lib/comparison-loader';

export async function GET() {
  try {
    const data = await loadComparisonMatrix();
    
    return NextResponse.json({
      data,
      status: 'success'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error loading comparison data:', error);
    return NextResponse.json({
      data: null,
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to load comparison data'
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
} 