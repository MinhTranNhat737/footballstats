"use client"
import { useState, useEffect } from "react"
import type { Match } from "@/types/match"
import { X, Calendar, MapPin, Users, Target, Clock, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"

interface MatchDetailModalProps {
  match: Match
  onClose: () => void
}

function getStatusInfo(status: Match["status"]) {
  switch (status) {
    case "FINISHED":
      return { text: "Kết thúc", className: "bg-emerald-500/20 text-emerald-400" }
    case "IN_PLAY":
    case "PAUSED":
      return { text: "Đang diễn ra", className: "bg-red-500/20 text-red-400" }
    case "SCHEDULED":
    case "TIMED":
      return { text: "Sắp diễn ra", className: "bg-blue-500/20 text-blue-400" }
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

export default function MatchDetailModal({ match, onClose }: MatchDetailModalProps) {
  const [detailedMatch, setDetailedMatch] = useState<Match | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch(`/api/matches/${match.id}`)
        
        if (!response.ok) {
          // Handle different HTTP status codes
          if (response.status === 400) {
            throw new Error('Yêu cầu không hợp lệ - ID trận đấu có thể không đúng')
          } else if (response.status === 429) {
            throw new Error('Quá nhiều yêu cầu - vui lòng thử lại sau')
          } else if (response.status === 403) {
            throw new Error('Không có quyền truy cập API')
          } else {
            throw new Error(`Lỗi API: ${response.status}`)
          }
        }

        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }
        
        setDetailedMatch(data.match || match) // Fallback to basic match if no detailed data
        console.log('📊 Match details loaded:', data.match?.goals?.length || 0, 'goals')
        
      } catch (err) {
        console.error('❌ Error fetching match details:', err)
        setError(err instanceof Error ? err.message : 'Lỗi không xác định')
        setDetailedMatch(match) // Fallback to basic match
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatchDetails()
  }, [match.id, match])

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
          <Spinner className="w-8 h-8 mb-4 mx-auto" />
          <p className="text-slate-400">Đang tải thông tin chi tiết...</p>
        </div>
      </div>
    )
  }

  const displayMatch = detailedMatch || match
  const statusInfo = getStatusInfo(displayMatch.status)
  const isFinished = displayMatch.status === "FINISHED"
  const isLive = displayMatch.status === "IN_PLAY" || displayMatch.status === "PAUSED"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="bg-slate-800 rounded-lg border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 border-b border-slate-700 bg-slate-800 p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {displayMatch.competition?.emblem && (
              <img
                src={displayMatch.competition.emblem}
                alt={displayMatch.competition.name}
                className="w-8 h-8 object-contain"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
            <h2 className="text-xl md:text-2xl font-bold text-white">{displayMatch.competition?.name || 'Giải đấu'}</h2>
            <Badge className={statusInfo.className}>
              {statusInfo.text}
            </Badge>
            {isLive && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-red-400 font-medium">LIVE</span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg group">
            <X className="w-5 h-5 text-slate-400 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-6">
          {/* Score Section */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="flex flex-col items-center gap-3">
                {displayMatch.homeTeam?.crest && (
                  <img
                    src={displayMatch.homeTeam.crest}
                    alt={displayMatch.homeTeam?.name || 'Home team'}
                    className="w-16 h-16 object-contain transition-transform duration-500 hover:scale-110"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <div className="text-center">
                  <h3 className="font-bold text-white text-lg">{displayMatch.homeTeam?.name || 'Home Team'}</h3>
                  <p className="text-slate-400 text-sm">{displayMatch.homeTeam?.tla || ''}</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-5xl font-bold text-white mb-2 min-w-32 text-center">
                  {isFinished || isLive 
                    ? `${displayMatch.score?.fullTime?.home ?? 0} - ${displayMatch.score?.fullTime?.away ?? 0}`
                    : "VS"
                  }
                </div>
                {isFinished && displayMatch.score?.halfTime?.home !== null && displayMatch.score?.halfTime?.away !== null && (
                  <div className="text-emerald-400 text-sm">
                    HT: {displayMatch.score.halfTime.home} - {displayMatch.score.halfTime.away}
                  </div>
                )}
                {displayMatch.score?.extraTime && (
                  <div className="text-yellow-400 text-sm mt-1">
                    ET: {displayMatch.score.extraTime.home} - {displayMatch.score.extraTime.away}
                  </div>
                )}
                {displayMatch.score?.penalties && (
                  <div className="text-purple-400 text-sm mt-1">
                    PEN: {displayMatch.score.penalties.home} - {displayMatch.score.penalties.away}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-3">
                {displayMatch.awayTeam?.crest && (
                  <img
                    src={displayMatch.awayTeam.crest}
                    alt={displayMatch.awayTeam?.name || 'Away team'}
                    className="w-16 h-16 object-contain"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <div className="text-center">
                  <h3 className="font-bold text-white text-lg">{displayMatch.awayTeam?.name || 'Away Team'}</h3>
                  <p className="text-slate-400 text-sm">{displayMatch.awayTeam?.tla || ''}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Match Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400 mb-1">Ngày giờ</p>
                <p className="font-semibold text-white text-sm">
                  {displayMatch.utcDate ? (
                    (() => {
                      try {
                        const date = new Date(displayMatch.utcDate)
                        return isNaN(date.getTime()) ? 'Thời gian không hợp lệ' : format(date, "PPPp", { locale: vi })
                      } catch {
                        return 'Thời gian không hợp lệ'
                      }
                    })()
                  ) : 'Chưa xác định'}
                </p>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4 flex items-center gap-3">
              <Target className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-xs text-slate-400 mb-1">Vòng đấu</p>
                <p className="font-semibold text-white text-sm">
                  {displayMatch.matchday ? `Vòng ${displayMatch.matchday}` : displayMatch.stage || 'Không xác định'}
                </p>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-xs text-slate-400 mb-1">Thời lượng</p>
                <p className="font-semibold text-white text-sm">{displayMatch.score?.duration || "90'"}</p>
              </div>
            </div>
          </div>

          {/* Venue & Referees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Venue */}
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                Sân vận động
              </h4>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-white font-medium">{displayMatch.venue || "Chưa xác định"}</p>
              </div>
            </div>

            {/* Referees */}
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-yellow-400" />
                Trọng tài
              </h4>
              <div className="bg-slate-700/50 rounded-lg p-4">
                {displayMatch.referees && displayMatch.referees.length > 0 ? (
                  <div className="space-y-2">
                    {displayMatch.referees.map((ref, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-white font-medium">{ref.name || 'Không rõ'}</span>
                        <Badge variant="outline" className="text-xs">
                          {ref.type || 'REFEREE'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">Thông tin trọng tài chưa có</p>
                )}
              </div>
            </div>
          </div>

          {/* Goals & Events */}
          {displayMatch.goals && displayMatch.goals.length > 0 ? (
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Bàn thắng ({displayMatch.goals.length})
              </h4>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="space-y-3">
                  {displayMatch.goals.map((goal, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-slate-600 pb-2 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className="text-green-400 font-bold min-w-12">
                          {goal.minute}{goal.injuryTime ? `+${goal.injuryTime}` : ""}'
                        </span>
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{goal.scorer?.name || 'Không rõ'}</span>
                          {goal.assist && (
                            <span className="text-slate-400 text-sm">Kiến tạo: {goal.assist.name}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{goal.type || 'REGULAR'}</Badge>
                        <span className="text-slate-400 text-xs">{goal.team?.name || 'Không rõ'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : isFinished && displayMatch.score?.fullTime?.home !== null && displayMatch.score?.fullTime?.away !== null && (displayMatch.score.fullTime.home + displayMatch.score.fullTime.away > 0) ? (
            <div className="bg-slate-700/20 border border-slate-600/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Target className="w-5 h-5" />
                <span>Chi tiết bàn thắng chưa có sẵn từ API</span>
              </div>
            </div>
          ) : null}

          {/* Bookings */}
          {displayMatch.bookings && displayMatch.bookings.length > 0 ? (
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Thẻ phạt ({displayMatch.bookings.length})
              </h4>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="space-y-3">
                  {displayMatch.bookings.map((booking, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-slate-600 pb-2 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className="text-yellow-400 font-bold min-w-12">
                          {booking.minute}'
                        </span>
                        <span className="text-white font-medium">{booking.player?.name || 'Không rõ'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            booking.card === 'YELLOW_CARD' 
                              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }`}
                        >
                          {booking.card === 'YELLOW_CARD' ? '🟨' : '🟥'} {booking.card?.replace('_', ' ') || 'CARD'}
                        </Badge>
                        <span className="text-slate-400 text-xs">{booking.team?.name || 'Không rõ'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : isFinished ? (
            <div className="bg-slate-700/20 border border-slate-600/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <AlertTriangle className="w-5 h-5" />
                <span>Không có thẻ phạt hoặc thông tin chưa có sẵn</span>
              </div>
            </div>
          ) : null}

          {/* Substitutions */}
          {displayMatch.substitutions && displayMatch.substitutions.length > 0 ? (
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Thay người ({displayMatch.substitutions.length})
              </h4>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="space-y-3">
                  {displayMatch.substitutions.map((sub, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-slate-600 pb-2 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className="text-blue-400 font-bold min-w-12">
                          {sub.minute}'
                        </span>
                        <div className="flex flex-col">
                          <div className="text-white text-sm">
                            <span className="text-green-400">🔺 {sub.playerIn?.name || 'Không rõ'}</span>
                          </div>
                          <div className="text-slate-400 text-sm">
                            <span className="text-red-400">🔻 {sub.playerOut?.name || 'Không rõ'}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-slate-400 text-xs">{sub.team?.name || 'Không rõ'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : isFinished ? (
            <div className="bg-slate-700/20 border border-slate-600/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Users className="w-5 h-5" />
                <span>Thông tin thay người chưa có sẵn từ API</span>
              </div>
            </div>
          ) : null}

          {/* API Note */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-blue-300 text-sm">
                <p className="font-medium mb-1">📡 Thông tin từ Football Data API</p>
                <p className="text-blue-300/80 text-xs">
                  Chi tiết trận đấu (bàn thắng, thẻ phạt, thay người) có thể không có sẵn cho tất cả trận đấu. 
                  Dữ liệu được cập nhật liên tục từ các giải đấu chính thức.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">⚠️ {error}</p>
              <p className="text-slate-400 text-xs mt-1">Hiển thị thông tin cơ bản từ cache</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}