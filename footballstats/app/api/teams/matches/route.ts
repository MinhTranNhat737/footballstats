import { NextRequest, NextResponse } from 'next/server';
import { apiCache } from '@/lib/cache';

const API_TOKEN = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || "3b243d728ed549a3b8dedfa5424f3304"
const BASE_URL = "https://api.football-data.org/v4"

// Rate limiting
let requestCount = 0
let windowStart = Date.now()
const RATE_LIMIT = 15
const WINDOW_SIZE = 60 * 1000

function checkRateLimit(): boolean {
  const now = Date.now()
  if (now - windowStart > WINDOW_SIZE) {
    requestCount = 0
    windowStart = now
  }
  return requestCount < RATE_LIMIT
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('teamId')
    const status = searchParams.get('status') || 'ALL' // ALL, SCHEDULED, LIVE, FINISHED
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const limit = searchParams.get('limit') || '50'

    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      )
    }

    // Build cache key
    const params = { teamId, status, dateFrom, dateTo, limit }
    const cacheKey = `team_matches_${Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&')}`

    // Check cache
    const cachedData = apiCache.get(cacheKey)
    if (cachedData) {
      console.log(`📦 Cache hit for team ${teamId} matches`)
      return NextResponse.json(cachedData)
    }

    // Check rate limit
    if (!checkRateLimit()) {
      const fallbackData = getMockTeamMatches(parseInt(teamId), { status, dateFrom, dateTo })
      console.log(`⚠️ Rate limit exceeded, using mock data for team ${teamId}`)
      return NextResponse.json(fallbackData)
    }

    try {
      requestCount++
      
      // Build API URL
      let apiUrl = `${BASE_URL}/teams/${teamId}/matches`
      const queryParams = new URLSearchParams()
      
      if (status && status !== 'ALL') queryParams.append('status', status)
      if (dateFrom) queryParams.append('dateFrom', dateFrom)
      if (dateTo) queryParams.append('dateTo', dateTo)
      if (limit) queryParams.append('limit', limit)
      
      if (queryParams.toString()) {
        apiUrl += `?${queryParams.toString()}`
      }

      console.log(`🚀 Fetching team matches: ${apiUrl}`)

      const response = await fetch(apiUrl, {
        headers: {
          'X-Auth-Token': API_TOKEN,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        console.error(`❌ API Error for team ${teamId}:`, response.status, response.statusText)
        
        // Return mock data on API error
        const mockData = getMockTeamMatches(parseInt(teamId), { status, dateFrom, dateTo })
        apiCache.set(cacheKey, mockData, 5 * 60 * 1000) // Cache for 5 minutes
        return NextResponse.json(mockData)
      }

      const data = await response.json()
      
      // Cache successful response
      const cacheTime = status === 'LIVE' ? 60 * 1000 : 10 * 60 * 1000
      apiCache.set(cacheKey, data, cacheTime)
      
      console.log(`✅ Team ${teamId} matches fetched: ${data.matches?.length || 0} matches`)
      return NextResponse.json(data)
      
    } catch (apiError) {
      console.error(`❌ API fetch error for team ${teamId}:`, apiError)
      
      // Fallback to mock data
      const mockData = getMockTeamMatches(parseInt(teamId), { status, dateFrom, dateTo })
      apiCache.set(cacheKey, mockData, 2 * 60 * 1000) // Cache for 2 minutes
      return NextResponse.json(mockData)
    }

  } catch (error) {
    console.error('❌ Server error in team matches API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        matches: [],
        message: 'Unable to fetch team matches'
      },
      { status: 500 }
    )
  }
}

