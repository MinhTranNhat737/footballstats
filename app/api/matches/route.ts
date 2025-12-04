import { NextRequest, NextResponse } from 'next/server'

const API_TOKEN = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || "3b243d728ed549a3b8dedfa5424f3304"
const BASE_URL = 'https://api.football-data.org/v4'

// Rate limiting in memory (simple implementation)
let lastRequestTime = 0
const RATE_LIMIT_MS = 6000 // 10 requests per minute = 6 seconds per request

async function waitForRateLimit() {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest < RATE_LIMIT_MS) {
    const waitTime = RATE_LIMIT_MS - timeSinceLastRequest
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }
  
  lastRequestTime = Date.now()
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const competitions = searchParams.get('competitions')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const status = searchParams.get('status')

    if (!API_TOKEN) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    await waitForRateLimit()

    const url = new URL(`${BASE_URL}/matches`)
    if (competitions) url.searchParams.append('competitions', competitions)
    if (dateFrom) url.searchParams.append('dateFrom', dateFrom)
    if (dateTo) url.searchParams.append('dateTo', dateTo)
    if (status) url.searchParams.append('status', status)

    const response = await fetch(url.toString(), {
      headers: {
        'X-Auth-Token': API_TOKEN,
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