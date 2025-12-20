// Base types from Football Data API
export type MatchStatus = 
  | "SCHEDULED" 
  | "TIMED" 
  | "IN_PLAY" 
  | "PAUSED" 
  | "FINISHED" 
  | "POSTPONED" 
  | "SUSPENDED" 
  | "CANCELLED"

export type CompetitionType = "LEAGUE" | "CUP"
export type AreaType = "COUNTRY" | "CONTINENT"
export type TeamVenue = "HOME" | "AWAY"

export interface Area {
  id: number
  name: string
  code: string
  flag: string
}

export interface Competition {
  id: number
  name: string
  code: string
  type: CompetitionType
  emblem: string
  area: Area
  numberOfAvailableSeasons: number
  currentSeason?: Season
  seasons?: Season[]
}

export interface Season {
  id: number
  startDate: string
  endDate: string
  currentMatchday: number | null
  winner?: Team | null
}

export interface Team {
  id: number
  name: string
  shortName: string
  tla: string // Three Letter Abbreviation
  crest: string
  address: string
  website: string
  founded: number
  clubColors: string
  venue: string
  runningCompetitions?: Competition[]
  coach?: Coach
  squad?: Player[]
  area: Area
}

export interface Coach {
  id: number
  firstName: string
  lastName: string
  name: string
  dateOfBirth: string
  nationality: string
  contract?: {
    start: string
    until: string
  }
}

export interface Player {
  id: number
  name: string
  firstName: string
  lastName: string
  dateOfBirth: string
  nationality: string
  position: string
  shirtNumber?: number
  lastUpdated: string
}

export interface Referee {
  id: number
  name: string
  type: string
  nationality: string
}

export interface Score {
  winner: string | null
  duration: string
  fullTime: {
    home: number | null
    away: number | null
  }
  halfTime: {
    home: number | null
    away: number | null
  }
  extraTime?: {
    home: number | null
    away: number | null
  }
  penalties?: {
    home: number | null
    away: number | null
  }
}

export interface Odds {
  homeWin?: number
  draw?: number
  awayWin?: number
}

export interface Match {
  id: number
  area: Area
  competition: Competition
  season: Season
  utcDate: string
  status: MatchStatus
  venue?: string
  matchday: number | null
  stage: string
  group?: string | null
  lastUpdated: string
  minute?: number // Current minute for live matches
  homeTeam: Team
  awayTeam: Team
  score: Score
  goals?: Goal[]
  bookings?: Booking[]
  substitutions?: Substitution[]
  odds?: Odds
  referees: Referee[]
}

export interface Goal {
  minute: number
  injuryTime?: number
  type: string
  team: {
    id: number
    name: string
  }
  scorer: {
    id: number
    name: string
  }
  assist?: {
    id: number
    name: string
  }
}

export interface Booking {
  minute: number
  team: {
    id: number
    name: string
  }
  player: {
    id: number
    name: string
  }
  card: string
}

export interface Substitution {
  minute: number
  team: {
    id: number
    name: string
  }
  playerOut: {
    id: number
    name: string
  }
  playerIn: {
    id: number
    name: string
  }
}

export interface Standing {
  stage: string
  type: string
  group?: string
  table: StandingPosition[]
}

export interface StandingPosition {
  position: number
  team: Team
  playedGames: number
  form: string | null
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
}

export interface TopScorer {
  player: Player
  team: Team
  goals: number
  assists?: number
  penalties?: number
}

// API Response interfaces
export interface ApiResponse<T> {
  count?: number
  filters?: Record<string, any>
  resultSet?: {
    count: number
    competitions?: string
    first: string
    last: string
    played: number
  }
  data?: T
}

export interface MatchesResponse extends ApiResponse<Match[]> {
  matches: Match[]
}

export interface CompetitionsResponse extends ApiResponse<Competition[]> {
  competitions: Competition[]
}

export interface TeamsResponse extends ApiResponse<Team[]> {
  teams: Team[]
}

export interface StandingsResponse extends ApiResponse<Standing[]> {
  standings: Standing[]
}

export interface TopScorersResponse extends ApiResponse<TopScorer[]> {
  scorers: TopScorer[]
}

// Filter interfaces
export interface MatchFilters {
  competitions?: string
  ids?: string
  dateFrom?: string
  dateTo?: string
  status?: MatchStatus
}

export interface CompetitionMatchFilters extends MatchFilters {
  stage?: string
  matchday?: number
  group?: string
  season?: string
}

export interface TeamMatchFilters extends MatchFilters {
  season?: string
  venue?: TeamVenue
  limit?: number
}

// Hook state interfaces
export interface UseMatchesState {
  matches: Match[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export interface UseCompetitionsState {
  competitions: Competition[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export interface UseStandingsState {
  standings: Standing[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export interface UseTopScorersState {
  scorers: TopScorer[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}
