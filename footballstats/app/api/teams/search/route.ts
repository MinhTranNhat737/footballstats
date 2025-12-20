import { NextRequest, NextResponse } from 'next/server';

// Mock data cho các đội bóng - Comprehensive list
const mockTeams = [
  // Premier League Teams
  {
    id: 57,
    name: "Arsenal FC",
    shortName: "Arsenal",
    tla: "ARS",
    crest: "https://crests.football-data.org/57.png",
    founded: 1886,
    clubColors: "Red / White",
    venue: "Emirates Stadium",
    website: "http://www.arsenal.com",
    area: { name: "England", flag: "https://crests.football-data.org/england.png" },
    runningCompetitions: [
      { id: 2021, name: "Premier League" },
      { id: 2001, name: "UEFA Champions League" }
    ]
  },
  {
    id: 61,
    name: "Chelsea FC",
    shortName: "Chelsea",
    tla: "CHE", 
    crest: "https://crests.football-data.org/61.png",
    founded: 1905,
    clubColors: "Royal Blue / Royal Blue",
    venue: "Stamford Bridge",
    website: "http://www.chelseafc.com",
    area: { name: "England", flag: "https://crests.football-data.org/england.png" },
    runningCompetitions: [
      { id: 2021, name: "Premier League" },
      { id: 2001, name: "UEFA Champions League" }
    ]
  },
  {
    id: 64,
    name: "Liverpool FC",
    shortName: "Liverpool",
    tla: "LIV",
    crest: "https://crests.football-data.org/64.png",
    founded: 1892,
    clubColors: "Red / Red",
    venue: "Anfield",
    website: "http://www.liverpoolfc.com",
    area: { name: "England", flag: "https://crests.football-data.org/england.png" },
    runningCompetitions: [
      { id: 2021, name: "Premier League" },
      { id: 2001, name: "UEFA Champions League" }
    ]
  },
  {
    id: 65,
    name: "Manchester City FC",
    shortName: "Man City",
    tla: "MCI",
    crest: "https://crests.football-data.org/65.png",
    founded: 1880,
    clubColors: "Sky Blue / White",
    venue: "Etihad Stadium",
    website: "http://www.mancity.com",
    area: { name: "England", flag: "https://crests.football-data.org/england.png" },
    runningCompetitions: [
      { id: 2021, name: "Premier League" },
      { id: 2001, name: "UEFA Champions League" }
    ]
  },
  {
    id: 66,
    name: "Manchester United FC",
    shortName: "Man United",
    tla: "MUN",
    crest: "https://crests.football-data.org/66.png",
    founded: 1878,
    clubColors: "Red / Yellow",
    venue: "Old Trafford",
    website: "http://www.manutd.com",
    area: { name: "England", flag: "https://crests.football-data.org/england.png" },
    runningCompetitions: [
      { id: 2021, name: "Premier League" },
      { id: 2002, name: "UEFA Europa League" }
    ]
  },
  {
    id: 73,
    name: "Tottenham Hotspur FC",
    shortName: "Tottenham",
    tla: "TOT",
    crest: "https://crests.football-data.org/73.png",
    founded: 1882,
    clubColors: "Navy Blue / White",
    venue: "Tottenham Hotspur Stadium",
    website: "http://www.tottenhamhotspur.com",
    area: { name: "England", flag: "https://crests.football-data.org/england.png" },
    runningCompetitions: [
      { id: 2021, name: "Premier League" },
      { id: 2002, name: "UEFA Europa League" }
    ]
  },
  {
    id: 563,
    name: "West Ham United FC",
    shortName: "West Ham",
    tla: "WHU",
    crest: "https://crests.football-data.org/563.png",
    founded: 1895,
    clubColors: "Claret / Sky Blue",
    venue: "London Stadium",
    website: "http://www.whufc.com",
    area: { name: "England", flag: "https://crests.football-data.org/england.png" },
    runningCompetitions: [
      { id: 2021, name: "Premier League" }
    ]
  },
  {
    id: 67,
    name: "Newcastle United FC",
    shortName: "Newcastle",
    tla: "NEW",
    crest: "https://crests.football-data.org/67.png",
    founded: 1892,
    clubColors: "Black / White",
    venue: "St. James' Park",
    website: "http://www.nufc.co.uk",
    area: { name: "England", flag: "https://crests.football-data.org/england.png" },
    runningCompetitions: [
      { id: 2021, name: "Premier League" }
    ]
  },

  // La Liga Teams
  {
    id: 86,
    name: "Real Madrid CF",
    shortName: "Real Madrid",
    tla: "RMA",
    crest: "https://crests.football-data.org/86.png",
    founded: 1902,
    clubColors: "White / Purple",
    venue: "Santiago Bernabéu",
    website: "http://www.realmadrid.com",
    area: { name: "Spain", flag: "https://crests.football-data.org/spain.png" },
    runningCompetitions: [
      { id: 2014, name: "La Liga" },
      { id: 2001, name: "UEFA Champions League" }
    ]
  },
  {
    id: 81,
    name: "FC Barcelona",
    shortName: "Barcelona",
    tla: "FCB",
    crest: "https://crests.football-data.org/81.png",
    founded: 1899,
    clubColors: "Red / Blue",
    venue: "Camp Nou",
    website: "http://www.fcbarcelona.com",
    area: { name: "Spain", flag: "https://crests.football-data.org/spain.png" },
    runningCompetitions: [
      { id: 2014, name: "La Liga" },
      { id: 2001, name: "UEFA Champions League" }
    ]
  },
  {
    id: 78,
    name: "Atlético de Madrid",
    shortName: "Atlético",
    tla: "ATM",
    crest: "https://crests.football-data.org/78.png",
    founded: 1903,
    clubColors: "Red / White / Blue",
    venue: "Cívitas Metropolitano",
    website: "http://www.atleticodemadrid.com",
    area: { name: "Spain", flag: "https://crests.football-data.org/spain.png" },
    runningCompetitions: [
      { id: 2014, name: "La Liga" },
      { id: 2001, name: "UEFA Champions League" }
    ]
  },
  {
    id: 90,
    name: "Real Sociedad",
    shortName: "Real Sociedad",
    tla: "RSO",
    crest: "https://crests.football-data.org/90.png",
    founded: 1909,
    clubColors: "Blue / White",
    venue: "Reale Arena",
    website: "http://www.realsociedad.eus",
    area: { name: "Spain", flag: "https://crests.football-data.org/spain.png" },
    runningCompetitions: [
      { id: 2014, name: "La Liga" }
    ]
  },

  // Bundesliga Teams
  {
    id: 5,
    name: "FC Bayern München",
    shortName: "Bayern Munich",
    tla: "FCB",
    crest: "https://crests.football-data.org/5.png",
    founded: 1900,
    clubColors: "Red / White / Blue",
    venue: "Allianz Arena",
    website: "http://www.fcbayern.com",
    area: { name: "Germany", flag: "https://crests.football-data.org/germany.png" },
    runningCompetitions: [
      { id: 2002, name: "Bundesliga" },
      { id: 2001, name: "UEFA Champions League" }
    ]
  },
  {
    id: 11,
    name: "Borussia Dortmund",
    shortName: "Dortmund",
    tla: "BVB", 
    crest: "https://crests.football-data.org/11.png",
    founded: 1909,
    clubColors: "Black / Yellow",
    venue: "Signal Iduna Park",
    website: "http://www.bvb.de",
    area: { name: "Germany", flag: "https://crests.football-data.org/germany.png" },
    runningCompetitions: [
      { id: 2002, name: "Bundesliga" },
      { id: 2001, name: "UEFA Champions League" }
    ]
  },
  {
    id: 18,
    name: "Bayer 04 Leverkusen",
    shortName: "Bayer Leverkusen",
    tla: "B04",
    crest: "https://crests.football-data.org/18.png",
    founded: 1904,
    clubColors: "Red / Black / White",
    venue: "BayArena",
    website: "http://www.bayer04.de",
    area: { name: "Germany", flag: "https://crests.football-data.org/germany.png" },
    runningCompetitions: [
      { id: 2002, name: "Bundesliga" },
      { id: 2002, name: "UEFA Europa League" }
    ]
  },
  {
    id: 16,
    name: "RB Leipzig",
    shortName: "Leipzig",
    tla: "RBL",
    crest: "https://crests.football-data.org/721.png",
    founded: 2009,
    clubColors: "Red / Blue / White",
    venue: "Red Bull Arena",
    website: "http://www.dierotenbullen.com",
    area: { name: "Germany", flag: "https://crests.football-data.org/germany.png" },
    runningCompetitions: [
      { id: 2002, name: "Bundesliga" },
      { id: 2001, name: "UEFA Champions League" }
    ]
  },

  // Serie A Teams
  {
    id: 496,
    name: "Juventus FC",
    shortName: "Juventus",
    tla: "JUV",
    crest: "https://crests.football-data.org/496.png",
    founded: 1897,
    clubColors: "Black / White",
    venue: "Allianz Stadium",
    website: "http://www.juventus.com",
    area: { name: "Italy", flag: "https://crests.football-data.org/italy.png" },
    runningCompetitions: [
      { id: 2019, name: "Serie A" },
      { id: 2002, name: "UEFA Europa League" }
    ]
  },
  {
    id: 98,
    name: "AC Milan",
    shortName: "Milan",
    tla: "MIL",
    crest: "https://crests.football-data.org/98.png",
    founded: 1899,
    clubColors: "Red / Black",
    venue: "San Siro",
    website: "http://www.acmilan.com",
    area: { name: "Italy", flag: "https://crests.football-data.org/italy.png" },
    runningCompetitions: [
      { id: 2019, name: "Serie A" },
      { id: 2001, name: "UEFA Champions League" }
    ]
  },
  {
    id: 108,
    name: "FC Internazionale Milano",
    shortName: "Inter Milan",
    tla: "INT",
    crest: "https://crests.football-data.org/108.png",
    founded: 1908,
    clubColors: "Blue / Black",
    venue: "San Siro",
    website: "http://www.inter.it",
    area: { name: "Italy", flag: "https://crests.football-data.org/italy.png" },
    runningCompetitions: [
      { id: 2019, name: "Serie A" },
      { id: 2001, name: "UEFA Champions League" }
    ]
  },
  {
    id: 113,
    name: "SSC Napoli",
    shortName: "Napoli",
    tla: "NAP",
    crest: "https://crests.football-data.org/113.png",
    founded: 1926,
    clubColors: "Sky Blue / White",
    venue: "Stadio Diego Armando Maradona",
    website: "http://www.sscnapoli.it",
    area: { name: "Italy", flag: "https://crests.football-data.org/italy.png" },
    runningCompetitions: [
      { id: 2019, name: "Serie A" },
      { id: 2001, name: "UEFA Champions League" }
    ]
  },
  {
    id: 109,
    name: "AS Roma",
    shortName: "Roma",
    tla: "ROM",
    crest: "https://crests.football-data.org/109.png",
    founded: 1927,
    clubColors: "Maroon / Orange",
    venue: "Stadio Olimpico",
    website: "http://www.asroma.it",
    area: { name: "Italy", flag: "https://crests.football-data.org/italy.png" },
    runningCompetitions: [
      { id: 2019, name: "Serie A" },
      { id: 2002, name: "UEFA Europa League" }
    ]
  },

  // Ligue 1 Teams
  {
    id: 524,
    name: "Paris Saint-Germain FC",
    shortName: "PSG",
    tla: "PSG",
    crest: "https://crests.football-data.org/524.png",
    founded: 1970,
    clubColors: "Blue / Red",
    venue: "Parc des Princes",
    website: "http://www.psg.fr",
    area: { name: "France", flag: "https://crests.football-data.org/france.png" },
    runningCompetitions: [
      { id: 2015, name: "Ligue 1" },
      { id: 2001, name: "UEFA Champions League" }
    ]
  },
  {
    id: 516,
    name: "Olympique de Marseille",
    shortName: "Marseille",
    tla: "OM",
    crest: "https://crests.football-data.org/516.png",
    founded: 1899,
    clubColors: "Sky Blue / White",
    venue: "Stade Vélodrome",
    website: "http://www.om.net",
    area: { name: "France", flag: "https://crests.football-data.org/france.png" },
    runningCompetitions: [
      { id: 2015, name: "Ligue 1" },
      { id: 2002, name: "UEFA Europa League" }
    ]
  },
  {
    id: 523,
    name: "Olympique Lyonnais",
    shortName: "Lyon",
    tla: "OL",
    crest: "https://crests.football-data.org/523.png",
    founded: 1950,
    clubColors: "Blue / White / Red",
    venue: "Groupama Stadium",
    website: "http://www.ol.fr",
    area: { name: "France", flag: "https://crests.football-data.org/france.png" },
    runningCompetitions: [
      { id: 2015, name: "Ligue 1" },
      { id: 2002, name: "UEFA Europa League" }
    ]
  },
  {
    id: 521,
    name: "AS Monaco FC",
    shortName: "Monaco",
    tla: "ASM",
    crest: "https://crests.football-data.org/521.png",
    founded: 1924,
    clubColors: "Red / White",
    venue: "Stade Louis II",
    website: "http://www.asmonaco.com",
    area: { name: "France", flag: "https://crests.football-data.org/france.png" },
    runningCompetitions: [
      { id: 2015, name: "Ligue 1" }
    ]
  },

  // Eredivisie Teams
  {
    id: 678,
    name: "AFC Ajax",
    shortName: "Ajax",
    tla: "AJA",
    crest: "https://crests.football-data.org/678.png",
    founded: 1900,
    clubColors: "Red / White",
    venue: "Johan Cruyff Arena",
    website: "http://www.ajax.nl",
    area: { name: "Netherlands", flag: "https://crests.football-data.org/netherlands.png" },
    runningCompetitions: [
      { id: 2003, name: "Eredivisie" },
      { id: 2002, name: "UEFA Europa League" }
    ]
  },
  {
    id: 674,
    name: "PSV",
    shortName: "PSV Eindhoven",
    tla: "PSV",
    crest: "https://crests.football-data.org/674.png",
    founded: 1913,
    clubColors: "Red / White",
    venue: "Philips Stadion",
    website: "http://www.psv.nl",
    area: { name: "Netherlands", flag: "https://crests.football-data.org/netherlands.png" },
    runningCompetitions: [
      { id: 2003, name: "Eredivisie" },
      { id: 2001, name: "UEFA Champions League" }
    ]
  },

  // Portuguese League Teams
  {
    id: 503,
    name: "FC Porto",
    shortName: "Porto",
    tla: "POR",
    crest: "https://crests.football-data.org/503.png",
    founded: 1893,
    clubColors: "Blue / White",
    venue: "Estádio do Dragão",
    website: "http://www.fcporto.pt",
    area: { name: "Portugal", flag: "https://crests.football-data.org/portugal.png" },
    runningCompetitions: [
      { id: 2017, name: "Primeira Liga" },
      { id: 2001, name: "UEFA Champions League" }
    ]
  },
  {
    id: 498,
    name: "SL Benfica",
    shortName: "Benfica",
    tla: "SLB",
    crest: "https://crests.football-data.org/498.png",
    founded: 1904,
    clubColors: "Red / White",
    venue: "Estádio da Luz",
    website: "http://www.slbenfica.pt",
    area: { name: "Portugal", flag: "https://crests.football-data.org/portugal.png" },
    runningCompetitions: [
      { id: 2017, name: "Primeira Liga" },
      { id: 2001, name: "UEFA Champions League" }
    ]
  },
  {
    id: 559,
    name: "Sporting CP",
    shortName: "Sporting",
    tla: "SCP",
    crest: "https://crests.football-data.org/559.png",
    founded: 1906,
    clubColors: "Green / White",
    venue: "Estádio José Alvalade",
    website: "http://www.sporting.pt",
    area: { name: "Portugal", flag: "https://crests.football-data.org/portugal.png" },
    runningCompetitions: [
      { id: 2017, name: "Primeira Liga" },
      { id: 2002, name: "UEFA Europa League" }
    ]
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log(`🔍 Team search query: "${query}" limit: ${limit}`);

    // Enhanced search - support multiple search patterns
    const filteredTeams = mockTeams.filter(team => {
      const searchTargets = [
        team.name.toLowerCase(),
        team.shortName.toLowerCase(), 
        team.tla.toLowerCase(),
        team.area.name.toLowerCase(),
        team.venue?.toLowerCase() || '',
        ...getTeamAliases(team.name).map(alias => alias.toLowerCase())
      ];

      return searchTargets.some(target => 
        target.includes(query) || 
        query.split(' ').every(word => target.includes(word))
      );
    });

    // Sort by relevance - exact matches first
    const sortedTeams = filteredTeams.sort((a, b) => {
      const aExact = a.name.toLowerCase() === query || a.shortName.toLowerCase() === query || a.tla.toLowerCase() === query;
      const bExact = b.name.toLowerCase() === query || b.shortName.toLowerCase() === query || b.tla.toLowerCase() === query;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Then sort by how early the match appears in team name
      const aIndex = a.name.toLowerCase().indexOf(query);
      const bIndex = b.name.toLowerCase().indexOf(query);
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      return a.name.localeCompare(b.name);
    });

    console.log(`📊 Search results: ${sortedTeams.length} teams found for "${query}"`);
    
    return NextResponse.json({
      count: sortedTeams.length,
      teams: sortedTeams.slice(0, limit),
      query: query
    });

  } catch (error) {
    console.error('❌ Team search error:', error);
    return NextResponse.json(
      { error: 'Failed to search teams', query: '' },
      { status: 500 }
    );
  }
}

