import { useNavigate, useSearchParams } from 'react-router-dom';
import { LeftArrow, UpArrow, Cross } from '@/components/icons';
import { useState, useRef } from 'react';

function CartPage() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative flex w-full flex-col items-center gap-3 bg-white px-3 pb-10">
      {/* Header */}
      <header className="flex h-[72px] w-full items-center justify-center py-5">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <LeftArrow size={24} color="#212B36" />
        </button>
        <h1 className="text-[20px] leading-none font-bold">장바구니</h1>
      </header>
      <div>
        장바구니에 담긴 상품
        {isExpanded && (
          <div
            className="fixed top-0 bottom-0 left-1/2 z-40 w-full max-w-120 -translate-x-1/2 bg-black/30"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </div>
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-120 -translate-x-1/2 bg-white">
        {isExpanded && (
          <div className="flex flex-col gap-2 rounded-t-lg border-t border-gray-200 px-3 py-4">
            {/* 상세 항목들 */}
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-black">주문 예상 금액</span>
              <button type="button" onClick={() => setIsExpanded(!isExpanded)}>
                <Cross size={24} color="#7E7E7E" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#212B36]">총 상품 가격</span>
              <span className="text-sm font-bold">N원</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#212B36]">총 즉시할인</span>
              <span className="text-sm font-bold text-red-500">-N원</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#212B36]">총 쿠폰 할인</span>
              <span className="text-sm font-bold text-red-500">-N원</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#212B36]">총 배송비</span>
              <span className="text-sm font-bold">+N원</span>
            </div>

            {/* 구분선 */}
            <div className="my-2 border-t border-gray-300" />

            {/* 총 결제 예상 금액 */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#212B36]">총 결제 예상 금액</span>
              <span className="text-base font-bold text-red-300">N원</span>
            </div>
          </div>
        )}
        <div className="flex cursor-pointer items-center justify-between border-t border-gray-200 px-3 py-4">
          <span className="text-sm font-bold text-[#212B36]">총 결제 예상 금액</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">N원</span>
            <button
              type="button"
              className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <UpArrow size={20} color="#212B36" />
            </button>
          </div>
        </div>
        <button className="bg-primary-200 w-full px-3 py-4 text-base font-bold text-white">
          총 N개의 상품 구매하기
        </button>
      </div>
    </div>
  );
}

export default CartPage;
