import { LeftArrow, FilledHeart, EmptyHeart, Share } from '@/components/icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

function ProductDetailPage() {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const touchStartX = useRef(0);
  const IMAGE_COUNT = 5;
  const [isWished, setIsWished] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentImage((prev) => (prev + 1) % IMAGE_COUNT);
      } else {
        setCurrentImage((prev) => (prev - 1 + IMAGE_COUNT) % IMAGE_COUNT);
      }
    }
  };

  return (
    <div className="relative flex w-full flex-col bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 z-10 flex h-[72px] w-full items-center py-5">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <LeftArrow size={24} color="#212B36" />
        </button>
      </header>
      {/* Image Slider */}
      <div
        className="grid w-full overflow-hidden"
        style={{ height: '390px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="col-start-1 row-start-1 flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentImage * 100}%)` }}
        >
          {Array.from({ length: IMAGE_COUNT }).map((_, index) => (
            <div
              key={index}
              className="flex h-full min-w-full items-center justify-center bg-gray-100"
            >
              <span className="text-gray-400">상품 이미지 {index + 1}</span>
            </div>
          ))}
        </div>
        <div className="z-10 col-start-1 row-start-1 flex items-end justify-center gap-2 pb-4">
          {Array.from({ length: IMAGE_COUNT }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentImage(index)}
              className={`h-2 w-2 rounded-full transition-colors ${index === currentImage ? 'bg-black' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <div className="z-10 col-start-1 row-start-1 flex items-end justify-end pr-4 pb-4">
          <button type="button" onClick={() => setIsWished((prev) => !prev)}>
            {isWished ? (
              <FilledHeart size={24} color="#CB1400" />
            ) : (
              <EmptyHeart size={24} color="#212B36" />
            )}
          </button>
        </div>
      </div>
      {/* Product Information */}
      <div className="flex flex-col gap-2 px-4 py-3">
        <div className="flex justify-end">
          <button type="button">
            <Share size={24} color="#212B36" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 px-2">
        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200" />
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-1">
            <span className="text-[14px] font-bold text-[#212B36]">브랜드명</span>
            <span className="text-[14px] font-bold text-[#212B36]">&gt;</span>
          </div>
          <button type="button" className="text-left text-[12px] text-gray-300">
            브랜드 상품 모아보기
          </button>
        </div>
      </div>
      <p className="line-clamp-2 px-2 py-1 text-base">상품명</p>
      <div className="flex flex-col gap-1">
        <div className="flex items-center px-2">
          <span className="inline-block min-w-[50px] bg-red-300 py-0.5 pr-4 pl-2 text-left text-sm font-bold text-white [clip-path:polygon(0_0,100%_0,80%_100%,0_100%)]">
            할인율
          </span>
          <span className="text-xl font-bold text-red-300">가격</span>
          <span className="ml-1 self-end text-base font-bold text-red-300">단가</span>
          <span className="text-sm text-gray-400 line-through">할인 전 가격</span>
        </div>
      </div>
      {/* Divider */}
      <div className="my-2 h-2 w-full bg-gray-100" />
      {/* Bottom CTA */}
      <div className="fixed bottom-16 left-1/2 z-40 w-full max-w-120 -translate-x-1/2 bg-white px-3 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="flex gap-2">
          <button className="text-primary-200 border-primary-200 flex-1 rounded border py-3 font-bold">
            장바구니 담기
          </button>
          <button className="bg-primary-200 flex-1 rounded py-3 font-bold text-white">
            바로구매
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProductDetailPage;
