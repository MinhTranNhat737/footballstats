import type {
  Match,
  Competition,
  Team,
  Standing,
  TopScorer,
  MatchesResponse,
  CompetitionsResponse,
  TeamsResponse,
  StandingsResponse,
  TopScorersResponse,
  MatchFilters,
  CompetitionMatchFilters,
  TeamMatchFilters,
} from "@/types/match"

// Rate limiting helper
class RateLimiter {
  private requests: number[] = []
  private readonly maxRequests: number
  private readonly timeWindow: number

  constructor(maxRequests: number = 10, timeWindowMs: number = 60000) {
    this.maxRequests = maxRequests
    this.timeWindow = timeWindowMs
  }

  async waitIfNeeded(): Promise<void> {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.timeWindow)

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests)
      const waitTime = this.timeWindow - (now - oldestRequest)
      if (waitTime > 0) {
        console.log(`Rate limit reached. Waiting ${waitTime}ms...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }

    this.requests.push(now)
  }
}

export class FootballDataAPI {
  private readonly baseUrl: string
  private readonly rateLimiter: RateLimiter
  private readonly apiKey: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || ''
    this.baseUrl = 'https://api.football-data.org/v4'
    
    const rateLimit = parseInt(process.env.NEXT_PUBLIC_API_RATE_LIMIT || "10")
    this.rateLimiter = new RateLimiter(rateLimit)
    
    console.log('FootballDataAPI initialized:', {
      hasApiKey: !!this.apiKey,
      baseUrl: this.baseUrl
    })
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    await this.rateLimiter.waitIfNeeded()

    // Build URL with query parameters
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })
    
    const queryString = searchParams.toString()
    const url = `${this.baseUrl}${endpoint}${queryString ? `?${queryString}` : ''}`

    try {
      console.log(`Making real API request to: ${url}`)
      
      // Add timeout and better error handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout
      
      const response = await fetch(url, {
        signal: controller.signal,
        method: 'GET',
        headers: {
          'X-Auth-Token': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        console.warn(`API request failed with status ${response.status}: ${response.statusText}`)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`Real API request successful for: ${endpoint}`)
      
      return data
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error(`API request timed out for: ${endpoint}`)
        } else {
          console.error(`Real API request failed for: ${endpoint}`, error.message)
        }
      } else {
        console.error(`Unknown error for: ${endpoint}`, error)
      }
      return this.getEmptyResponse<T>(endpoint)
    }
  }

  private getEmptyResponse<T>(endpoint: string): T {
    console.log(`Returning empty response for: ${endpoint}`)
    // Return appropriate empty structure based on endpoint
    if (endpoint.includes('matches')) {
      return {
        matches: [],
        resultSet: {
          count: 0,
          first: '2025-11-28',
          last: '2025-11-28',
          played: 0
        }
      } as T
    } else if (endpoint.includes('competitions')) {
      return { 
        competitions: [],
        count: 0
      } as T
    } else if (endpoint.includes('teams')) {
      return { 
        teams: [],
        count: 0
      } as T
    } else if (endpoint.includes('standings')) {
      return { 
        standings: [],
        competition: {},
        season: {}
      } as T
    } else if (endpoint.includes('scorers')) {
      return { 
        scorers: [],
        count: 0,
        competition: {},
        season: {}
      } as T
    }
    
    return {} as T
  }

  // Competitions API
  async getCompetitions(areaIds?: string): Promise<Competition[]> {
    const params = areaIds ? { areas: areaIds } : {}
    const response = await this.makeRequest<CompetitionsResponse>("/competitions", params)
    return response.competitions || []
  }

  async getCompetition(id: string): Promise<Competition> {
    return this.makeRequest<Competition>(`/competitions/${id}`)
  }

  // Matches API
  async getMatches(filters: MatchFilters = {}): Promise<Match[]> {
    const response = await this.makeRequest<MatchesResponse>("/matches", filters)
    return response.matches || []
  }

  async getMatch(id: number): Promise<Match> {
    return this.makeRequest<Match>(`/matches/${id}`)
  }

  async getTodaysMatches(): Promise<Match[]> {
    const today = new Date().toISOString().split('T')[0]
    const response = await this.makeRequest<MatchesResponse>("/matches", {
      dateFrom: today,
      dateTo: today
    })
    return response.matches || []
  }

  async getLiveMatches(): Promise<Match[]> {
    const response = await this.makeRequest<MatchesResponse>("/matches", {
      status: "IN_PLAY"
    })
    return response.matches || []
  }

  async getUpcomingMatches(days: number = 7): Promise<Match[]> {
    const today = new Date()
    const future = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000))
    
    const response = await this.makeRequest<MatchesResponse>("/matches", {
      dateFrom: today.toISOString().split('T')[0],
      dateTo: future.toISOString().split('T')[0],
      status: "SCHEDULED"
    })
    return response.matches || []
  }

  async getRecentMatches(days: number = 7): Promise<Match[]> {
    const today = new Date()
    const past = new Date(today.getTime() - (days * 24 * 60 * 60 * 1000))
    
    const response = await this.makeRequest<MatchesResponse>("/matches", {
      dateFrom: past.toISOString().split('T')[0],
      dateTo: today.toISOString().split('T')[0],
      status: "FINISHED"
    })
    return response.matches || []
  }

  async getCompetitionMatches(
    competitionId: string,
    filters: CompetitionMatchFilters = {}
  ): Promise<Match[]> {
    const response = await this.makeRequest<MatchesResponse>(`/competitions/${competitionId}/matches`, filters)
    return response.matches || []
  }

  async getTeamMatches(
    teamId: number,
    filters: TeamMatchFilters = {}
  ): Promise<Match[]> {
    const response = await this.makeRequest<MatchesResponse>(`/teams/${teamId}/matches`, filters)
    return response.matches || []
  }

  async getMatchHead2Head(matchId: number, limit?: number): Promise<Match[]> {
    const params = limit ? { limit } : {}
    const response = await this.makeRequest<MatchesResponse>(`/matches/${matchId}/head2head`, params)
    return response.matches || []
  }

  // Teams API
  async getTeams(limit?: number, offset?: number): Promise<Team[]> {
    const params: any = {}
    if (limit) params.limit = limit
    if (offset) params.offset = offset
    
    const response = await this.makeRequest<TeamsResponse>("/teams", params)
    return response.teams || []
  }

  async getTeam(id: number): Promise<Team> {
    return this.makeRequest<Team>(`/teams/${id}`)
  }

  async getCompetitionTeams(competitionId: string, season?: string): Promise<Team[]> {
    const params = season ? { season } : {}
    const response = await this.makeRequest<TeamsResponse>(`/competitions/${competitionId}/teams`, params)
    return response.teams || []
  }

  // Standings API
  async getStandings(
    competitionId: string,
    matchday?: number,
    season?: string
  ): Promise<Standing[]> {
    const params: any = {}
    if (matchday) params.matchday = matchday
    if (season) params.season = season
    
    const response = await this.makeRequest<StandingsResponse>(`/competitions/${competitionId}/standings`, params)
    return response.standings || []
  }

  // Top Scorers API
  async getTopScorers(
    competitionId: string,
    limit?: number,
    season?: string
  ): Promise<TopScorer[]> {
    const params: any = {}
    if (limit) params.limit = limit
    if (season) params.season = season
    
    const response = await this.makeRequest<TopScorersResponse>(`/competitions/${competitionId}/scorers`, params)
    return response.scorers || []
  }
}

// Competition IDs for easy reference
export const COMPETITION_IDS = {
  PREMIER_LEAGUE: "2021",
  CHAMPIONS_LEAGUE: "2001", 
  LA_LIGA: "2014",
  BUNDESLIGA: "2002",
  SERIE_A: "2019",
  LIGUE_1: "2015",
  WORLD_CUP: "2000",
  EUROS: "2018",
  COPA_AMERICA: "2013",
  FA_CUP: "2048",
  COPA_DEL_REY: "2017",
  DFB_POKAL: "2003",
  COPPA_ITALIA: "2020",
  COUPE_DE_FRANCE: "2016"
}

// Export singleton instance
export const footballApi = new FootballDataAPI()
export default footballApi