"use client"

import { useState, useEffect } from "react"
import { COMPETITION_IDS } from "@/lib/api/football-api"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import type { Standing, TopScorer } from "@/types/match"

const COMPETITIONS = [
  { id: COMPETITION_IDS.PREMIER_LEAGUE, name: "Premier League" },
  { id: COMPETITION_IDS.LA_LIGA, name: "La Liga" },
  { id: COMPETITION_IDS.BUNDESLIGA, name: "Bundesliga" },
  { id: COMPETITION_IDS.SERIE_A, name: "Serie A" },
  { id: COMPETITION_IDS.LIGUE_1, name: "Ligue 1" },
  { id: COMPETITION_IDS.CHAMPIONS_LEAGUE, name: "Champions League" },
]

function StandingsTable({ standings }: { standings: Standing[] }) {
  return (
    <div className="space-y-6">
      {standings.map((standing, idx) => (
        <Card key={idx} className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              {standing.group ? `${standing.group}` : "Bảng xếp hạng"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400">
                    <th className="text-left p-2">Hạng</th>
                    <th className="text-left p-2">Đội</th>
                    <th className="text-center p-2">Trận</th>
                    <th className="text-center p-2">Thắng</th>
                    <th className="text-center p-2">Hòa</th>
                    <th className="text-center p-2">Thua</th>
                    <th className="text-center p-2">Hiệu số</th>
                    <th className="text-center p-2">Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {standing.table.map((team) => (
                    <tr key={team.team.id} className="border-b border-slate-800 hover:bg-slate-700/30">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{team.position}</span>
                          {team.position <= 4 && (
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                              CL
                            </Badge>
                          )}
                          {team.position >= standing.table.length - 2 && standing.type === "TOTAL" && (
                            <Badge variant="destructive" className="bg-red-500/20 text-red-400">
                              REL
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {team.team?.crest && (
                            <img
                              src={team.team.crest}
                              alt={team.team.name}
                              className="w-6 h-6 object-contain"
                              onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                          )}
                          <span className="text-white font-medium">{team.team.name}</span>
                        </div>
                      </td>
                      <td className="text-center p-2 text-slate-300">{team.playedGames}</td>
                      <td className="text-center p-2 text-green-400">{team.won}</td>
                      <td className="text-center p-2 text-yellow-400">{team.draw}</td>
                      <td className="text-center p-2 text-red-400">{team.lost}</td>
                      <td className="text-center p-2 text-slate-300">
                        <span className={team.goalDifference > 0 ? "text-green-400" : team.goalDifference < 0 ? "text-red-400" : "text-slate-300"}>
                          {team.goalDifference > 0 ? "+" : ""}{team.goalDifference}
                        </span>
                      </td>
                      <td className="text-center p-2">
                        <span className="font-bold text-white">{team.points}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function TopScorersTable({ scorers }: { scorers: TopScorer[] }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-white">Vua phá lưới</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="text-left p-2">Hạng</th>
                <th className="text-left p-2">Cầu thủ</th>
                <th className="text-left p-2">Đội</th>
                <th className="text-center p-2">Bàn thắng</th>
                <th className="text-center p-2">Kiến tạo</th>
              </tr>
            </thead>
            <tbody>
              {scorers.map((scorer, idx) => (
                <tr key={scorer.player.id} className="border-b border-slate-800 hover:bg-slate-700/30">
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{idx + 1}</span>
                      {idx < 3 && (
                        <Badge 
                          variant="secondary" 
                          className={
                            idx === 0 ? "bg-yellow-500/20 text-yellow-400" :
                            idx === 1 ? "bg-gray-400/20 text-gray-400" :
                            "bg-orange-500/20 text-orange-400"
                          }
                        >
                          {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-2">
                    <div>
                      <span className="text-white font-medium">{scorer.player.name}</span>
                      <p className="text-xs text-slate-400">{scorer.player.nationality}</p>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-3">
                      {scorer.team?.crest && (
                        <img
                          src={scorer.team.crest}
                          alt={scorer.team.name}
                          className="w-5 h-5 object-contain"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      )}
                      <span className="text-slate-300">{scorer.team.name}</span>
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <span className="font-bold text-green-400 text-lg">{scorer.goals}</span>
                  </td>
                  <td className="text-center p-2 text-slate-300">{scorer.assists || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default function StandingsPage() {
  const [selectedCompetition, setSelectedCompetition] = useState<string>(COMPETITION_IDS.PREMIER_LEAGUE)
  const [activeTab, setActiveTab] = useState("standings")
  const [showCompetitionDropdown, setShowCompetitionDropdown] = useState(false)
  
  // Direct API calls instead of hooks
  const [standings, setStandings] = useState<Standing[]>([])
  const [scorers, setScorers] = useState<TopScorer[]>([])
  const [standingsLoading, setStandingsLoading] = useState(true)
  const [scorersLoading, setScorersLoading] = useState(true)
  const [standingsError, setStandingsError] = useState<string | null>(null)
  const [scorersError, setScorersError] = useState<string | null>(null)

  // Fetch standings data
  useEffect(() => {
    const fetchStandings = async () => {
      setStandingsLoading(true)
      setStandingsError(null)
      try {
        const response = await fetch(`/api/competitions/${selectedCompetition}/standings`)
        const data = await response.json()
        setStandings(data.standings || [])
      } catch (error) {
        setStandingsError('Không thể tải bảng xếp hạng')
      } finally {
        setStandingsLoading(false)
      }
    }
    fetchStandings()
  }, [selectedCompetition])

  // Fetch top scorers data
  useEffect(() => {
    const fetchScorers = async () => {
      setScorersLoading(true)
      setScorersError(null)
      try {
        const response = await fetch(`/api/competitions/${selectedCompetition}/scorers`)
        const data = await response.json()
        setScorers(data.scorers || [])
      } catch (error) {
        setScorersError('Không thể tải danh sách ghi bàn')
      } finally {
        setScorersLoading(false)
      }
    }
    fetchScorers()
  }, [selectedCompetition])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">Bảng xếp hạng & Thống kê</h1>
          
          <div className="relative">
            <button
              onClick={() => setShowCompetitionDropdown(!showCompetitionDropdown)}
              className="w-64 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg text-left flex items-center justify-between hover:bg-slate-700 transition-colors"
            >
              <span>{COMPETITIONS.find(comp => comp.id === selectedCompetition)?.name || "Chọn giải đấu"}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showCompetitionDropdown && (
              <div className="absolute top-full mt-1 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                {COMPETITIONS.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      setSelectedCompetition(comp.id)
                      setShowCompetitionDropdown(false)
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      selectedCompetition === comp.id ? "bg-slate-700 text-blue-400" : "text-white"
                    }`}
                  >
                    {comp.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-2 max-w-md bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
            <button 
              onClick={() => setActiveTab("standings")}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === "standings" 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              🏆 Bảng xếp hạng
            </button>
            <button 
              onClick={() => setActiveTab("scorers")}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === "scorers" 
                  ? "bg-green-600 text-white shadow-lg" 
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              ⚽ Vua phá lưới
            </button>
          </div>

          <div className="mt-6">
            {activeTab === "standings" && (
              <div>
                {standingsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Spinner className="w-8 h-8 mb-4 mx-auto" />
                      <p className="text-slate-400">Đang tải bảng xếp hạng...</p>
                    </div>
                  </div>
                ) : standingsError ? (
                  <div className="text-center py-12">
                    <p className="text-red-400 mb-4">{standingsError}</p>
                  </div>
                ) : (
                  <StandingsTable standings={standings} />
                )}
              </div>
            )}
            
            {activeTab === "scorers" && (
              <div>
                {scorersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Spinner className="w-8 h-8 mb-4 mx-auto" />
                      <p className="text-slate-400">Đang tải danh sách ghi bàn...</p>
                    </div>
                  </div>
                ) : scorersError ? (
                  <div className="text-center py-12">
                    <p className="text-red-400 mb-4">{scorersError}</p>
                  </div>
                ) : (
                  <TopScorersTable scorers={scorers} />
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Click outside to close dropdown */}
        {showCompetitionDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowCompetitionDropdown(false)}
          />
        )}
      </main>
    </div>
  )
}