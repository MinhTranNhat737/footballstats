"use client"

import { useState, useEffect, useCallback } from "react"
import Header from "@/components/header"
import FilterBar from "@/components/filter-bar"
import MatchList from "@/components/match-list"
import MatchDetailModal from "@/components/match-detail-modal"
import TeamSearch from "@/components/team-search"
import { Spinner } from "@/components/ui/spinner"
import type { Match } from "@/types/match"
import type { Team } from "@/types/team"

export default function ClientSidePage() {
  const [allMatches, setAllMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming' | 'today'>('all')
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [teamMatches, setTeamMatches] = useState<Match[]>([])
  const [isLoadingTeamMatches, setIsLoadingTeamMatches] = useState(false)
  const [filters, setFilters] = useState({
    competitions: [] as string[],
    dateRange: 'week' as 'today' | 'week' | 'month' | 'all'
  })

  // Debug component state
  console.log('🏠 Client-side Home component render - State:', { 
    allMatchesLength: allMatches.length, 
    isLoading, 
    error: error || 'none',
    typeof_window: typeof window,
    isClient: typeof window !== 'undefined'
  })

  // Direct API call in component with improved error handling
  useEffect(() => {
    console.log('🔧 Client-side useEffect running - starting API calls')
    
    const fetchMatches = async () => {
      try {
        console.log('📡 Starting fetch matches...')
        setIsLoading(true)
        setError(null)
        
        // Fetch multiple sources for comprehensive data - handle each separately
        const requests = [
          fetch('/api/football?endpoint=/matches&dateFrom=2025-12-04&dateTo=2025-12-11'),
          fetch('/api/football?endpoint=/matches&status=SCHEDULED'),
          fetch('/api/football?endpoint=/matches'),
          fetch('/api/football?endpoint=/matches&status=FINISHED&dateFrom=2025-11-27&dateTo=2025-12-04')
        ]

        const responses = await Promise.allSettled(requests)
        console.log('📥 Received responses:', responses.length)
        const validData = []

        for (let i = 0; i < responses.length; i++) {
          const result = responses[i]
          if (result.status === 'fulfilled' && result.value.ok) {
            try {
              const data = await result.value.json()
              console.log(`📊 API ${i + 1} response:`, {
                hasError: !!data.error,
                error: data.error,
                errorCode: data.errorCode,
                hasMatches: !!data.matches,
                matchesLength: data.matches?.length || 0,
                matchesType: typeof data.matches
              })
              
              if (!data.error && data.matches && Array.isArray(data.matches)) {
                validData.push(data.matches)
                console.log(`✅ API ${i + 1} success:`, data.matches.length, 'matches')
              } else if (data.error) {
                console.warn(`⚠️ API ${i + 1} error:`, data.error, data.errorCode)
              } else {
                console.warn(`⚠️ API ${i + 1} unexpected response:`, Object.keys(data))
              }
            } catch (parseError) {
              console.warn(`⚠️ API ${i + 1} parse error:`, parseError)
            }
          } else if (result.status === 'rejected') {
            console.warn(`⚠️ API ${i + 1} rejected:`, result.reason)
          } else {
            console.warn(`⚠️ API ${i + 1} not ok:`, result.value?.status, result.value?.statusText)
          }
        }

        console.log('📊 Valid API responses:', validData.length)
        
        // Combine all matches and remove duplicates
        const matchesMap = new Map<number, Match>()
        const allSources = validData.flat()
        
        console.log('📦 All sources combined:', allSources.length, 'total items')
        
        allSources.forEach((match: Match, index) => {
          if (match && match.id) {
            matchesMap.set(match.id, match)
          } else {
            console.warn(`⚠️ Invalid match at index ${index}:`, { 
              hasId: !!match?.id, 
              matchId: match?.id, 
              matchKeys: match ? Object.keys(match) : null 
            })
          }
        })
        
        const combinedMatches = Array.from(matchesMap.values())
        console.log('✅ Combined matches total:', combinedMatches.length)
        console.log('🔍 First few matches:', combinedMatches.slice(0, 3).map(m => ({ 
          id: m.id, 
          homeTeam: m.homeTeam?.name, 
          awayTeam: m.awayTeam?.name,
          status: m.status
        })))
        
        console.log('🔄 Setting allMatches state...')
        setAllMatches(combinedMatches)
        console.log('🔄 Setting isLoading to false...')
        setIsLoading(false)

        // If no matches found, show a warning but don't treat as error
        if (combinedMatches.length === 0) {
          console.warn('⚠️ No matches found from any API endpoint')
          setError(null) // Clear any previous errors
        }
        
      } catch (err) {
        console.error('❌ API Error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        setIsLoading(false)
      }
    }

    fetchMatches()
  }, [])

  // Fetch team matches when team is selected
  useEffect(() => {
    if (!selectedTeam) {
      setTeamMatches([])
      return
    }

    const fetchTeamMatches = async () => {
      setIsLoadingTeamMatches(true)
      try {
        const response = await fetch(`/api/teams/matches?teamId=${selectedTeam.id}`)
        const data = await response.json()
        console.log('🏆 Team matches response:', data)
        console.log('📊 Team matches count:', data.matches?.length || 0)
        setTeamMatches(data.matches || [])
        console.log('🎯 Team matches loaded:', data.matches?.length || 0)
      } catch (error) {
        console.error('❌ Team matches error:', error)
        setTeamMatches([])
      } finally {
        setIsLoadingTeamMatches(false)
      }
    }

    fetchTeamMatches()
  }, [selectedTeam])

  // Filter matches based on activeTab and filters
  const getFilteredMatches = () => {
    // Nếu có team được chọn, sử dụng team matches
    let filtered = selectedTeam ? [...teamMatches] : [...allMatches]
    
    console.log('🔍 Filter debug:', {
      hasSelectedTeam: !!selectedTeam,
      teamName: selectedTeam?.name,
      teamMatchesCount: teamMatches.length,
      allMatchesCount: allMatches.length,
      startingFilteredCount: filtered.length
    });
    
    // Filter by competition
    if (filters.competitions.length > 0) {
      filtered = filtered.filter(match => 
        filters.competitions.includes(match.competition?.name || '')
      )
    }
    
    // Filter by date range 
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    if (filters.dateRange === 'today') {
      const todayStr = today.toISOString().split('T')[0]
      filtered = filtered.filter(match => 
        match.utcDate.split('T')[0] === todayStr
      )
    } else if (filters.dateRange === 'week') {
      filtered = filtered.filter(match => {
        const matchDate = new Date(match.utcDate)
        return matchDate >= today && matchDate <= weekFromNow
      })
    } else if (filters.dateRange === 'month') {
      filtered = filtered.filter(match => {
        const matchDate = new Date(match.utcDate)
        return matchDate >= today && matchDate <= monthFromNow
      })
    }
    
    // Filter by activeTab status
    if (activeTab === 'live') {
      filtered = filtered.filter(match => match.status === 'IN_PLAY')
    } else if (activeTab === 'upcoming') {
      filtered = filtered.filter(match => {
        const matchDate = new Date(match.utcDate)
        return matchDate > now && ['SCHEDULED', 'TIMED'].includes(match.status)
      })
    } else if (activeTab === 'today') {
      const todayStr = today.toISOString().split('T')[0]
      filtered = filtered.filter(match => 
        match.utcDate.split('T')[0] === todayStr
      )
    }
    
    console.log('🎯 Final filtered count:', filtered.length)
    return filtered
  }
  
  const filteredMatches = getFilteredMatches()

  const handleSelectMatch = useCallback((match: Match) => {
    setSelectedMatch(match)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedMatch(null)
  }, [])

  // Get available competitions from matches
  const availableCompetitions = Array.from(
    new Set(allMatches.map(match => match.competition?.name).filter(Boolean))
  ) as string[]

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Header />
        <main className="container mx-auto px-4 py-6 md:py-8">
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Không thể kết nối API</h3>
            <p className="text-red-400 mb-4">{error}</p>
            <div className="space-y-2 text-sm text-slate-400 mb-6">
              <p>• Kiểm tra kết nối internet</p>
              <p>• API có thể đang bảo trì hoặc giới hạn tốc độ</p>
              <p>• Thử lại sau vài phút</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Thử lại
            </button>
          </div>
        </main>
      </div>
    )
  }

  // Show empty state if no matches but no error
  if (!isLoading && allMatches.length === 0 && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Header />
        <main className="container mx-auto px-4 py-6 md:py-8">
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 21H9.154a3.374 3.374 0 00-2.844-1.447l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Chưa có dữ liệu trận đấu</h3>
            <p className="text-yellow-400 mb-4">API đã kết nối nhưng chưa có dữ liệu trận đấu nào</p>
            <div className="space-y-2 text-sm text-slate-400 mb-6">
              <p>• API có thể đang cập nhật dữ liệu</p>
              <p>• Thử tìm kiếm theo đội bóng cụ thể</p>
              <p>• Kiểm tra lại sau vài phút</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
            >
              Làm mới
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Debug Info */}
        <div className="mb-4 p-3 bg-slate-800 border border-slate-700 rounded-lg text-sm">
          <p className="text-slate-300">
            🐛 DEBUG [CLIENT-SIDE]: Loading: {isLoading.toString()}, 
            All Matches: {allMatches.length}, 
            Filtered: {filteredMatches.length}, 
            Error: {error || 'none'}
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Client-side: {typeof window !== 'undefined' ? 'YES ✅' : 'NO ❌'}, 
            typeof window: {typeof window},
            Date: {new Date().toLocaleString()}
          </p>
          {allMatches.length > 0 && (
            <p className="text-slate-400 text-xs mt-1">
              First match: {allMatches[0]?.homeTeam?.name} vs {allMatches[0]?.awayTeam?.name} ({allMatches[0]?.status})
            </p>
          )}
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
          >
            Force Reload
          </button>
        </div>

        {/* Team Search */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Tìm kiếm theo đội bóng</h2>
          <TeamSearch 
            onTeamSelect={setSelectedTeam}
            selectedTeam={selectedTeam}
          />
        </div>

        <FilterBar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          totalCount={selectedTeam ? teamMatches.length : allMatches.length}
          liveCount={allMatches.filter(m => m.status === 'IN_PLAY').length}
          upcomingCount={allMatches.filter(m => {
            const matchDate = new Date(m.utcDate)
            const now = new Date()
            return matchDate > now && ['SCHEDULED', 'TIMED'].includes(m.status)
          }).length}
          todayCount={allMatches.filter(m => {
            const today = new Date().toISOString().split('T')[0]
            return m.utcDate.split('T')[0] === today
          }).length}
          filters={filters}
          setFilters={setFilters}
          availableCompetitions={availableCompetitions}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="w-8 h-8" />
            <span className="ml-2 text-slate-400">Đang tải dữ liệu trận đấu...</span>
          </div>
        ) : isLoadingTeamMatches ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="w-8 h-8" />
            <span className="ml-2 text-slate-400">Đang tải trận đấu của {selectedTeam?.name}...</span>
          </div>
        ) : (
          <>
            {/* Debug Info */}
            {selectedTeam && (
              <div className="mb-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                <p className="text-sm text-blue-300">
                  🎯 Đang hiển thị trận đấu của <strong>{selectedTeam.name}</strong>
                </p>
                <p className="text-xs text-blue-400 mt-1">
                  Team matches: {teamMatches.length} | Filtered matches: {filteredMatches.length} | Loading: {isLoadingTeamMatches.toString()}
                </p>
              </div>
            )}
            
            <MatchList 
              matches={filteredMatches}
              onSelectMatch={handleSelectMatch}
            />
          </>
        )}
      </main>
      {selectedMatch && <MatchDetailModal match={selectedMatch} onClose={handleCloseModal} />}
    </div>
  )
}