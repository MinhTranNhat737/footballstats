// Simple in-memory cache for API responses
interface CacheItem {
  data: any
  timestamp: number
  expireIn: number
}

class SimpleCache {
  private cache = new Map<string, CacheItem>()

  set(key: string, data: any, expireInSeconds: number = 300) {
    const now = Date.now()
    this.cache.set(key, {
      data,
      timestamp: now,
      expireIn: expireInSeconds * 1000
    })
  }

  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null

    const now = Date.now()
    if (now - item.timestamp > item.expireIn) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear() {
    this.cache.clear()
  }

  size() {
    return this.cache.size
  }
}

export const apiCache = new SimpleCache()