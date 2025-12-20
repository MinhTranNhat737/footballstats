export interface Player {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  position: string;
  nationality: string;
  dateOfBirth: string;
  age?: number;
  shirtNumber: number;
  marketValue: number;
  height?: number;
  weight?: number;
  preferredFoot?: string;
  team: {
    id: number;
    name: string;
    crest: string;
    area: {
      name: string;
      flag: string;
    };
  };
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    minutesPlayed: number;
    saves?: number;
    cleanSheets?: number;
  };
  calculatedStats?: {
    goalsPerGame: number;
    assistsPerGame: number;
    minutesPerGoal: number | null;
    minutesPerAssist: number | null;
  };
  contract: {
    start: string;
    until: string;
  };
  recentMatches?: PlayerMatch[];
  achievements?: string[];
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    followers?: string;
  };
}

export interface PlayerMatch {
  id: number;
  date: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  playerPerformance: {
    goals: number;
    assists: number;
    minutesPlayed: number;
    rating: number;
  };
}

export interface PlayerSearchResponse {
  count: number;
  players: Player[];
  query: string;
  filters?: {
    position?: string;
    nationality?: string;
  };
}