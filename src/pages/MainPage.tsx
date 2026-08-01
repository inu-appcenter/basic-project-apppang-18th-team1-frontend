import type { ReactNode } from 'react';

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_LABELS } from '@/constants/category';
import { getMainBanners, type MainBanner } from '@/api/banner';
import {
  Laptop,
  Phone,
  Tablet,
  Watch,
  Headphone,
  Monitor,
  Mouse,
  Keyboard,
  Search,
  Gamepad,
  Battery,
} from '@/components/icons';

// ---- Types ----

type Category = {
  id: number;
  label: string;
  path: string;
  icon: ReactNode;
};

// ---- Constants ----

const MAIN_BANNER_LIMIT = 3;

const CATEGORY_ICONS: Record<string, ReactNode> = {
  '1': <Laptop size={40} color="#212B36" />,
  '2': <Phone size={40} color="#212B36" />,
  '3': <Tablet size={40} color="#212B36" />,
  '4': <Watch size={40} color="#212B36" />,
  '5': <Headphone size={40} color="#212B36" />,
  '6': <Monitor size={40} color="#212B36" />,
  '7': <Mouse size={40} color="#212B36" />,
  '8': <Keyboard size={40} color="#212B36" />,
  '9': <Gamepad size={40} color="#212B36" />,
  '10': <Battery size={40} color="#212B36" />,
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
  const [banners, setBanners] = useState<MainBanner[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBanners = async () => {
      try {
        const response = await getMainBanners(MAIN_BANNER_LIMIT, controller.signal);
        setBanners(response.data.data);
        setCurrentBanner(0);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error('메인 배너 조회 실패', err);
      }
    };

    fetchBanners();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return undefined;

    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (banners.length <= 1) return;

    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      } else {
        setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
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
          <Search size={20} color="#212B36" />
          <span className="text-body-3 flex-1 text-left text-gray-300">앱팡에서 검색하세요!</span>
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
          {banners.length > 0 ? (
            banners.map((banner) => (
              <button
                key={banner.rank}
                type="button"
                className="from-secondary-100 to-secondary-200/40 flex h-full min-w-full items-center gap-4 bg-gradient-to-br px-5"
                onClick={() => navigate(`/products/${banner.product.id}`)}
                aria-label={`${banner.rank}위 ${banner.product.name}`}
              >
                <img
                  src={banner.product.mainImageUrl}
                  alt={banner.product.name}
                  className="h-32 w-32 shrink-0 rounded object-cover"
                />
                <div className="flex flex-1 flex-col items-start gap-1 text-left">
                  <span className="text-primary-200 text-xs font-bold">
                    {banner.rank}위 인기상품
                  </span>
                  <span className="text-xs text-gray-500">{banner.product.brandName}</span>
                  <span className="line-clamp-2 text-sm font-bold text-[#212B36]">
                    {banner.product.name}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    {banner.product.originPrice.toLocaleString()}원
                  </span>
                  <div className="flex items-center gap-1">
                    {banner.product.discountRate > 0 && (
                      <span className="text-sm font-bold text-red-300">
                        {banner.product.discountRate}%
                      </span>
                    )}
                    <span className="text-base font-bold text-red-300">
                      {banner.product.salePrice.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="from-secondary-100 to-secondary-200/40 h-full min-w-full bg-gradient-to-br" />
          )}
        </div>
        <div className="pointer-events-none z-10 col-start-1 row-start-1 flex items-end justify-center gap-2 pb-4">
          {banners.map((banner, index) => (
            <button
              key={banner.rank}
              type="button"
              aria-label={`배너 ${index + 1} 보기`}
              onClick={() => setCurrentBanner(index)}
              className={`pointer-events-auto h-2 w-2 rounded-full transition-colors ${
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
