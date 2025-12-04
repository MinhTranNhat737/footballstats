"use client"

import { useState } from "react"
import { X, Eye, EyeOff } from "lucide-react"

interface AdSidebarProps {
  position: "left" | "right"
}

export default function AdSidebar({ position }: AdSidebarProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!isVisible) {
    return (
      <div className={`hidden xl:block fixed top-20 ${position === "left" ? "left-2" : "right-2"} z-30`}>
        <button
          onClick={() => setIsVisible(true)}
          className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg border border-slate-600 transition-colors"
        >
          <Eye className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    )
  }

  return (
    <div className={`hidden xl:block fixed top-20 ${position === "left" ? "left-2" : "right-2"} z-30 transition-all duration-300 ${isCollapsed ? "w-12" : "w-64"}`}>
      <div className="bg-slate-900/95 border border-slate-700/50 rounded-lg backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-700/50">
          {!isCollapsed && (
            <span className="text-xs font-medium text-slate-400">QUẢNG CÁO</span>
          )}
          <div className="flex gap-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
            >
              <EyeOff className="w-3 h-3 text-slate-500" />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
            >
              <X className="w-3 h-3 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="p-3 space-y-4">
            {/* Ad 1 */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-4 rounded-lg border border-blue-500/30">
              <h4 className="text-sm font-semibold text-blue-400 mb-2">⚽ LiveScore Pro</h4>
              <p className="text-xs text-slate-300 mb-3">Theo dõi tỷ số trực tiếp tất cả giải đấu hàng đầu</p>
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 rounded transition-colors">
                Tải ngay
              </button>
            </div>

            {/* Ad 2 */}
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-4 rounded-lg border border-green-500/30">
              <h4 className="text-sm font-semibold text-green-400 mb-2">🎯 BetMaster</h4>
              <p className="text-xs text-slate-300 mb-3">Tỷ lệ cược tốt nhất cho mọi trận đấu</p>
              <button className="w-full bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded transition-colors">
                Đăng ký
              </button>
            </div>

            {/* Ad 3 */}
            <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 p-4 rounded-lg border border-orange-500/30">
              <h4 className="text-sm font-semibold text-orange-400 mb-2">📱 Football News</h4>
              <p className="text-xs text-slate-300 mb-3">Tin tức bóng đá cập nhật 24/7</p>
              <button className="w-full bg-orange-600 hover:bg-orange-500 text-white text-xs py-2 rounded transition-colors">
                Xem ngay
              </button>
            </div>

            {/* Ad 4 */}
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-4 rounded-lg border border-purple-500/30">
              <h4 className="text-sm font-semibold text-purple-400 mb-2">🏆 Fantasy League</h4>
              <p className="text-xs text-slate-300 mb-3">Tạo đội hình mơ ước và thách đấu bạn bè</p>
              <button className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs py-2 rounded transition-colors">
                Chơi ngay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}