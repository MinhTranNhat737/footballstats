import { NextRequest, NextResponse } from 'next/server'
import { apiCache } from '@/lib/cache'

const API_TOKEN = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || "3b243d728ed549a3b8dedfa5424f3304"
const BASE_URL = "https://api.football-data.org/v4"

// Rate limiting tracking - optimized for better performance
let requestCount = 0
let windowStart = Date.now()
const RATE_LIMIT = 15 // 15 requests per minute (increased from 10)
const WINDOW_SIZE = 60 * 1000 // 1 minute

function checkRateLimit(): boolean {
  const now = Date.now()
  
  // Reset window if it's been more than a minute
  if (now - windowStart > WINDOW_SIZE) {
    requestCount = 0
    windowStart = now
  }
  
  return requestCount < RATE_LIMIT
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Build endpoint with query parameters
  let endpoint = searchParams.get('endpoint') || '/matches'
  const status = searchParams.get('status')
  const dateFrom = searchParams.get('dateFrom')
  const dateTo = searchParams.get('dateTo')
  const competitions = searchParams.get('competitions')
  const limit = searchParams.get('limit')
  
  // Add query parameters to endpoint
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  if (dateFrom) params.append('dateFrom', dateFrom)
  if (dateTo) params.append('dateTo', dateTo)
  if (competitions) params.append('competitions', competitions)
  if (limit) params.append('limit', limit)
  
  if (params.toString()) {
    endpoint += (endpoint.includes('?') ? '&' : '?') + params.toString()
  }
  
  const fullUrl = `${BASE_URL}${endpoint}`
  const cacheKey = fullUrl
  
  // Check cache first
  const cachedData = apiCache.get(cacheKey)
  if (cachedData) {
    console.log('📦 Cache hit for:', endpoint)
    return NextResponse.json(cachedData)
  }
  
  // Check rate limit
  if (!checkRateLimit()) {
    console.warn('⚠️ Rate limit exceeded, returning cached data or error')
    
    // Try to return any cached data (even if expired) as fallback
    const expiredCache = apiCache.get(cacheKey)
    if (expiredCache) {
      console.log('📦 Using expired cache due to rate limit')
      return NextResponse.json(expiredCache)
    }
    
    return NextResponse.json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please wait before trying again.',
      errorCode: 429
    }, { status: 200 })
  }
  
  try {
    requestCount++ // Increment request counter
    console.log(`🚀 Fetching: ${fullUrl} (Request ${requestCount}/${RATE_LIMIT})`)
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'X-Auth-Token': API_TOKEN,
        'Content-Type': 'application/json',
      },
      timeout: 10000 // 10 second timeout
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('❌ Football API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: fullUrl,
        data: data
      })
      
      // For rate limit errors, cache the error briefly
      if (response.status === 429) {
        console.log('⚠️ Rate limit hit from API, caching error response')
        const errorResponse = {
          error: 'Quá nhiều yêu cầu API',
          errorCode: 429,
          message: 'API đã đạt giới hạn. Vui lòng thử lại sau.',
          matches: [] // Provide empty array to prevent crashes
        }
        apiCache.set(cacheKey, errorResponse, 30 * 1000) // Cache error for 30 seconds
        return NextResponse.json(errorResponse)
      }
      
      // Return specific error info for debugging but with data structure intact
      const errorResponse = {
        error: data.message || `API Error: ${response.status}`,
        status: response.status,
        details: data,
        errorCode: data.errorCode || response.status,
        message: response.status === 400 ? 'Yêu cầu không hợp lệ - Kiểm tra endpoint hoặc token' :
                response.status === 403 ? 'Token API không hợp lệ hoặc hết hạn' :
                response.status === 404 ? 'Endpoint không tồn tại' :
                response.status === 429 ? 'Quá nhiều yêu cầu API' : 
                'Lỗi API không xác định',
        matches: [] // Provide empty array to prevent crashes
      }
      
      return NextResponse.json(errorResponse)
    }

    // Validate response structure
    if (!data || typeof data !== 'object') {
      console.error('❌ Invalid API response structure:', data)
      return NextResponse.json({
        error: 'Cấu trúc dữ liệu API không hợp lệ',
        matches: []
      })
    }

    // Cache successful responses with optimized durations
    const cacheTime = endpoint.includes('status=IN_PLAY') ? 60 * 1000 : // Live matches: 60 seconds
                     endpoint.includes('/standings') || endpoint.includes('/scorers') ? 20 * 60 * 1000 : // Standings: 20 minutes
                     endpoint.includes('dateFrom') && endpoint.includes('dateTo') ? 10 * 60 * 1000 : // Date range: 10 minutes
                     5 * 60 * 1000 // Default: 5 minutes
    
    apiCache.set(cacheKey, data, cacheTime)
    console.log(`✅ API Success: ${response.status}, Data cached for ${cacheTime/1000}s, Count: ${data.matches?.length || data.competitions?.length || data.standings?.length || 0}`)
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Server Error:', error)
    
    const errorResponse = {
      error: 'Lỗi kết nối server',
      details: error instanceof Error ? error.message : 'Lỗi không xác định',
      message: 'Không thể kết nối đến API hoặc lỗi mạng',
      matches: [] // Provide empty array to prevent crashes
    }
    
    return NextResponse.json(errorResponse)
  }
}