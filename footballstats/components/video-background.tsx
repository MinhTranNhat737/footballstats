"use client"

import { useState, useEffect } from "react"

interface VideoBackgroundProps {
  className?: string
}

export default function VideoBackground({ className = "" }: VideoBackgroundProps) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    console.log('🎥 Video background component mounted')
  }, [])

  const handleVideoLoad = () => {
    console.log('🎥 Video loaded successfully')
    setVideoLoaded(true)
  }

  const handleVideoError = () => {
    // Video file not found, silently fall back to gradient
    setVideoError(true)
  }

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Gradient background as fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      
      {!videoError && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-30' : 'opacity-0'
          }`}
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
        >
          <source src="/videoplayback.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      
      {/* Overlay để đảm bảo text dễ đọc */}
      <div className="absolute inset-0 bg-slate-950/40"></div>
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/70 text-white text-xs p-2 rounded">
          Video: {videoError ? '❌ Error' : videoLoaded ? '✅ Loaded' : '⏳ Loading'}
        </div>
      )}
    </div>
  )
}