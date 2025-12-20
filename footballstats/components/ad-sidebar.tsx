"use client"

import { useState } from "react"
import { X } from "lucide-react"
import Image from "next/image"

interface AdSidebarProps {
  position: "left" | "right"
}

const adBanners = [
  {
    id: 1,
    image: "/ads/banner1.png",
    alt: "BetMaster - Tỷ lệ cược tốt nhất",
    link: "#"
  },
  {
    id: 2,
    image: "/ads/banner2.png",
    alt: "Fantasy League - Tạo đội hình mơ ước",
    link: "#"
  },
  {
    id: 3,
    image: "/ads/banner3.png",
    alt: "Football News - Tin tức bóng đá 24/7",
    link: "#"
  },
  {
    id: 4,
    image: "/ads/banner4.png",
    alt: "LiveScore Pro - Tỷ số trực tiếp",
    link: "#"
  }
]

export default function AdSidebar({ position }: AdSidebarProps) {
  const [hiddenBanners, setHiddenBanners] = useState<number[]>([])

  const hideBanner = (id: number) => {
    setHiddenBanners([...hiddenBanners, id])
  }

  return (
    <div className="hidden xl:flex flex-col gap-6 w-80">
      {adBanners.map((ad) => {
        if (hiddenBanners.includes(ad.id)) return null
        
        return (
          <div key={ad.id} className="relative group">
            {/* Close button */}
            <button
              onClick={() => hideBanner(ad.id)}
              className="absolute top-2 right-2 z-10 p-1.5 bg-slate-900/90 hover:bg-slate-800 rounded-full border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Ẩn quảng cáo"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Banner */}
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden border-2 border-slate-700/50 hover:border-slate-600 transition-all hover:scale-[1.02] hover:shadow-2xl transform"
            >
              <div className="relative w-full bg-slate-800">
                <Image
                  src={ad.image}
                  alt={ad.alt}
                  width={320}
                  height={400}
                  className="w-full h-auto"
                  sizes="320px"
                  priority={ad.id === 1}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
            </a>
          </div>
        )
      })}
    </div>
  )
}