// Shared rate limiter for all API routes
let lastRequestTime = 0
const RATE_LIMIT_MS = 7000 // 7 seconds between requests (8.5 requests/min, under 10/min limit)

export async function waitForRateLimit() {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest < RATE_LIMIT_MS) {
    const waitTime = RATE_LIMIT_MS - timeSinceLastRequest
    console.log(`⏱️ Rate limit: waiting ${waitTime}ms before next API request`)
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }
  
  lastRequestTime = Date.now()
}
