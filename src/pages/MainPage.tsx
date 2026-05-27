import type { ReactNode } from 'react'
import {
  Camera,
  Clock,
  Coffee,
  Gift,
  Globe,
  Leaf,
  Monitor,
  Search,
  ShoppingBag,
  Star,
  Tag,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ---- Types ----

type Banner = {
  id: number
  bgColor: string
}

type Category = {
  id: number
  label: string
  path: string
  icon: ReactNode
}

// ---- Constants ----

const BANNERS: Banner[] = [
  { id: 1, bgColor: 'bg-secondary-100' },
  { id: 2, bgColor: 'bg-primary-100' },
  { id: 3, bgColor: 'bg-secondary-100' },
  { id: 4, bgColor: 'bg-primary-100' },
  { id: 5, bgColor: 'bg-secondary-100' },
]

const CATEGORIES: Category[] = [
  { id: 1, label: '자주산상품', path: '/products?category=frequent', icon: <ShoppingBag size={40} /> },
  { id: 2, label: '쿠팡플레이', path: '/products?category=play', icon: <Monitor size={40} /> },
  { id: 3, label: '로켓프레시', path: '/products?category=fresh', icon: <Leaf size={40} /> },
  { id: 4, label: '쿠팡이츠', path: '/products?category=eats', icon: <Coffee size={40} /> },
  { id: 5, label: '골드박스', path: '/products?category=goldbox', icon: <Gift size={40} /> },
  { id: 6, label: '반짝세일', path: '/products?category=flash', icon: <Clock size={40} /> },
  { id: 7, label: '패션/잡화', path: '/products?category=fashion', icon: <Tag size={40} /> },
  { id: 8, label: 'R.LUX', path: '/products?category=luxury', icon: <Star size={40} /> },
  { id: 9, label: '로켓배송', path: '/products?category=rocket', icon: <Zap size={40} /> },
  { id: 10, label: '로켓직구', path: '/products?category=global', icon: <Globe size={40} /> },
]

// ---- Main Component ----

function MainPage() {
  const navigate = useNavigate()
  const [currentBanner, setCurrentBanner] = useState(0)
  const touchStartX = useRef(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % BANNERS.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentBanner(prev => (prev + 1) % BANNERS.length)
      } else {
        setCurrentBanner(prev => (prev - 1 + BANNERS.length) % BANNERS.length)
      }
    }
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="px-4 py-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-3"
          onClick={() => navigate('/search')}
        >
          <Search size={20} className="shrink-0 text-gray-300" />
          <span className="flex-1 text-left text-sm text-gray-300">앱팡에서 검색하세요!</span>
          <Camera size={20} className="shrink-0 text-black" />
        </button>
      </div>

      {/* Banner Slider */}
      <div
        className="relative h-52 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-label="배너 슬라이더"
      >
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {BANNERS.map(banner => (
            <button
              key={banner.id}
              type="button"
              className={`flex h-full min-w-full items-center justify-center ${banner.bgColor}`}
              onClick={() => navigate('/products')}
              aria-label={`배너 ${banner.id}`}
            >
              <span className="text-xl font-bold text-gray-300">배너 슬라이더</span>
            </button>
          ))}
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {BANNERS.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              aria-label={`배너 ${index + 1} 보기`}
              onClick={() => setCurrentBanner(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentBanner ? 'bg-black' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Category Menu */}
      <div className="px-2 py-4">
        <div className="grid grid-cols-5">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate(cat.path)}
              className="flex flex-col items-center gap-1.5 py-3 text-black"
            >
              {cat.icon}
              <span className="break-keep text-center text-[11px] leading-tight">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MainPage
