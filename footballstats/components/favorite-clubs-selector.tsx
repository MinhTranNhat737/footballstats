"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, X, Plus, Save, Loader2 } from "lucide-react"
import SearchableSelect from "@/components/searchable-select"

const POPULAR_CLUBS = [
  'Real Madrid CF', 'FC Barcelona', 'Manchester City FC', 'Manchester United FC',
  'Liverpool FC', 'Chelsea FC', 'Arsenal FC', 'Tottenham Hotspur FC',
  'Bayern Munich', 'Borussia Dortmund', 'RB Leipzig', 'Bayer Leverkusen',
  'Paris Saint-Germain', 'Olympique Marseille', 'AS Monaco FC', 'Olympique Lyon',
  'Juventus FC', 'Inter Milan', 'AC Milan', 'SSC Napoli', 'AS Roma',
  'Atlético Madrid', 'Sevilla FC', 'Valencia CF', 'Real Betis',
  'Ajax Amsterdam', 'PSV Eindhoven', 'Feyenoord Rotterdam',
  'SL Benfica', 'FC Porto', 'Sporting CP',
  'Al Nassr FC', 'Al Hilal SFC', 'Al Ittihad Club',
  'Inter Miami CF', 'LA Galaxy', 'New York City FC'
].sort()

export default function FavoriteClubsSelector() {
  const { user, token, isAuthenticated } = useAuth()
  const [favoriteClubs, setFavoriteClubs] = useState<string[]>([])
  const [newClub, setNewClub] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchFavoriteClubs()
    }
  }, [isAuthenticated, token])

  const fetchFavoriteClubs = async () => {
    try {
      setIsLoading(true)
      console.log('🔍 Fetching favorite clubs, token:', token ? 'exists' : 'missing')
      const response = await fetch('/api/user/favorite-clubs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      console.log('📥 Response:', data)
      if (data.success) {
        setFavoriteClubs(data.favoriteClubs || [])
      }
    } catch (error) {
      console.error('Error fetching favorite clubs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddClub = () => {
    if (newClub && !favoriteClubs.includes(newClub)) {
      setFavoriteClubs([...favoriteClubs, newClub])
      setNewClub("")
    }
  }

  const handleRemoveClub = (club: string) => {
    setFavoriteClubs(favoriteClubs.filter(c => c !== club))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setMessage("")
      
      console.log('💾 Đang lưu', favoriteClubs.length, 'câu lạc bộ...')
      
      const response = await fetch('/api/user/favorite-clubs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ favoriteClubs })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        console.error('❌ Lỗi API:', data)
        if (response.status === 401) {
          setMessage("❌ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!")
        } else {
          setMessage("❌ Lỗi khi lưu: " + (data.error || 'Unknown error'))
        }
        return
      }
      
      if (data.success) {
        console.log('✅ Đã thêm CLB thành công!', data.favoriteClubs)
        setMessage(`✅ Đã lưu ${favoriteClubs.length} câu lạc bộ yêu thích!`)
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      console.error('❌ Exception:', error)
      setMessage("❌ Lỗi kết nối!")
    } finally {
      setIsSaving(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <Card className="p-6 bg-slate-800/50 backdrop-blur border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Câu lạc bộ yêu thích</h2>
          <p className="text-sm text-slate-400">Theo dõi các đội bóng bạn yêu thích</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : (
        <>
          {/* Add New Club */}
          <div className="mb-4">
            <label className="block text-sm text-slate-300 mb-2">Thêm câu lạc bộ</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <SearchableSelect
                  options={POPULAR_CLUBS.filter(club => !favoriteClubs.includes(club))}
                  value={newClub}
                  onChange={setNewClub}
                  placeholder="Chọn câu lạc bộ..."
                />
              </div>
              <Button
                onClick={handleAddClub}
                disabled={!newClub}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Favorite Clubs List */}
          {favoriteClubs.length > 0 ? (
            <div className="space-y-2 mb-4">
              <label className="block text-sm text-slate-300">Danh sách yêu thích ({favoriteClubs.length})</label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {favoriteClubs.map((club, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-pink-500/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                      <span className="text-white font-medium">{club}</span>
                    </div>
                    <Button
                      onClick={() => handleRemoveClub(club)}
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Chưa có câu lạc bộ yêu thích</p>
              <p className="text-xs mt-1">Thêm các đội bóng bạn yêu thích để theo dõi</p>
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>

          {message && (
            <div className="mt-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700 text-center text-sm text-slate-300">
              {message}
            </div>
          )}
        </>
      )}
    </Card>
  )
}