// Get common aliases and alternative names for teams
function getTeamAliases(teamName: string): string[] {
  const aliases: Record<string, string[]> = {
    'Real Madrid CF': ['Real', 'Madrid', 'Los Blancos', 'Real Madrid'],
    'FC Barcelona': ['Barca', 'Barcelona', 'Barça', 'Blaugrana', 'FCB'],
    'Manchester United FC': ['Man United', 'Man Utd', 'United', 'Red Devils', 'MUFC'],
    'Manchester City FC': ['Man City', 'City', 'Citizens', 'MCFC'],
    'Liverpool FC': ['Liverpool', 'Reds', 'LFC'],
    'Arsenal FC': ['Arsenal', 'Gunners', 'AFC'],
    'Chelsea FC': ['Chelsea', 'Blues', 'CFC'],
    'Tottenham Hotspur FC': ['Tottenham', 'Spurs', 'THFC'],
    'FC Bayern München': ['Bayern', 'Bayern Munich', 'FCB', 'Die Roten'],
    'Borussia Dortmund': ['Dortmund', 'BVB', 'Die Schwarzgelben'],
    'Paris Saint-Germain FC': ['PSG', 'Paris SG', 'Paris Saint-Germain'],
    'Juventus FC': ['Juve', 'Juventus', 'Bianconeri'],
    'AC Milan': ['Milan', 'Rossoneri', 'ACM'],
    'FC Internazionale Milano': ['Inter', 'Inter Milan', 'Nerazzurri'],
    'Atlético de Madrid': ['Atletico', 'Atletico Madrid', 'ATM', 'Rojiblancos'],
    'SSC Napoli': ['Napoli', 'Azzurri', 'SSC'],
    'AS Roma': ['Roma', 'Giallorossi'],
    'West Ham United FC': ['West Ham', 'Hammers', 'WHUFC'],
    'Newcastle United FC': ['Newcastle', 'Magpies', 'NUFC'],
    'AFC Ajax': ['Ajax', 'AFC'],
    'PSV': ['PSV Eindhoven', 'Eindhoven'],
    'FC Porto': ['Porto', 'FCP', 'Dragões'],
    'SL Benfica': ['Benfica', 'Águias', 'SLB'],
    'Sporting CP': ['Sporting', 'Lions', 'SCP']
  };

  return aliases[teamName] || [];
}