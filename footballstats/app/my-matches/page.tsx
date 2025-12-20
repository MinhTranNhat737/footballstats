"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Header from "@/components/header"
import MatchList from "@/components/match-list"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, Calendar, TrendingUp } from "lucide-react"

interface Match {
  id: number
  utcDate: string
  status: string
  homeTeam: {
    id: number
    name: string
    crest: string
  }
  awayTeam: {
    id: number
    name: string
    crest: string
  }
  score: {
    fullTime: {
      home: number | null
      away: number | null
    }
  }
  competition: {
    name: string
    emblem: string
  }
}

export default function MyMatchesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [favoriteClubs, setFavoriteClubs] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        setLoading(true)
        
        // Lấy danh sách câu lạc bộ yêu thích
        const token = localStorage.getItem("auth_token")
        const favResponse = await fetch("/api/user/favorite-clubs", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (favResponse.ok) {
          const favData = await favResponse.json()
          setFavoriteClubs(favData.favoriteClubs || [])

          // Nếu có câu lạc bộ yêu thích, lấy trận đấu
          if (favData.favoriteClubs && favData.favoriteClubs.length > 0) {
            console.log('🏟️ Lấy trận đấu cho CLB:', favData.favoriteClubs)
            
            // Lấy matches trong 30 ngày qua và 30 ngày tới
            const today = new Date()
            const dateFrom = new Date(today)
            dateFrom.setDate(dateFrom.getDate() - 30)
            const dateTo = new Date(today)
            dateTo.setDate(dateTo.getDate() + 30)
            
            const matchesUrl = `/api/matches?dateFrom=${dateFrom.toISOString().split('T')[0]}&dateTo=${dateTo.toISOString().split('T')[0]}`
            console.log('🔗 Fetching:', matchesUrl)
            
            const matchesResponse = await fetch(matchesUrl)
            console.log('📡 Matches API status:', matchesResponse.status)
            
            if (matchesResponse.ok) {
              const matchesData = await matchesResponse.json()
              console.log('📊 Total matches từ API:', matchesData.matches?.length || 0)
              
              if (matchesData.matches && matchesData.matches.length > 0) {
                console.log('🔍 Sample match:', {
                  home: matchesData.matches[0].homeTeam.name,
                  away: matchesData.matches[0].awayTeam.name,
                  date: matchesData.matches[0].utcDate
                })
              }
              
              // Lọc các trận đấu có team trong danh sách yêu thích
              const filteredMatches = matchesData.matches.filter((match: Match) => {
                const homeMatch = favData.favoriteClubs.includes(match.homeTeam.name)
                const awayMatch = favData.favoriteClubs.includes(match.awayTeam.name)
                if (homeMatch || awayMatch) {
                  console.log('✅ Match found:', match.homeTeam.name, 'vs', match.awayTeam.name)
                }
                return homeMatch || awayMatch
              })
              
              console.log('✅ Filtered matches:', filteredMatches.length)
              
              setMatches(filteredMatches)
            } else {
              const errorText = await matchesResponse.text()
              console.error('❌ Matches API failed:', matchesResponse.status, errorText)
            }
          } else {
            console.log('⚠️ Không có CLB yêu thích')
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Không thể tải dữ liệu")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  const upcomingMatches = matches.filter(m => m.status === "SCHEDULED" || m.status === "TIMED")
  const liveMatches = matches.filter(m => m.status === "IN_PLAY" || m.status === "PAUSED")
  const finishedMatches = matches.filter(m => m.status === "FINISHED")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Trận đấu của câu lạc bộ yêu thích
              </h1>
              <p className="text-slate-400 mt-1">
                Theo dõi các trận đấu của {favoriteClubs.length} đội bóng yêu thích
              </p>
            </div>
          </div>

          {favoriteClubs.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {favoriteClubs.map((club) => (
                <div
                  key={club}
                  className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-300"
                >
                  {club}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : favoriteClubs.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/50 rounded-full mb-4">
              <Heart className="w-10 h-10 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Chưa có câu lạc bộ yêu thích
            </h2>
            <p className="text-slate-400 mb-6">
              Thêm câu lạc bộ yêu thích để xem các trận đấu của họ
            </p>
            <button
              onClick={() => router.push("/profile")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              Thêm câu lạc bộ yêu thích
            </button>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/50 rounded-full mb-4">
              <Calendar className="w-10 h-10 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Không có trận đấu nào
            </h2>
            <p className="text-slate-400">
              Hiện tại không có trận đấu nào của các đội bóng yêu thích
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Live Matches */}
            {liveMatches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <h2 className="text-xl font-bold text-white">
                    Đang diễn ra ({liveMatches.length})
                  </h2>
                </div>
                <MatchList matches={liveMatches} />
              </div>
            )}

            {/* Upcoming Matches */}
            {upcomingMatches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <h2 className="text-xl font-bold text-white">
                    Sắp diễn ra ({upcomingMatches.length})
                  </h2>
                </div>
                <MatchList matches={upcomingMatches} />
              </div>
            )}

            {/* Finished Matches */}
            {finishedMatches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <h2 className="text-xl font-bold text-white">
                    Đã kết thúc ({finishedMatches.length})
                  </h2>
                </div>
                <MatchList matches={finishedMatches} />
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 py-8">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
