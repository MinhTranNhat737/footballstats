import { NextRequest, NextResponse } from 'next/server';

const API_TOKEN = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || "3b243d728ed549a3b8dedfa5424f3304"
const BASE_URL = "https://api.football-data.org/v4"

// Mock data cho các cầu thủ nổi tiếng
const mockPlayers = [
  {
    id: 1,
    name: "Lionel Messi",
    position: "Right Winger",
    nationality: "Argentina", 
    dateOfBirth: "1987-06-24",
    shirtNumber: 10,
    marketValue: 35000000,
    team: {
      id: 524,
      name: "Inter Miami CF",
      crest: "https://crests.football-data.org/524.png",
      area: { name: "USA", flag: "https://crests.football-data.org/usa.png" }
    },
    stats: {
      appearances: 45,
      goals: 28,
      assists: 16,
      yellowCards: 4,
      redCards: 0,
      minutesPlayed: 3850
    },
    contract: {
      start: "2023-07-15",
      until: "2025-12-31"
    }
  },
  {
    id: 2,
    name: "Cristiano Ronaldo",
    position: "Centre-Forward",
    nationality: "Portugal",
    dateOfBirth: "1985-02-05", 
    shirtNumber: 7,
    marketValue: 15000000,
    team: {
      id: 1903,
      name: "Al Nassr FC",
      crest: "https://crests.football-data.org/1903.png",
      area: { name: "Saudi Arabia", flag: "https://crests.football-data.org/sa.png" }
    },
    stats: {
      appearances: 52,
      goals: 44,
      assists: 13,
      yellowCards: 6,
      redCards: 1,
      minutesPlayed: 4320
    },
    contract: {
      start: "2023-01-01",
      until: "2025-06-30"
    }
  },
  {
    id: 3,
    name: "Erling Haaland",
    position: "Centre-Forward", 
    nationality: "Norway",
    dateOfBirth: "2000-07-21",
    shirtNumber: 9,
    marketValue: 180000000,
    team: {
      id: 65,
      name: "Manchester City FC",
      crest: "https://crests.football-data.org/65.png",
      area: { name: "England", flag: "https://crests.football-data.org/england.png" }
    },
    stats: {
      appearances: 48,
      goals: 52,
      assists: 9,
      yellowCards: 3,
      redCards: 0,
      minutesPlayed: 3980
    },
    contract: {
      start: "2022-07-01",
      until: "2027-06-30"
    }
  },
  {
    id: 4,
    name: "Kylian Mbappé",
    position: "Left Winger",
    nationality: "France",
    dateOfBirth: "1998-12-20",
    shirtNumber: 9,
    marketValue: 180000000,
    team: {
      id: 86,
      name: "Real Madrid CF",
      crest: "https://crests.football-data.org/86.png",
      area: { name: "Spain", flag: "https://crests.football-data.org/spain.png" }
    },
    stats: {
      appearances: 22,
      goals: 18,
      assists: 2,
      yellowCards: 2,
      redCards: 0,
      minutesPlayed: 1890
    },
    contract: {
      start: "2024-07-01",
      until: "2029-06-30"
    }
  },
  {
    id: 5,
    name: "Jude Bellingham",
    position: "Central Midfield",
    nationality: "England",
    dateOfBirth: "2003-06-29",
    shirtNumber: 5,
    marketValue: 180000000,
    team: {
      id: 86,
      name: "Real Madrid CF", 
      crest: "https://crests.football-data.org/86.png",
      area: { name: "Spain", flag: "https://crests.football-data.org/spain.png" }
    },
    stats: {
      appearances: 42,
      goals: 23,
      assists: 13,
      yellowCards: 8,
      redCards: 0,
      minutesPlayed: 3456
    },
    contract: {
      start: "2023-06-14",
      until: "2029-06-30"
    }
  },
  {
    id: 6,
    name: "Pedri",
    position: "Central Midfield",
    nationality: "Spain",
    dateOfBirth: "2002-11-25",
    shirtNumber: 8,
    marketValue: 100000000,
    team: {
      id: 81,
      name: "FC Barcelona",
      crest: "https://crests.football-data.org/81.png",
      area: { name: "Spain", flag: "https://crests.football-data.org/spain.png" }
    },
    stats: {
      appearances: 35,
      goals: 4,
      assists: 8,
      yellowCards: 5,
      redCards: 0,
      minutesPlayed: 2890
    },
    contract: {
      start: "2021-08-25",
      until: "2026-06-30"
    }
  },
  {
    id: 7,
    name: "Kevin De Bruyne",
    position: "Attacking Midfield",
    nationality: "Belgium",
    dateOfBirth: "1991-06-28",
    shirtNumber: 17,
    marketValue: 80000000,
    team: {
      id: 65,
      name: "Manchester City FC",
      crest: "https://crests.football-data.org/65.png",
      area: { name: "England", flag: "https://crests.football-data.org/england.png" }
    },
    stats: {
      appearances: 40,
      goals: 12,
      assists: 18,
      yellowCards: 4,
      redCards: 0,
      minutesPlayed: 3200
    },
    contract: {
      start: "2015-08-30",
      until: "2025-06-30"
    }
  },
  {
    id: 8,
    name: "Bukayo Saka",
    position: "Right Winger",
    nationality: "England", 
    dateOfBirth: "2001-09-05",
    shirtNumber: 7,
    marketValue: 120000000,
    team: {
      id: 57,
      name: "Arsenal FC",
      crest: "https://crests.football-data.org/57.png",
      area: { name: "England", flag: "https://crests.football-data.org/england.png" }
    },
    stats: {
      appearances: 45,
      goals: 16,
      assists: 14,
      yellowCards: 6,
      redCards: 0,
      minutesPlayed: 3850
    },
    contract: {
      start: "2020-07-01",
      until: "2027-06-30"
    }
  },
  {
    id: 9,
    name: "Harry Kane",
    position: "Centre-Forward",
    nationality: "England",
    dateOfBirth: "1993-07-28", 
    shirtNumber: 9,
    marketValue: 100000000,
    team: {
      id: 5,
      name: "FC Bayern München",
      crest: "https://crests.football-data.org/5.png",
      area: { name: "Germany", flag: "https://crests.football-data.org/germany.png" }
    },
    stats: {
      appearances: 32,
      goals: 36,
      assists: 8,
      yellowCards: 2,
      redCards: 0,
      minutesPlayed: 2780
    },
    contract: {
      start: "2023-08-12",
      until: "2027-06-30"
    }
  },
  {
    id: 10,
    name: "Vinícius Jr.",
    position: "Left Winger",
    nationality: "Brazil",
    dateOfBirth: "2000-07-12",
    shirtNumber: 7,
    marketValue: 150000000,
    team: {
      id: 86,
      name: "Real Madrid CF",
      crest: "https://crests.football-data.org/86.png",
      area: { name: "Spain", flag: "https://crests.football-data.org/spain.png" }
    },
    stats: {
      appearances: 42,
      goals: 24,
      assists: 11,
      yellowCards: 8,
      redCards: 1,
      minutesPlayed: 3456
    },
    contract: {
      start: "2018-07-20",
      until: "2027-06-30"
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase() || ''
    const limit = parseInt(searchParams.get('limit') || '10')
    const position = searchParams.get('position')?.toLowerCase()
    const nationality = searchParams.get('nationality')?.toLowerCase()

    if (query.length < 2) {
      return NextResponse.json({
        players: [],
        message: 'Search query must be at least 2 characters'
      })
    }

    // Filter players based on search criteria
    let filteredPlayers = mockPlayers.filter(player => {
      const matchesName = player.name.toLowerCase().includes(query)
      const matchesTeam = player.team.name.toLowerCase().includes(query)
      const matchesNationality = player.nationality.toLowerCase().includes(query)
      
      return matchesName || matchesTeam || matchesNationality
    })

    // Apply additional filters
    if (position) {
      filteredPlayers = filteredPlayers.filter(player =>
        player.position.toLowerCase().includes(position)
      )
    }

    if (nationality) {
      filteredPlayers = filteredPlayers.filter(player =>
        player.nationality.toLowerCase().includes(nationality)
      )
    }

    // Sort by relevance (name match first, then team, then nationality)
    filteredPlayers.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(query) ? 3 : 0
      const aTeamMatch = a.team.name.toLowerCase().includes(query) ? 2 : 0
      const aNationalityMatch = a.nationality.toLowerCase().includes(query) ? 1 : 0
      const aScore = aNameMatch + aTeamMatch + aNationalityMatch

      const bNameMatch = b.name.toLowerCase().includes(query) ? 3 : 0
      const bTeamMatch = b.team.name.toLowerCase().includes(query) ? 2 : 0
      const bNationalityMatch = b.nationality.toLowerCase().includes(query) ? 1 : 0
      const bScore = bNameMatch + bTeamMatch + bNationalityMatch

      return bScore - aScore
    })

    // Limit results
    const limitedPlayers = filteredPlayers.slice(0, limit)

    console.log(`🔍 Player search for "${query}": Found ${limitedPlayers.length} players`)

    return NextResponse.json({
      count: limitedPlayers.length,
      players: limitedPlayers,
      query,
      filters: { position, nationality }
    })

  } catch (error) {
    console.error('❌ Player search error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        players: [],
        message: 'Unable to search players'
      },
      { status: 500 }
    )
  }
}