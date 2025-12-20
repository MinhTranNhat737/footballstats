"use client"

import { useState, useEffect, ReactNode } from 'react'
import { Spinner } from '@/components/ui/spinner'

interface ClientOnlyWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function ClientOnlyWrapper({ children, fallback }: ClientOnlyWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    console.log('🔧 ClientOnlyWrapper: useEffect running on client!')
    setIsMounted(true)
    console.log('🔧 ClientOnlyWrapper: isMounted set to true')
  }, [])

  // Only log after mount to avoid hydration mismatch
  useEffect(() => {
    if (isMounted) {
      console.log('🔧 ClientOnlyWrapper mounted:', {
        isMounted,
        typeof_window: typeof window,
        isClient: typeof window !== 'undefined'
      })
    }
  }, [isMounted])

  if (!isMounted) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Spinner className="w-8 h-8 mx-auto mb-4" />
          <p className="text-slate-400">Đang khởi tạo client...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}