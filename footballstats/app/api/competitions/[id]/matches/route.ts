import { NextRequest, NextResponse } from 'next/server'
import { waitForRateLimit } from '@/lib/rate-limiter'

const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY
const BASE_URL = 'https://api.football-data.org/v4'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const status = searchParams.get('status')
    const stage = searchParams.get('stage')
    const matchday = searchParams.get('matchday')
    const season = searchParams.get('season')

    if (!API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    await waitForRateLimit()

    const url = new URL(`${BASE_URL}/competitions/${id}/matches`)
    if (dateFrom) url.searchParams.append('dateFrom', dateFrom)
    if (dateTo) url.searchParams.append('dateTo', dateTo)
    if (status) url.searchParams.append('status', status)
    if (stage) url.searchParams.append('stage', stage)
    if (matchday) url.searchParams.append('matchday', matchday)
    if (season) url.searchParams.append('season', season)

    const response = await fetch(url.toString(), {
      headers: {
        'X-Auth-Token': API_KEY,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      return NextResponse.json(
        { error: `API Error: ${response.status}` }, 
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}