// Mock data generator với filtering options
function getMockTeamMatches(teamId: number, options: { status?: string, dateFrom?: string, dateTo?: string } = {}) {
  const teamInfo = getTeamInfo(teamId);
  if (!teamInfo) {
    return { count: 0, matches: [] };
  }

  // Get realistic opponents based on team's league
  const opponents = getRealisticOpponents(teamId, teamInfo.league);
  const competition = getCompetitionByLeague(teamInfo.league);

  const generateMatches = () => {
    const matches = [];
    
    // Recent finished matches
    for (let i = 0; i < 3; i++) {
      const daysAgo = Math.floor(Math.random() * 30) + 7; // 7-37 days ago
      const matchDate = new Date();
      matchDate.setDate(matchDate.getDate() - daysAgo);
      
      const opponent = opponents[Math.floor(Math.random() * opponents.length)];
      const isHome = Math.random() > 0.5;
      const homeScore = Math.floor(Math.random() * 4);
      const awayScore = Math.floor(Math.random() * 4);
      
      matches.push({
        id: Math.floor(Math.random() * 1000000),
        utcDate: matchDate.toISOString(),
        status: 'FINISHED',
        homeTeam: isHome ? teamInfo : opponent,
        awayTeam: isHome ? opponent : teamInfo,
        score: { fullTime: { home: homeScore, away: awayScore } },
        competition: competition
      });
    }

    // Today's match (if any)
    if (Math.random() > 0.7) {
      const today = new Date();
      today.setHours(Math.floor(Math.random() * 8) + 12, Math.floor(Math.random() * 60), 0, 0); // 12:00-20:00
      
      const opponent = opponents[Math.floor(Math.random() * opponents.length)];
      const isHome = Math.random() > 0.5;
      
      matches.push({
        id: Math.floor(Math.random() * 1000000),
        utcDate: today.toISOString(),
        status: Math.random() > 0.8 ? 'IN_PLAY' : 'SCHEDULED',
        homeTeam: isHome ? teamInfo : opponent,
        awayTeam: isHome ? opponent : teamInfo,
        score: { fullTime: { home: null, away: null } },
        competition: competition
      });
    }

    // Upcoming matches
    for (let i = 0; i < 4; i++) {
      const daysAhead = Math.floor(Math.random() * 45) + 3; // 3-48 days ahead
      const matchDate = new Date();
      matchDate.setDate(matchDate.getDate() + daysAhead);
      matchDate.setHours(Math.floor(Math.random() * 8) + 12, Math.floor(Math.random() * 60), 0, 0);
      
      const opponent = opponents[Math.floor(Math.random() * opponents.length)];
      const isHome = Math.random() > 0.5;
      const comp = Math.random() > 0.8 ? getCupCompetition() : competition;
      
      matches.push({
        id: Math.floor(Math.random() * 1000000),
        utcDate: matchDate.toISOString(),
        status: 'SCHEDULED',
        homeTeam: isHome ? teamInfo : opponent,
        awayTeam: isHome ? opponent : teamInfo,
        score: { fullTime: { home: null, away: null } },
        competition: comp
      });
    }

    return matches.sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime());
  };

  let filteredMatches = generateMatches();

  // Apply status filtering
  if (options.status && options.status !== 'ALL') {
    filteredMatches = filteredMatches.filter(match => match.status === options.status);
  }

  // Apply date filtering
  if (options.dateFrom) {
    const fromDate = new Date(options.dateFrom);
    filteredMatches = filteredMatches.filter(match => new Date(match.utcDate) >= fromDate);
  }
  
  if (options.dateTo) {
    const toDate = new Date(options.dateTo);
    filteredMatches = filteredMatches.filter(match => new Date(match.utcDate) <= toDate);
  }

  return {
    count: filteredMatches.length,
    matches: filteredMatches
  };
}

