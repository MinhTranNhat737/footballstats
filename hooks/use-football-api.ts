"use client"

import { useState, useEffect, useCallback } from 'react'
import { Match, MatchFilters, UseMatchesState } from '@/types/match'

export function useLiveMatches(): UseMatchesState {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMatches = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/football?endpoint=/matches&status=IN_PLAY')
      const data = await response.json()
      setMatches(data.matches || [])
      console.log(`Fetched ${data.matches?.length || 0} live matches`)
      
    } catch (err) {
      console.error('Error fetching live matches:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch live matches')
      setMatches([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
    
    // Auto-refresh live matches every 30 seconds
    const interval = setInterval(fetchMatches, 30000)
    return () => clearInterval(interval)
  }, [])

  return {
    matches,
    isLoading,
    error,
    refetch: fetchMatches
  }
}

export function useUpcomingMatches(): UseMatchesState {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMatches = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      
      const response = await fetch(
        `/api/football?endpoint=/matches&status=SCHEDULED,TIMED&dateFrom=${tomorrow.toISOString().split('T')[0]}&dateTo=${nextWeek.toISOString().split('T')[0]}`
      )
      const data = await response.json()
      setMatches(data.matches || [])
      console.log(`Fetched ${data.matches?.length || 0} upcoming matches`)
      
    } catch (err) {
      console.error('Error fetching upcoming matches:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch upcoming matches')
      setMatches([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  return {
    matches,
    isLoading,
    error,
    refetch: fetchMatches
  }
}

export function useTodaysMatches(): UseMatchesState {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMatches = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const today = new Date().toISOString().split('T')[0]
      
      const response = await fetch(
        `/api/football?endpoint=/matches&status=SCHEDULED,TIMED,IN_PLAY&dateFrom=${today}&dateTo=${today}`
      )
      const data = await response.json()
      setMatches(data.matches || [])
      console.log(`Fetched ${data.matches?.length || 0} today's matches`)
      
    } catch (err) {
      console.error('Error fetching today matches:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch today matches')
      setMatches([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
    
    // Auto-refresh today's matches every 2 minutes
    const interval = setInterval(fetchMatches, 120000)
    return () => clearInterval(interval)
  }, [])

  return {
    matches,
    isLoading,
    error,
    refetch: fetchMatches
  }
}

export function useMatches(filters?: MatchFilters): UseMatchesState {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMatches = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/football?endpoint=/matches')
      const data = await response.json()
      setMatches(data.matches || [])
      console.log(`Fetched ${data.matches?.length || 0} matches`)
      
    } catch (err) {
      console.error('Error fetching matches:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch matches')
      setMatches([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [filters])

  return {
    matches,
    isLoading,
    error,
    refetch: fetchMatches
  }
}