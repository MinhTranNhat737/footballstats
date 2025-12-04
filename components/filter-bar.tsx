"use client"

import { useState } from "react"
import { Filter, X, Calendar, Trophy } from "lucide-react"

interface FilterBarProps {
  activeTab: 'all' | 'live' | 'upcoming' | 'today'
  onTabChange: (tab: 'all' | 'live' | 'upcoming' | 'today') => void
  totalCount: number
  liveCount: number
  upcomingCount: number
  todayCount: number
  filters: {
    competitions: string[]
    dateRange: 'today' | 'week' | 'month' | 'all'
  }
  setFilters: (filters: any) => void
  availableCompetitions: string[]
}

export default function FilterBar({
  activeTab, 
  onTabChange, 
  totalCount, 
  liveCount, 
  upcomingCount, 
  todayCount,
  filters,
  setFilters,
  availableCompetitions
}: FilterBarProps) {
  const [showCompetitionDropdown, setShowCompetitionDropdown] = useState(false)
  const [showDateDropdown, setShowDateDropdown] = useState(false)

  // Safety check
  const safeFilters = filters || {
    competitions: [],
    dateRange: 'week' as const
  }

  const tabs = [
    {
      id: 'all' as const,
      label: 'Tất cả',
      count: totalCount,
      icon: '🏆',
      color: 'bg-blue-600'
    },
    {
      id: 'live' as const, 
      label: 'Đang diễn ra',
      count: liveCount,
      icon: '🔴',
      color: 'bg-red-600'
    },
    {
      id: 'upcoming' as const,
      label: 'Sắp diễn ra', 
      count: upcomingCount,
      icon: '⏰',
      color: 'bg-green-600'
    },
    {
      id: 'today' as const,
      label: 'Hôm nay',
      count: todayCount,
      icon: '📅',
      color: 'bg-purple-600'
    }
  ]

  const dateRangeOptions = [
    { value: 'today', label: 'Hôm nay' },
    { value: 'week', label: 'Tuần này' },
    { value: 'month', label: 'Tháng này' },
    { value: 'all', label: 'Tất cả' }
  ]

  const toggleCompetition = (competition: string) => {
    setFilters({
      ...safeFilters,
      competitions: safeFilters.competitions.includes(competition)
        ? safeFilters.competitions.filter((c) => c !== competition)
        : [...safeFilters.competitions, competition],
    })
  }

  const clearCompetitionFilters = () => {
    setFilters({
      ...safeFilters,
      competitions: []
    })
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Status Tabs */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${
                activeTab === tab.id
                  ? `${tab.color} text-white shadow-lg scale-105`
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <div className="text-left">
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs opacity-75">({tab.count})</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Competition Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowCompetitionDropdown(!showCompetitionDropdown)
              setShowDateDropdown(false)
            }}
            className="px-4 py-2 bg-slate-800/70 border border-slate-600 rounded-lg text-white hover:bg-slate-700/70 transition-colors flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            <span>
              {safeFilters.competitions.length > 0 
                ? `${safeFilters.competitions.length} giải đấu`
                : 'Chọn giải đấu'
              }
            </span>
            <Filter className="w-4 h-4" />
          </button>

          {showCompetitionDropdown && (
            <div className="absolute top-full mt-2 w-80 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
              <div className="p-3 border-b border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Chọn giải đấu</span>
                  {safeFilters.competitions.length > 0 && (
                    <button
                      onClick={clearCompetitionFilters}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Xóa hết
                    </button>
                  )}
                </div>
              </div>
              <div className="p-2 space-y-1">
                {availableCompetitions.map((comp) => (
                  <label key={comp} className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={safeFilters.competitions.includes(comp)}
                      onChange={() => toggleCompetition(comp)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-600 focus:ring-blue-500"
                    />
                    <span className="text-white text-sm">{comp}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date Range Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDateDropdown(!showDateDropdown)
              setShowCompetitionDropdown(false)
            }}
            className="px-4 py-2 bg-slate-800/70 border border-slate-600 rounded-lg text-white hover:bg-slate-700/70 transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>
              {dateRangeOptions.find(opt => opt.value === safeFilters.dateRange)?.label || 'Tuần này'}
            </span>
            <Filter className="w-4 h-4" />
          </button>

          {showDateDropdown && (
            <div className="absolute top-full mt-2 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50">
              <div className="p-2 space-y-1">
                {dateRangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilters({
                        ...safeFilters,
                        dateRange: option.value
                      })
                      setShowDateDropdown(false)
                    }}
                    className={`w-full text-left p-2 rounded text-sm transition-colors ${
                      safeFilters.dateRange === option.value
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {(safeFilters.competitions.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {safeFilters.competitions.map((comp) => (
              <span key={comp} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm">
                {comp}
                <button
                  onClick={() => toggleCompetition(comp)}
                  className="ml-1 hover:bg-blue-500/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(showCompetitionDropdown || showDateDropdown) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowCompetitionDropdown(false)
            setShowDateDropdown(false)
          }}
        />
      )}
    </div>
  )
}