"use client"
import { memo } from "react"
import type { Match, MatchStatus } from "@/types/match"
import { ChevronRight, Clock } from "lucide-react"

interface MatchCardProps {
  match: Match
  onSelect: () => void
}

function getStatusInfo(status: MatchStatus) {
  switch (status) {
    case "FINISHED":
      return { text: "Kết thúc", className: "bg-emerald-500/20 text-emerald-400" }
    case "IN_PLAY":
    case "PAUSED":
      return { text: "Đang diễn ra", className: "bg-red-500/20 text-red-400" }
    case "SCHEDULED":
    case "TIMED":
      return { text: "Sắp tới", className: "bg-slate-700/50 text-slate-300" }
    case "POSTPONED":
      return { text: "Hoãn", className: "bg-yellow-500/20 text-yellow-400" }
    case "SUSPENDED":
      return { text: "Tạm ngưng", className: "bg-orange-500/20 text-orange-400" }
    case "CANCELLED":
      return { text: "Hủy bỏ", className: "bg-gray-500/20 text-gray-400" }
    default:
      return { text: "Không rõ", className: "bg-slate-700/50 text-slate-300" }
  }
}

function MatchCard({ match, onSelect }: MatchCardProps) {
  const isFinished = match.status === "FINISHED"
  const isLive = match.status === "IN_PLAY" || match.status === "PAUSED"
  const statusInfo = getStatusInfo(match.status)
  
  const handleClick = () => {
    console.log('Match card clicked:', match.id, match.homeTeam?.name, 'vs', match.awayTeam?.name)
    onSelect()
  }
  
  // Safely format match time
  const matchTime = (() => {
    try {
      if (!match.utcDate) return '--:--'
      const date = new Date(match.utcDate)
      return isNaN(date.getTime()) ? '--:--' : date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    } catch {
      return '--:--'
    }
  })()

  return (
    <div
      onClick={handleClick}
      className="group p-4 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/60 hover:border-slate-600 cursor-pointer transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.99]"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
        {/* Left: Competition & Matchday */}
        <div className="hidden sm:flex flex-col gap-1 min-w-32">
          <div className="flex items-center gap-2">
            {match.competition?.emblem && (
              <img
                src={match.competition.emblem}
                alt={match.competition?.name || 'Giải đấu'}
                className="w-4 h-4 object-contain"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
            <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{match.competition?.name || 'Giải đấu'}</h4>
          </div>
          {match.season?.currentMatchday && (
            <p className="text-xs text-slate-400">Vòng {match.season.currentMatchday}</p>
          )}
        </div>

        {/* Center: Match Score */}
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Teams Perfect Grid Alignment */}
          <div className="w-full max-w-4xl mx-auto px-2">
            <div className="grid grid-cols-12 items-center gap-1 h-10">
              {/* Home Team - Perfect Alignment */}
              <div className="col-span-5 flex items-center justify-end">
                <div className="flex-1 text-right pr-3 min-w-0">
                  <span className="text-sm font-medium text-white truncate block">
                    {match.homeTeam?.shortName || match.homeTeam?.name || 'Home Team'}
                  </span>
                </div>
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  {match.homeTeam?.crest ? (
                    <img
                      src={match.homeTeam.crest}
                      alt={match.homeTeam?.name || 'Home team'}
                      className="w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <span className="text-xs text-slate-400">?</span>
                    </div>
                  )}
                </div>
              </div>

              {/* VS/Score - Fixed Center Position */}
              <div className="col-span-2 flex justify-center">
                <div
                  className={`w-14 h-6 flex items-center justify-center rounded text-xs font-bold transition-all duration-300 group-hover:scale-110 ${
                    isFinished 
                      ? "bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30" 
                      : isLive 
                        ? "bg-red-500/20 text-red-400 group-hover:bg-red-500/30 animate-pulse"
                        : "bg-slate-700/50 text-slate-300 group-hover:bg-slate-600/50"
                  }`}
                >
                  {isFinished || isLive 
                    ? `${match.score?.fullTime?.home ?? 0}-${match.score?.fullTime?.away ?? 0}`
                    : "VS"
                  }
                </div>
              </div>

              {/* Away Team - Perfect Alignment */}
              <div className="col-span-5 flex items-center justify-start">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  {match.awayTeam?.crest ? (
                    <img
                      src={match.awayTeam.crest}
                      alt={match.awayTeam?.name || 'Away team'}
                      className="w-6 h-6 object-contain"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-slate-400">?</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left pl-3 min-w-0">
                  <span className="text-sm font-medium text-white truncate block">
                    {match.awayTeam?.shortName || match.awayTeam?.name || 'Away Team'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Time and Live Indicator */}
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            {!isFinished && !isLive && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                {matchTime}
              </div>
            )}
            {isLive && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-400 font-medium">LIVE</span>
                </div>
                {match.minute && (
                  <span className="text-xs text-white font-bold bg-red-600/20 px-2 py-1 rounded">
                    {match.minute}'
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Status & Action */}
        <div className="w-full md:w-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
              {statusInfo.text}
            </span>
          </div>
          <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-5 h-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Mobile: Competition & Matchday */}
      <div className="sm:hidden mt-3 pt-3 border-t border-slate-700/50 flex justify-between">
        <div className="text-xs">
          <div className="flex items-center gap-1">
            {match.competition?.emblem && (
              <img
                src={match.competition.emblem}
                alt={match.competition?.name || 'Giải đấu'}
                className="w-3 h-3 object-contain"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
            <p className="font-semibold text-blue-400 uppercase tracking-wider">{match.competition?.name || 'Giải đấu'}</p>
          </div>
          {match.season?.currentMatchday && (
            <p className="text-slate-400">Vòng {match.season.currentMatchday}</p>
          )}
        </div>
        <div className="text-xs text-slate-400">
          <p>{matchTime}</p>
          {match.venue && <p className="mt-1">{match.venue}</p>}
        </div>
      </div>
    </div>
  )
}

export default memo(MatchCard)
