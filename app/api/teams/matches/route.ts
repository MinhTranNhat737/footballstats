import { NextRequest, NextResponse } from 'next/server';

const FOOTBALL_API_KEY = process.env.FOOTBALL_DATA_API_KEY || 'your-api-key-here';
const BASE_URL = 'https://api.football-data.org/v4';

// Cache lưu trữ kết quả API
const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 phút

interface CacheItem {
  data: any;
  timestamp: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }

    const cacheKey = `team_matches_${teamId}`;
    const cachedItem = cache.get(cacheKey) as CacheItem;

    // Kiểm tra cache
    if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION) {
      console.log(`✅ Cache hit for team ${teamId} matches`);
      return NextResponse.json(cachedItem.data);
    }

    // Mock data cho các đội bóng phổ biến
    const mockTeamMatches = getMockTeamMatches(parseInt(teamId));
    
    if (mockTeamMatches.matches.length > 0) {
      // Lưu vào cache
      cache.set(cacheKey, {
        data: mockTeamMatches,
        timestamp: Date.now()
      });

      console.log(`✅ Mock data for team ${teamId}: ${mockTeamMatches.matches.length} matches`);
      return NextResponse.json(mockTeamMatches);
    }

    // Fallback: thử gọi API thật
    const headers = {
      'X-Auth-Token': FOOTBALL_API_KEY,
      'Content-Type': 'application/json',
    };

    const response = await fetch(
      `${BASE_URL}/teams/${teamId}/matches?status=SCHEDULED,LIVE,IN_PLAY,PAUSED,FINISHED`,
      { 
        headers,
        next: { revalidate: 600 } // 10 phút
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Lưu vào cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    console.log(`✅ API Success for team ${teamId}: ${response.status}, Matches: ${data.matches?.length || 0}`);

    return NextResponse.json(data);

  } catch (error) {
    console.error('Team matches API error:', error);
    
    // Fallback với mock data
    const teamId = new URL(request.url).searchParams.get('teamId');
    if (teamId) {
      const mockData = getMockTeamMatches(parseInt(teamId));
      console.log(`📦 Fallback mock data for team ${teamId}: ${mockData.matches.length} matches`);
      return NextResponse.json(mockData);
    }
    
    return NextResponse.json({
      count: 0,
      matches: [],
      message: 'Unable to fetch team matches at the moment'
    });
  }
}

// Mock data generator cho team matches
function getMockTeamMatches(teamId: number) {
  const teamInfo = getTeamInfo(teamId);
  if (!teamInfo) {
    return { count: 0, matches: [] };
  }

  const mockMatches = [
    // Recent matches
    {
      id: Math.random() * 1000000,
      utcDate: '2025-12-01T15:00:00Z',
      status: 'FINISHED',
      homeTeam: teamInfo,
      awayTeam: { id: 999, name: 'Opponent A', crest: 'https://crests.football-data.org/999.png' },
      score: { fullTime: { home: 2, away: 1 } },
      competition: { name: 'Premier League', emblem: 'https://crests.football-data.org/PL.png' }
    },
    {
      id: Math.random() * 1000000,
      utcDate: '2025-11-28T18:45:00Z',
      status: 'FINISHED',
      homeTeam: { id: 998, name: 'Opponent B', crest: 'https://crests.football-data.org/998.png' },
      awayTeam: teamInfo,
      score: { fullTime: { home: 1, away: 3 } },
      competition: { name: 'Champions League', emblem: 'https://crests.football-data.org/CL.png' }
    },
    // Upcoming matches
    {
      id: Math.random() * 1000000,
      utcDate: '2025-12-07T16:30:00Z',
      status: 'SCHEDULED',
      homeTeam: teamInfo,
      awayTeam: { id: 997, name: 'Opponent C', crest: 'https://crests.football-data.org/997.png' },
      score: { fullTime: { home: null, away: null } },
      competition: { name: 'Premier League', emblem: 'https://crests.football-data.org/PL.png' }
    },
    {
      id: Math.random() * 1000000,
      utcDate: '2025-12-10T20:00:00Z',
      status: 'SCHEDULED',
      homeTeam: { id: 996, name: 'Opponent D', crest: 'https://crests.football-data.org/996.png' },
      awayTeam: teamInfo,
      score: { fullTime: { home: null, away: null } },
      competition: { name: 'Champions League', emblem: 'https://crests.football-data.org/CL.png' }
    },
    {
      id: Math.random() * 1000000,
      utcDate: '2025-12-15T15:00:00Z',
      status: 'SCHEDULED',
      homeTeam: teamInfo,
      awayTeam: { id: 995, name: 'Opponent E', crest: 'https://crests.football-data.org/995.png' },
      score: { fullTime: { home: null, away: null } },
      competition: { name: 'Premier League', emblem: 'https://crests.football-data.org/PL.png' }
    }
  ];

  return {
    count: mockMatches.length,
    matches: mockMatches
  };
}

function getTeamInfo(teamId: number) {
  const teams: Record<number, any> = {
    86: { id: 86, name: 'Real Madrid', crest: 'https://crests.football-data.org/86.png' },
    81: { id: 81, name: 'FC Barcelona', crest: 'https://crests.football-data.org/81.png' },
    64: { id: 64, name: 'Liverpool FC', crest: 'https://crests.football-data.org/64.png' },
    61: { id: 61, name: 'Chelsea FC', crest: 'https://crests.football-data.org/61.png' },
    57: { id: 57, name: 'Arsenal FC', crest: 'https://crests.football-data.org/57.png' },
    66: { id: 66, name: 'Manchester United FC', crest: 'https://crests.football-data.org/66.png' },
    65: { id: 65, name: 'Manchester City FC', crest: 'https://crests.football-data.org/65.png' },
    5: { id: 5, name: 'FC Bayern München', crest: 'https://crests.football-data.org/5.png' },
    11: { id: 11, name: 'Borussia Dortmund', crest: 'https://crests.football-data.org/11.png' },
    496: { id: 496, name: 'Juventus FC', crest: 'https://crests.football-data.org/496.png' },
    98: { id: 98, name: 'AC Milan', crest: 'https://crests.football-data.org/98.png' },
    524: { id: 524, name: 'Paris Saint-Germain FC', crest: 'https://crests.football-data.org/524.png' }
  };
  
  return teams[teamId] || null;
}