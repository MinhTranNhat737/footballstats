import { NextRequest, NextResponse } from 'next/server';

// Mock data cho các đội bóng
const mockTeams = [
  {
    id: 86,
    name: "Real Madrid",
    shortName: "Real",
    tla: "RMA",
    crest: "https://crests.football-data.org/86.png",
    founded: 1902,
    clubColors: "White / Purple",
    venue: "Santiago Bernabéu",
    website: "http://www.realmadrid.com",
    area: { name: "Spain", flag: "https://crests.football-data.org/spain.png" }
  },
  {
    id: 81,
    name: "FC Barcelona",
    shortName: "Barça",
    tla: "FCB",
    crest: "https://crests.football-data.org/81.png",
    founded: 1899,
    clubColors: "Red / Blue",
    venue: "Camp Nou",
    website: "http://www.fcbarcelona.com",
    area: { name: "Spain", flag: "https://crests.football-data.org/spain.png" }
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
    area: { name: "England", flag: "https://crests.football-data.org/england.png" }
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
    area: { name: "England", flag: "https://crests.football-data.org/england.png" }
  },
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
    area: { name: "England", flag: "https://crests.football-data.org/england.png" }
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
    area: { name: "England", flag: "https://crests.football-data.org/england.png" }
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
    area: { name: "England", flag: "https://crests.football-data.org/england.png" }
  },
  {
    id: 5,
    name: "FC Bayern München",
    shortName: "Bayern",
    tla: "FCB",
    crest: "https://crests.football-data.org/5.png",
    founded: 1900,
    clubColors: "Red / White / Blue",
    venue: "Allianz Arena",
    website: "http://www.fcbayern.com",
    area: { name: "Germany", flag: "https://crests.football-data.org/germany.png" }
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
    area: { name: "Germany", flag: "https://crests.football-data.org/germany.png" }
  },
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
    area: { name: "Italy", flag: "https://crests.football-data.org/italy.png" }
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
    area: { name: "Italy", flag: "https://crests.football-data.org/italy.png" }
  },
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
    area: { name: "France", flag: "https://crests.football-data.org/france.png" }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    // Lọc đội bóng theo từ khóa tìm kiếm
    const filteredTeams = mockTeams.filter(team => 
      team.name.toLowerCase().includes(query) ||
      team.shortName.toLowerCase().includes(query) ||
      team.tla.toLowerCase().includes(query)
    );

    return NextResponse.json({
      count: filteredTeams.length,
      teams: filteredTeams.slice(0, 10) // Giới hạn 10 kết quả
    });

  } catch (error) {
    console.error('Team search error:', error);
    return NextResponse.json(
      { error: 'Failed to search teams' },
      { status: 500 }
    );
  }
}