// Get realistic opponents based on team's league
function getRealisticOpponents(teamId: number, league: string) {
  const leagueTeams: Record<string, any[]> = {
    'Premier League': [
      { id: 1057, name: 'Leicester City FC', crest: 'https://crests.football-data.org/1057.png' },
      { id: 354, name: 'Crystal Palace FC', crest: 'https://crests.football-data.org/354.png' },
      { id: 397, name: 'Brighton & Hove Albion FC', crest: 'https://crests.football-data.org/397.png' },
      { id: 402, name: 'Brentford FC', crest: 'https://crests.football-data.org/402.png' },
      { id: 328, name: 'Burnley FC', crest: 'https://crests.football-data.org/328.png' }
    ],
    'La Liga': [
      { id: 77, name: 'Athletic Club', crest: 'https://crests.football-data.org/77.png' },
      { id: 94, name: 'Villarreal CF', crest: 'https://crests.football-data.org/94.png' },
      { id: 95, name: 'Valencia CF', crest: 'https://crests.football-data.org/95.png' },
      { id: 558, name: 'FC Sevilla', crest: 'https://crests.football-data.org/558.png' },
      { id: 92, name: 'Real Betis Balompié', crest: 'https://crests.football-data.org/92.png' }
    ],
    'Bundesliga': [
      { id: 15, name: 'Mainz 05', crest: 'https://crests.football-data.org/15.png' },
      { id: 17, name: 'SC Freiburg', crest: 'https://crests.football-data.org/17.png' },
      { id: 19, name: 'Eintracht Frankfurt', crest: 'https://crests.football-data.org/19.png' },
      { id: 4, name: 'VfL Wolfsburg', crest: 'https://crests.football-data.org/4.png' },
      { id: 721, name: 'RB Leipzig', crest: 'https://crests.football-data.org/721.png' }
    ],
    'Serie A': [
      { id: 99, name: 'Fiorentina', crest: 'https://crests.football-data.org/99.png' },
      { id: 102, name: 'Atalanta BC', crest: 'https://crests.football-data.org/102.png' },
      { id: 110, name: 'Lazio', crest: 'https://crests.football-data.org/110.png' },
      { id: 488, name: 'Spezia Calcio', crest: 'https://crests.football-data.org/488.png' },
      { id: 115, name: 'Udinese Calcio', crest: 'https://crests.football-data.org/115.png' }
    ],
    'Ligue 1': [
      { id: 518, name: 'Montpellier HSC', crest: 'https://crests.football-data.org/518.png' },
      { id: 522, name: 'OGC Nice', crest: 'https://crests.football-data.org/522.png' },
      { id: 512, name: 'Stade Rennais FC', crest: 'https://crests.football-data.org/512.png' },
      { id: 514, name: 'RC Lens', crest: 'https://crests.football-data.org/514.png' },
      { id: 1871, name: 'LOSC Lille', crest: 'https://crests.football-data.org/1871.png' }
    ]
  };

  return leagueTeams[league] || leagueTeams['Premier League'];
}

// Get competition info by league
function getCompetitionByLeague(league: string) {
  const competitions: Record<string, any> = {
    'Premier League': { name: 'Premier League', emblem: 'https://crests.football-data.org/PL.png' },
    'La Liga': { name: 'La Liga', emblem: 'https://crests.football-data.org/PD.png' },
    'Bundesliga': { name: 'Bundesliga', emblem: 'https://crests.football-data.org/BL1.png' },
    'Serie A': { name: 'Serie A', emblem: 'https://crests.football-data.org/SA.png' },
    'Ligue 1': { name: 'Ligue 1', emblem: 'https://crests.football-data.org/FL1.png' },
    'Eredivisie': { name: 'Eredivisie', emblem: 'https://crests.football-data.org/DED.png' },
    'Primeira Liga': { name: 'Primeira Liga', emblem: 'https://crests.football-data.org/PPL.png' }
  };

  return competitions[league] || competitions['Premier League'];
}

// Get cup competitions
function getCupCompetition() {
  const cups = [
    { name: 'UEFA Champions League', emblem: 'https://crests.football-data.org/CL.png' },
    { name: 'UEFA Europa League', emblem: 'https://crests.football-data.org/EL.png' },
    { name: 'FA Cup', emblem: 'https://crests.football-data.org/FAC.png' },
    { name: 'Copa del Rey', emblem: 'https://crests.football-data.org/CDR.png' },
    { name: 'DFB-Pokal', emblem: 'https://crests.football-data.org/DFB.png' }
  ];

  return cups[Math.floor(Math.random() * cups.length)];
}

