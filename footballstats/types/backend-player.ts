export interface BackendPlayer {
  player_id: number
  name: string
  position: string
  age: number
  nationality: string
  club?: string
  overall: number
  pace: number
  shooting: number
  passing: number
  dribbling: number
  defending: number
  physical: number
  photo_url?: string
}

export interface BackendPlayerFormData {
  name: string
  position: string
  age: number
  nationality: string
  club?: string
  overall: number
  pace: number
  shooting: number
  passing: number
  dribbling: number
  defending: number
  physical: number
  photo_url?: string
}
