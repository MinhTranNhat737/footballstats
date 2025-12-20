import { NextRequest, NextResponse } from 'next/server';

// Mock detailed player data
const getPlayerDetails = (playerId: number) => {
  const basePlayer = {
    id: playerId,
    name: "Lionel Messi",
    firstName: "Lionel",
    lastName: "Messi",
    position: "Right Winger",
    nationality: "Argentina",
    dateOfBirth: "1987-06-24",
    shirtNumber: 10,
    marketValue: 35000000,
    height: 170,
    weight: 72,
    preferredFoot: "Left",
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
      minutesPlayed: 3850,
      saves: 0,
      cleanSheets: 0
    },
    contract: {
      start: "2023-07-15",
      until: "2025-12-31"
    },
    recentMatches: [
      {
        id: 1001,
        date: "2025-12-10",
        homeTeam: "Inter Miami CF",
        awayTeam: "Atlanta United",
        score: "2-1",
        playerPerformance: {
          goals: 1,
          assists: 1,
          minutesPlayed: 90,
          rating: 8.5
        }
      },
      {
        id: 1002,
        date: "2025-12-05",
        homeTeam: "Orlando City",
        awayTeam: "Inter Miami CF", 
        score: "0-3",
        playerPerformance: {
          goals: 2,
          assists: 0,
          minutesPlayed: 85,
          rating: 9.2
        }
      },
      {
        id: 1003,
        date: "2025-11-30",
        homeTeam: "Inter Miami CF",
        awayTeam: "Charlotte FC",
        score: "1-1",
        playerPerformance: {
          goals: 0,
          assists: 1,
          minutesPlayed: 90,
          rating: 7.8
        }
      }
    ],
    achievements: [
      "8× Ballon d'Or Winner",
      "World Cup Winner 2022",
      "10× La Liga Champion",
      "4× UEFA Champions League Winner",
      "Copa América Winner 2021",
      "Olympic Gold Medal 2008"
    ],
    socialMedia: {
      instagram: "@leomessi",
      twitter: "@leomessi",
      followers: "504M+"
    }
  };

  // Customize based on player ID
  const playersData = {
    1: basePlayer,
    2: {
      ...basePlayer,
      id: 2,
      name: "Cristiano Ronaldo",
      firstName: "Cristiano",
      lastName: "Ronaldo",
      position: "Centre-Forward",
      nationality: "Portugal",
      dateOfBirth: "1985-02-05",
      shirtNumber: 7,
      marketValue: 15000000,
      height: 187,
      weight: 83,
      preferredFoot: "Right",
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
        minutesPlayed: 4320,
        saves: 0,
        cleanSheets: 0
      },
      achievements: [
        "5× Ballon d'Or Winner",
        "European Champion 2016",
        "5× UEFA Champions League Winner",
        "3× Premier League Champion",
        "2× La Liga Champion",
        "Nations League Winner 2019"
      ],
      socialMedia: {
        instagram: "@cristiano",
        twitter: "@Cristiano",
        followers: "636M+"
      }
    },
    3: {
      ...basePlayer,
      id: 3,
      name: "Erling Haaland",
      firstName: "Erling",
      lastName: "Haaland",
      position: "Centre-Forward",
      nationality: "Norway",
      dateOfBirth: "2000-07-21",
      shirtNumber: 9,
      marketValue: 180000000,
      height: 194,
      weight: 88,
      preferredFoot: "Left",
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
        minutesPlayed: 3980,
        saves: 0,
        cleanSheets: 0
      },
      achievements: [
        "Premier League Champion 2023, 2024",
        "UEFA Champions League Winner 2023",
        "Premier League Golden Boot 2023",
        "Champions League Top Scorer 2023",
        "FWA Footballer of the Year 2023"
      ],
      socialMedia: {
        instagram: "@erling.haaland",
        twitter: "@ErlingHaaland",
        followers: "35M+"
      }
    }
  };

  return playersData[playerId] || basePlayer;
};

export async function GET(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const playerId = parseInt(pathname.split('/').pop() || '1');

    if (!playerId || playerId < 1) {
      return NextResponse.json(
        { error: 'Invalid player ID' },
        { status: 400 }
      );
    }

    const playerDetails = getPlayerDetails(playerId);
    
    // Calculate additional stats
    const age = new Date().getFullYear() - new Date(playerDetails.dateOfBirth).getFullYear();
    const goalsPerGame = playerDetails.stats.appearances > 0 
      ? (playerDetails.stats.goals / playerDetails.stats.appearances).toFixed(2)
      : '0.00';
    const assistsPerGame = playerDetails.stats.appearances > 0
      ? (playerDetails.stats.assists / playerDetails.stats.appearances).toFixed(2) 
      : '0.00';

    const enhancedPlayer = {
      ...playerDetails,
      age,
      calculatedStats: {
        goalsPerGame: parseFloat(goalsPerGame),
        assistsPerGame: parseFloat(assistsPerGame),
        minutesPerGoal: playerDetails.stats.goals > 0 
          ? Math.round(playerDetails.stats.minutesPlayed / playerDetails.stats.goals)
          : null,
        minutesPerAssist: playerDetails.stats.assists > 0
          ? Math.round(playerDetails.stats.minutesPlayed / playerDetails.stats.assists)
          : null
      }
    };

    console.log(`📊 Player details fetched for: ${enhancedPlayer.name} (ID: ${playerId})`);

    return NextResponse.json(enhancedPlayer);

  } catch (error) {
    console.error('❌ Player details error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Unable to fetch player details'
      },
      { status: 500 }
    );
  }
}