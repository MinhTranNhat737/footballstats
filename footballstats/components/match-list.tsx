"use client"
import { useMemo } from "react"
import type { Match } from "@/types/match"
import MatchCard from "@/components/match-card"
import { MatchListSkeleton } from "@/components/ui/skeletons"

interface MatchListProps {
  matches: Match[]
  onSelectMatch: (match: Match) => void
  isLoading?: boolean
}

const groupMatchesByDate = (matches: Match[]) => {
  const grouped: { [key: string]: Match[] } = {}

  matches.forEach((match) => {
    try {
      if (!match.utcDate) return
      
      const date = new Date(match.utcDate)
      if (isNaN(date.getTime())) return
      
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let dateKey: string
      if (date.toDateString() === today.toDateString()) {
        dateKey = "Hôm nay"
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = "Hôm qua"
      } else {
        dateKey = date.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
      }

      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(match)
    } catch (error) {
      console.warn('Error processing match date:', match.id, error)
    }
  })

  return grouped
}

export default function MatchList({ matches, onSelectMatch, isLoading = false }: MatchListProps) {
  console.log('MatchList received matches:', matches?.length)
  
  const groupedMatches = useMemo(() => groupMatchesByDate(matches), [matches])
  
  const dateKeys = useMemo(() => {
    return Object.keys(groupedMatches).sort((a, b) => {
      try {
        const matchA = groupedMatches[a][0]
        const matchB = groupedMatches[b][0]
        
        if (!matchA?.utcDate || !matchB?.utcDate) return 0
        
        const dateA = new Date(matchA.utcDate)
        const dateB = new Date(matchB.utcDate)
        
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0
        
        return dateB.getTime() - dateA.getTime()
      } catch {
        return 0
      }
    })
  }, [groupedMatches])

  // Show loading skeleton
  if (isLoading) {
    return <MatchListSkeleton count={8} />
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Không có trận đấu</h3>
        <p className="text-slate-400 mb-4">
          Không tìm thấy trận đấu nào phù hợp với bộ lọc hiện tại.
        </p>
        <div className="text-xs text-slate-500 max-w-md mx-auto">
          📡 Sử dụng dữ liệu thực từ Football Data API
          <br />
          Chỉ hiển thị lịch thi đấu từ các giải lớn: Premier League, La Liga, Bundesliga, Serie A, Ligue 1, v.v.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {dateKeys.map((dateKey, groupIndex) => (
        <div 
          key={dateKey}
          className="animate-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${groupIndex * 100}ms` }}
        >
          <h3 className="text-sm font-semibold text-slate-300 mb-3 px-2 uppercase tracking-wider flex items-center gap-2 transition-all duration-300 hover:text-white">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></span>
            {dateKey}
            <span className="text-xs bg-slate-700/50 px-2 py-1 rounded-full">
              {groupedMatches[dateKey].length}
            </span>
          </h3>
          <div className="space-y-2">
            {groupedMatches[dateKey].map((match, index) => (
              <div
                key={match.id}
                className="animate-in slide-in-from-left-2 duration-300"
                style={{ animationDelay: `${groupIndex * 100 + index * 50}ms` }}
              >
                <MatchCard 
                  match={match} 
                  onSelect={() => onSelectMatch(match)} 
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
