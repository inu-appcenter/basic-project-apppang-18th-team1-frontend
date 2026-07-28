import type { ReactNode } from 'react';
import {
  Camera,
  ChefHat,
  Dumbbell,
  Gift,
  Monitor,
  Search,
  Smartphone,
  Sparkles,
  Tag,
  Utensils,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_LABELS } from '@/constants/category';

// ---- Types ----

type Banner = {
  id: number;
  bgColor: string;
};

type Category = {
  id: number;
  label: string;
  path: string;
  icon: ReactNode;
};

// ---- Constants ----

const BANNERS: Banner[] = [
  { id: 1, bgColor: 'bg-secondary-100' },
  { id: 2, bgColor: 'bg-primary-100' },
  { id: 3, bgColor: 'bg-secondary-100' },
  { id: 4, bgColor: 'bg-primary-100' },
  { id: 5, bgColor: 'bg-secondary-100' },
];

const CATEGORY_ICONS: Record<string, ReactNode> = {
  '1': <Tag size={40} />,
  '2': <Monitor size={40} />,
  '3': <Smartphone size={40} />,
  '4': <Utensils size={40} />,
  '5': <Dumbbell size={40} />,
  '6': <Gift size={40} />,
  '7': <Sparkles size={40} />,
  '8': <ChefHat size={40} />,
};

const CATEGORIES: Category[] = Object.entries(CATEGORY_LABELS).map(([category, label], index) => ({
  id: index + 1,
  label,
  path: `/products?category=${category}`,
  icon: CATEGORY_ICONS[category],
}));

// ---- Main Component ----

function MainPage() {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
      } else {
        setCurrentBanner((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
      }
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="px-4 py-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-full border-2 border-black bg-white px-4 py-3"
          onClick={() => navigate('/search')}
        >
          <Search size={16} className="shrink-0 text-black" />
          <span className="text-body-3 flex-1 text-left text-gray-300">앱팡에서 검색하세요!</span>
          <Camera size={24} className="shrink-0 text-black" />
        </button>
      </div>

      {/* Banner Slider */}
      <div
        className="grid h-52 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-label="배너 슬라이더"
      >
        <div
          className="col-start-1 row-start-1 flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {BANNERS.map((banner) => (
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
        <div className="z-10 col-start-1 row-start-1 flex items-end justify-center gap-2 pb-4">
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
      <div className="my-4 px-2 py-4">
        <div className="grid grid-cols-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate(cat.path)}
              className="hover:text-primary-200 flex flex-col items-center gap-1.5 py-3 text-black transition-colors"
            >
              {cat.icon}
              <span className="text-center text-[11px] leading-tight break-keep">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
