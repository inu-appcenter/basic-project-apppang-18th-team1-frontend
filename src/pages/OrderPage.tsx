import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Cross } from '@/components/icons';
import type { OrderData } from '@/api/order';
import type { Address } from '@/api/address';

const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

function OrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { order?: OrderData; address?: Address } | null;
  const order = state?.order;
  const address = state?.address;

  useEffect(() => {
    if (!order) {
      navigate('/cart', { replace: true });
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="relative flex w-full flex-col items-center gap-3 bg-white px-3 pb-10">
      {/* Header */}
      <header className="relative flex h-[72px] w-full items-center justify-center py-5">
        <h1 className="text-[20px] leading-none font-bold">구매하기</h1>
        <button type="button" onClick={() => navigate('/')} className="absolute right-3 p-1">
          <Cross size={24} color="#7E7E7E" />
        </button>
      </header>

      <div className="w-full">
        {order.items.map((item) => (
          <div
            key={item.productId}
            className="flex w-full gap-3 border-b border-gray-200 px-3 py-5"
          >
            <img
              src={item.thumbnailUrl}
              alt={item.productName}
              className="h-24 w-24 shrink-0 rounded object-cover"
            />
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-sm font-medium">{item.productName}</p>
              <p className="text-xs text-gray-500">{item.brandName}</p>
              <p className="text-xs text-gray-500">{item.optionText}</p>
              <p className="text-xs text-gray-500">수량 {item.quantity}개</p>
              <p className="text-sm font-bold">{item.price.toLocaleString()}원</p>
            </div>
          </div>
        ))}
      </div>

      {address && (
        <div className="flex w-full flex-col gap-1 rounded border border-gray-200 px-3 py-4">
          <p className="text-sm font-bold text-[#212B36]">배송지</p>
          <p className="text-xs text-gray-500">
            {address.recipientName} · {formatPhoneNumber(address.recipientPhone)}
          </p>
          <p className="text-sm text-[#212B36]">
            {address.mainAddress} {address.detailAddress}
          </p>
          {address.deliveryMessage && (
            <p className="text-xs text-gray-400">{address.deliveryMessage}</p>
          )}
        </div>
      )}

      <div className="flex w-full flex-col gap-2 rounded border border-gray-200 px-3 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">주문 상태</span>
          <span className="text-primary-200 text-sm font-bold">{order.orderStatus}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">상품 정가 합계</span>
          <span className="text-sm font-bold">{order.totalProductPrice.toLocaleString()}원</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">할인 합계</span>
          <span className="text-sm font-bold text-red-500">
            -{order.totalDiscountPrice.toLocaleString()}원
          </span>
        </div>

        <div className="my-1 border-t border-gray-300" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#212B36]">최종 결제 금액</span>
          <span className="text-base font-bold text-red-300">
            {order.finalPaymentPrice.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
