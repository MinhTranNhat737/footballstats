"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Header from "@/components/header"
import FavoriteClubsSelector from "@/components/favorite-clubs-selector"
import { Spinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"
import { User, Mail, Shield, Calendar, Heart } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Spinner className="mx-auto mb-4" />
          <p className="text-white">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Thông tin cá nhân
              </h1>
              <p className="text-slate-400 text-sm">Quản lý tài khoản và sở thích của bạn</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-slate-800/50 backdrop-blur border-slate-700">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{user?.username}</h2>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30 text-sm">
                    <Shield className="w-3 h-3" />
                    ADMIN
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-xs text-slate-500">Email</div>
                    <div className="text-white font-medium">{user?.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                  <User className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-xs text-slate-500">Username</div>
                    <div className="text-white font-medium">{user?.username}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-xs text-slate-500">Vai trò</div>
                    <div className="text-white font-medium">{isAdmin ? 'Administrator' : 'User'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="text-xs text-slate-500">Tham gia</div>
                    <div className="text-white font-medium">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Favorite Clubs */}
          <div className="lg:col-span-2">
            <FavoriteClubsSelector />
          </div>
        </div>
      </div>
    </div>
  )
}