function getTeamInfo(teamId: number) {
  const teams: Record<number, any> = {
    // Premier League
    57: { id: 57, name: 'Arsenal FC', shortName: 'Arsenal', crest: 'https://crests.football-data.org/57.png', league: 'Premier League' },
    61: { id: 61, name: 'Chelsea FC', shortName: 'Chelsea', crest: 'https://crests.football-data.org/61.png', league: 'Premier League' },
    64: { id: 64, name: 'Liverpool FC', shortName: 'Liverpool', crest: 'https://crests.football-data.org/64.png', league: 'Premier League' },
    65: { id: 65, name: 'Manchester City FC', shortName: 'Man City', crest: 'https://crests.football-data.org/65.png', league: 'Premier League' },
    66: { id: 66, name: 'Manchester United FC', shortName: 'Man United', crest: 'https://crests.football-data.org/66.png', league: 'Premier League' },
    73: { id: 73, name: 'Tottenham Hotspur FC', shortName: 'Tottenham', crest: 'https://crests.football-data.org/73.png', league: 'Premier League' },
    563: { id: 563, name: 'West Ham United FC', shortName: 'West Ham', crest: 'https://crests.football-data.org/563.png', league: 'Premier League' },
    67: { id: 67, name: 'Newcastle United FC', shortName: 'Newcastle', crest: 'https://crests.football-data.org/67.png', league: 'Premier League' },

    // La Liga
    86: { id: 86, name: 'Real Madrid CF', shortName: 'Real Madrid', crest: 'https://crests.football-data.org/86.png', league: 'La Liga' },
    81: { id: 81, name: 'FC Barcelona', shortName: 'Barcelona', crest: 'https://crests.football-data.org/81.png', league: 'La Liga' },
    78: { id: 78, name: 'Atlético de Madrid', shortName: 'Atlético', crest: 'https://crests.football-data.org/78.png', league: 'La Liga' },
    90: { id: 90, name: 'Real Sociedad', shortName: 'Real Sociedad', crest: 'https://crests.football-data.org/90.png', league: 'La Liga' },

    // Bundesliga
    5: { id: 5, name: 'FC Bayern München', shortName: 'Bayern Munich', crest: 'https://crests.football-data.org/5.png', league: 'Bundesliga' },
    11: { id: 11, name: 'Borussia Dortmund', shortName: 'Dortmund', crest: 'https://crests.football-data.org/11.png', league: 'Bundesliga' },
    18: { id: 18, name: 'Bayer 04 Leverkusen', shortName: 'Bayer Leverkusen', crest: 'https://crests.football-data.org/18.png', league: 'Bundesliga' },
    16: { id: 16, name: 'RB Leipzig', shortName: 'Leipzig', crest: 'https://crests.football-data.org/721.png', league: 'Bundesliga' },

    // Serie A
    496: { id: 496, name: 'Juventus FC', shortName: 'Juventus', crest: 'https://crests.football-data.org/496.png', league: 'Serie A' },
    98: { id: 98, name: 'AC Milan', shortName: 'Milan', crest: 'https://crests.football-data.org/98.png', league: 'Serie A' },
    108: { id: 108, name: 'FC Internazionale Milano', shortName: 'Inter Milan', crest: 'https://crests.football-data.org/108.png', league: 'Serie A' },
    113: { id: 113, name: 'SSC Napoli', shortName: 'Napoli', crest: 'https://crests.football-data.org/113.png', league: 'Serie A' },
    109: { id: 109, name: 'AS Roma', shortName: 'Roma', crest: 'https://crests.football-data.org/109.png', league: 'Serie A' },

    // Ligue 1
    524: { id: 524, name: 'Paris Saint-Germain FC', shortName: 'PSG', crest: 'https://crests.football-data.org/524.png', league: 'Ligue 1' },
    516: { id: 516, name: 'Olympique de Marseille', shortName: 'Marseille', crest: 'https://crests.football-data.org/516.png', league: 'Ligue 1' },
    523: { id: 523, name: 'Olympique Lyonnais', shortName: 'Lyon', crest: 'https://crests.football-data.org/523.png', league: 'Ligue 1' },
    521: { id: 521, name: 'AS Monaco FC', shortName: 'Monaco', crest: 'https://crests.football-data.org/521.png', league: 'Ligue 1' },

    // Eredivisie
    678: { id: 678, name: 'AFC Ajax', shortName: 'Ajax', crest: 'https://crests.football-data.org/678.png', league: 'Eredivisie' },
    674: { id: 674, name: 'PSV', shortName: 'PSV Eindhoven', crest: 'https://crests.football-data.org/674.png', league: 'Eredivisie' },

    // Primeira Liga
    503: { id: 503, name: 'FC Porto', shortName: 'Porto', crest: 'https://crests.football-data.org/503.png', league: 'Primeira Liga' },
    498: { id: 498, name: 'SL Benfica', shortName: 'Benfica', crest: 'https://crests.football-data.org/498.png', league: 'Primeira Liga' },
    559: { id: 559, name: 'Sporting CP', shortName: 'Sporting', crest: 'https://crests.football-data.org/559.png', league: 'Primeira Liga' }
  };
  
  return teams[teamId] || null;
}