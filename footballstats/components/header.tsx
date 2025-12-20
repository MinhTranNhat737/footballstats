"use client"
import { Search, User, Menu, Trophy, Play, Home, Settings, UserSearch, Users, LogOut, LogIn, Shield, Heart } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()

  const navigationItems = [
    { href: "/", label: "Trang chủ", icon: Home },
    { href: "/live", label: "Trực tiếp", icon: Play },
    { href: "/standings", label: "Bảng xếp hạng", icon: Trophy },
    { href: "/players", label: "Cầu thủ", icon: UserSearch },
  ]
  
  // Add My Matches for authenticated users
  const authenticatedNavigationItems = isAuthenticated 
    ? [...navigationItems, { href: "/my-matches", label: "Trận của tôi", icon: Heart }]
    : navigationItems

  // Only show admin menu if user is admin
  const displayNavigationItems = isAdmin 
    ? [
        ...authenticatedNavigationItems, 
        { href: "/manage-players", label: "Quản lý Cầu thủ", icon: Users },
        { href: "/admin", label: "Admin Panel", icon: Settings }
      ]
    : authenticatedNavigationItems

  const isActivePage = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-[200] border-b border-slate-700/50 bg-slate-950/95 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 hover:opacity-80 transition-all duration-300 hover:scale-105 group">
            <Image 
              src="/logo (2).png" 
              alt="FootyStats Logo" 
              width={600} 
              height={200} 
              className="h-30 w-auto object-contain transition-transform duration-300 group-hover:rotate-1"
            />
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {displayNavigationItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg group ${
                  isActivePage(href)
                    ? "bg-blue-500/20 text-blue-400 shadow-lg scale-105"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <span className="font-medium transition-all duration-300">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Live Matches Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-sm font-medium">LIVE</span>
            </div>

            {/* Avatar / User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 group"
                  >
                    <User className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium hidden sm:block">{user?.username}</span>
                    {isAdmin && (
                      <Shield className="w-4 h-4 text-yellow-300" />
                    )}
                  </button>
                  
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
                        <div className="p-3 border-b border-slate-700">
                          <p className="text-white font-semibold">{user?.username}</p>
                          <p className="text-slate-400 text-sm">{user?.email}</p>
                          {isAdmin && (
                            <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                              <Shield className="w-3 h-3" />
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className="p-2">
                          <Link
                            href="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
                          >
                            <User className="w-4 h-4" />
                            Thông tin cá nhân
                          </Link>
                          <Button
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
                              router.push('/login');
                            }}
                            variant="ghost"
                            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Đăng xuất
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Link href="/login">
                  <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:block">Đăng nhập</span>
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-all duration-300 hover:scale-110 group"
            >
              <Menu className={`w-5 h-5 text-slate-300 transition-all duration-300 group-hover:rotate-90 ${
                isMobileMenuOpen ? 'rotate-90' : ''
              }`} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 md:hidden animate-in slide-in-from-top-2 duration-300">
            <nav className="flex flex-col gap-2">
              {displayNavigationItems.map(({ href, label, icon: Icon }, index) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group ${
                    isActivePage(href)
                      ? "bg-blue-500/20 text-blue-400 shadow-lg"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <span className="font-medium transition-all duration-300">{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}