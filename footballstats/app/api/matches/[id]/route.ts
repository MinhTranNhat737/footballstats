import { NextRequest, NextResponse } from 'next/server'
import { apiCache } from '@/lib/cache'

const API_TOKEN = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || "3b243d728ed549a3b8dedfa5424f3304"
const BASE_URL = "https://api.football-data.org/v4"

// Rate limiting
let requestCount = 0
const RATE_LIMIT = 10 // requests per minute
const RATE_WINDOW = 60 * 1000 // 1 minute

async function checkRateLimit() {
  const now = Date.now()
  const windowStart = now - RATE_WINDOW
  
  // Simple rate limiting - reset counter every minute
  if (requestCount === 0 || now % RATE_WINDOW < 1000) {
    requestCount = 0
  }
  
  if (requestCount >= RATE_LIMIT) {
    console.warn('⚠️ Rate limit exceeded, using cache or waiting...')
    return false
  }
  
  requestCount++
  return true
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: matchId } = await params
  
  if (!matchId) {
    return NextResponse.json(
      { error: 'Match ID is required' }, 
      { status: 400 }
    )
  }

  const cacheKey = `/matches/${matchId}`
  
  // Check cache first
  const cached = apiCache.get(cacheKey)
  if (cached) {
    console.log('📦 Cache hit for match details:', matchId)
    return NextResponse.json(cached)
  }

  // Check rate limit
  const canMakeRequest = await checkRateLimit()
  if (!canMakeRequest) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', match: null }, 
      { status: 429 }
    )
  }

  try {
    console.log(`🏈 Fetching match details: ${matchId} (Request ${requestCount}/${RATE_LIMIT})`)
    
    const response = await fetch(
      `${BASE_URL}/matches/${matchId}`, 
      {
        headers: {
          'X-Auth-Token': API_TOKEN,
          'Accept': 'application/json',
        },
        next: { 
          revalidate: false // Don't use Next.js cache, we have our own
        }
      }
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Cache successful response for 5 minutes for live matches, 30 minutes for finished
    const cacheTime = data.match?.status === 'IN_PLAY' ? 5 * 60 : 30 * 60
    apiCache.set(cacheKey, data, cacheTime)
    
    console.log(`✅ API Success: 200, Match details cached for ${cacheTime}s`)
    console.log(`📊 Match: ${data.match?.homeTeam?.name} vs ${data.match?.awayTeam?.name}`)
    console.log(`🥅 Goals: ${data.match?.goals?.length || 0}`)
    console.log(`🟨 Bookings: ${data.match?.bookings?.length || 0}`)
    console.log(`🔄 Substitutions: ${data.match?.substitutions?.length || 0}`)
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Match details API Error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        match: null
      }, 
      { status: 500 }
    )
  }
}