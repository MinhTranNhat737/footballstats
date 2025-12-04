"use client"

import { useState } from "react"
import { useLiveMatches, useTodaysMatches, useUpcomingMatches } from "@/hooks/use-football-api"
import Header from "@/components/header"
import MatchCard from "@/components/match-card"
import MatchDetailModal from "@/components/match-detail-modal"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { RefreshCw } from "lucide-react"
import type { Match } from "@/types/match"

export default function LiveMatchesPage() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [activeTab, setActiveTab] = useState("live")
  
  const { 
    matches: liveMatches, 
    isLoading: liveLoading, 
    error: liveError, 
    refetch: refetchLive 
  } = useLiveMatches()
  
  const { 
    matches: todayMatches, 
    isLoading: todayLoading, 
    error: todayError,
    refetch: refetchToday
  } = useTodaysMatches()
  
  const { 
    matches: upcomingMatches, 
    isLoading: upcomingLoading, 
    error: upcomingError,
    refetch: refetchUpcoming
  } = useUpcomingMatches()

  const handleRefresh = () => {
    switch (activeTab) {
      case "live":
        refetchLive()
        break
      case "today":
        refetchToday()
        break
      case "upcoming":
        refetchUpcoming()
        break
    }
  }

  const renderMatchList = (
    matches: Match[], 
    loading: boolean, 
    error: string | null, 
    emptyMessage: string
  ) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner className="w-8 h-8 mb-4 mx-auto" />
            <p className="text-slate-400">Đang tải dữ liệu...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Thử lại
          </button>
        </div>
      )
    }

    if (matches.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚽</div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">Không có dữ liệu</h3>
          <p className="text-slate-400 mb-4">{emptyMessage}</p>
          <div className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
            📡 Dữ liệu từ Football Data API - chỉ hiển thị lịch thi đấu thực tế từ các giải đấu lớn châu Âu
            <br />
            (Premier League, La Liga, Bundesliga, Serie A, Ligue 1, v.v.)
          </div>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Làm mới
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {matches.map((match) => (
          <MatchCard 
            key={match.id} 
            match={match} 
            onSelect={() => setSelectedMatch(match)} 
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Kết quả trực tiếp</h1>
              <div className="flex items-center gap-4">
                <p className="text-slate-400">Cập nhật theo thời gian thực</p>
                {liveMatches.length > 0 && (
                  <Badge variant="destructive" className="bg-red-500/20 text-red-400 animate-pulse">
                    {liveMatches.length} trận đang diễn ra
                  </Badge>
                )}
                {todayMatches.length > 0 && (
                  <Badge variant="outline" className="border-blue-500/20 text-blue-400">
                    {todayMatches.length} trận hôm nay
                  </Badge>
                )}
              </div>
            </div>
            
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Làm mới
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{liveMatches.length}</div>
              <div className="text-sm text-slate-400">Đang diễn ra</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{todayMatches.length}</div>
              <div className="text-sm text-slate-400">Hôm nay</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{upcomingMatches.length}</div>
              <div className="text-sm text-slate-400">Sắp diễn ra</div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-3 max-w-2xl bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
            <button 
              onClick={() => setActiveTab("live")}
              className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === "live" 
                  ? "bg-red-600 text-white shadow-lg" 
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              🔴 Trực tiếp
              {liveMatches.length > 0 && (
                <span className="px-2 py-0.5 text-xs bg-white/20 rounded-full">
                  {liveMatches.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("today")}
              className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === "today" 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              📅 Hôm nay
              {todayMatches.length > 0 && (
                <span className="px-2 py-0.5 text-xs bg-white/20 rounded-full">
                  {todayMatches.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === "upcoming" 
                  ? "bg-green-600 text-white shadow-lg" 
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              ⏰ Sắp diễn ra
              {upcomingMatches.length > 0 && (
                <span className="px-2 py-0.5 text-xs bg-white/20 rounded-full">
                  {upcomingMatches.length}
                </span>
              )}
            </button>
          </div>

          <div className="mt-6">
            {activeTab === "live" && (
              <div>
                {renderMatchList(
                  liveMatches,
                  liveLoading,
                  liveError,
                  "Hiện tại không có trận đấu nào đang diễn ra"
                )}
              </div>
            )}
            
            {activeTab === "today" && (
              <div>
                <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    📅 <strong>Tất cả trận đấu hôm nay</strong> - Bao gồm đã kết thúc, đang diễn ra và sắp diễn ra trong ngày
                  </p>
                </div>
                {renderMatchList(
                  todayMatches,
                  todayLoading,
                  todayError,
                  "Không có trận đấu nào trong ngày hôm nay. Hãy kiểm tra lại sau!"
                )}
              </div>
            )}
            
            {activeTab === "upcoming" && (
              <div>
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-300 text-sm">
                    ⏰ <strong>Trận đấu sắp diễn ra</strong> - Chỉ những trận đấu được lên lịch từ ngày mai trở đi
                  </p>
                </div>
                {renderMatchList(
                  upcomingMatches,
                  upcomingLoading,
                  upcomingError,
                  "Không có trận đấu nào được lên lịch trong thời gian tới"
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedMatch && (
        <MatchDetailModal 
          match={selectedMatch} 
          onClose={() => setSelectedMatch(null)} 
        />
      )}
    </div>
  )
}