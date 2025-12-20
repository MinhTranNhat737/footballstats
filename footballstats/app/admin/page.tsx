"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Header from "@/components/header"
import { Spinner } from "@/components/ui/spinner"
import { Shield, Bug, RefreshCw, Database, Server, Activity, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin, user } = useAuth()
  const [systemInfo, setSystemInfo] = useState({
    matches: 0,
    loading: false,
    error: null as string | null,
    lastUpdate: new Date().toLocaleString()
  })

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else if (!isAdmin) {
      router.push('/')
    }
  }, [isAuthenticated, isAdmin, router])

  // Show loading while checking auth
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Spinner className="mx-auto mb-4" />
          <p className="text-white">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    )
  }

  const fetchSystemInfo = async () => {
    setSystemInfo(prev => ({ ...prev, loading: true, error: null }))
    try {
      const response = await fetch('/api/football?endpoint=/matches')
      const data = await response.json()
      
      setSystemInfo({
        matches: data.matches?.length || 0,
        loading: false,
        error: data.error || null,
        lastUpdate: new Date().toLocaleString()
      })
    } catch (error) {
      setSystemInfo(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }))
    }
  }

  const handleForceReload = () => {
    window.location.reload()
  }

  const clearCache = async () => {
    try {
      // Clear browser cache
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
      }
      alert('Cache đã được xóa!')
    } catch (error) {
      alert('Không thể xóa cache: ' + error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
              <p className="text-slate-400">Quản lý và giám sát hệ thống</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Đăng nhập với:</span>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30 font-semibold">
              {user?.username}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Force Reload</h3>
                <p className="text-slate-400 text-sm">Tải lại toàn bộ trang</p>
              </div>
              <Button
                onClick={handleForceReload}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Reload
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Clear Cache</h3>
                <p className="text-slate-400 text-sm">Xóa cache trình duyệt</p>
              </div>
              <Button
                onClick={clearCache}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Clear
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Server className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Test API</h3>
                <p className="text-slate-400 text-sm">Kiểm tra kết nối API</p>
              </div>
              <Button
                onClick={fetchSystemInfo}
                disabled={systemInfo.loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {systemInfo.loading ? <Spinner className="w-4 h-4" /> : 'Test'}
              </Button>
            </div>
          </Card>
        </div>

        {/* System Information */}
        <Card className="p-6 bg-slate-800/50 border-slate-700 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Thông tin hệ thống</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="text-slate-400 text-sm mb-1">Trạng thái</div>
              <div className="text-white font-semibold text-lg">
                {systemInfo.loading ? 'Đang tải...' : 'Hoạt động'}
              </div>
            </div>
            
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="text-slate-400 text-sm mb-1">Số trận đấu</div>
              <div className="text-white font-semibold text-lg">{systemInfo.matches}</div>
            </div>
            
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="text-slate-400 text-sm mb-1">Cập nhật lần cuối</div>
              <div className="text-white font-semibold text-sm">{systemInfo.lastUpdate}</div>
            </div>
            
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="text-slate-400 text-sm mb-1">Client-side</div>
              <div className="text-white font-semibold text-lg">
                {typeof window !== 'undefined' ? '✅ Active' : '❌ Inactive'}
              </div>
            </div>
          </div>
          
          {systemInfo.error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-red-400 font-semibold mb-1">Lỗi API</div>
                <div className="text-red-300 text-sm">{systemInfo.error}</div>
              </div>
            </div>
          )}
        </Card>

        {/* Debug Information */}
        <Card className="p-6 bg-slate-800/50 border-yellow-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Bug className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Debug Information</h2>
          </div>
          
          <div className="space-y-3">
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 font-mono text-sm">
              <div className="text-slate-400">Window Type:</div>
              <div className="text-white">{typeof window}</div>
            </div>
            
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 font-mono text-sm">
              <div className="text-slate-400">User Agent:</div>
              <div className="text-white break-all">{typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</div>
            </div>
            
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 font-mono text-sm">
              <div className="text-slate-400">Current Date:</div>
              <div className="text-white">{new Date().toISOString()}</div>
            </div>
            
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 font-mono text-sm">
              <div className="text-slate-400">Screen Resolution:</div>
              <div className="text-white">
                {typeof window !== 'undefined' ? `${window.innerWidth} x ${window.innerHeight}` : 'N/A'}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
