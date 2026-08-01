import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LeftArrow } from '@/components/icons';
import { getAddresses, type Address } from '@/api/address';
import { createOrder, buyNow } from '@/api/order';

export interface CheckoutItem {
  key: number | string;
  productName: string;
  thumbnailUrl: string;
  brandName: string;
  optionText: string;
  quantity: number;
  salePrice: number;
}

export type CheckoutState =
  | { mode: 'cart'; items: CheckoutItem[] }
  | {
      mode: 'buyNow';
      items: CheckoutItem[];
      productId: number;
      optionId: number;
      quantity: number;
    };

const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CheckoutState | null;

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!state) {
      navigate('/cart', { replace: true });
    }
  }, [state, navigate]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const response = await getAddresses(controller.signal);
        setAddresses(response.data.data);
        const defaultAddress = response.data.data.find((address) => address.isDefault);
        setSelectedAddressId((defaultAddress ?? response.data.data[0])?.addressId ?? null);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error('배송지 조회 실패', err);
      } finally {
        if (!controller.signal.aborted) setLoadingAddresses(false);
      }
    };

    fetchAddresses();

    return () => controller.abort();
  }, []);

  if (!state) return null;

  const totalPrice = state.items.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);

  const handlePurchase = async () => {
    if (!selectedAddressId) {
      alert('배송지를 선택해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response =
        state.mode === 'cart'
          ? await createOrder(selectedAddressId)
          : await buyNow({
              productId: state.productId,
              optionId: state.optionId,
              quantity: state.quantity,
              addressId: selectedAddressId,
            });

      const selectedAddress = addresses.find((address) => address.addressId === selectedAddressId);

      navigate('/order', {
        state: { order: response.data.data, address: selectedAddress },
        replace: true,
      });
    } catch (err: any) {
      console.error('주문 생성 실패', err);
      if (!err.response) {
        alert('서버와 연결할 수 없습니다.');
        return;
      }
      alert(err.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col bg-white">
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 pb-10">
        <header className="flex h-[72px] w-full items-center justify-center py-5">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
            <LeftArrow size={24} color="#212B36" />
          </button>
          <h1 className="text-[20px] leading-none font-bold">주문서 작성</h1>
        </header>

        {/* 주문 상품 */}
        <div className="w-full">
          <p className="px-1 pb-2 text-sm font-bold text-[#212B36]">주문 상품</p>
          {state.items.map((item) => (
            <div key={item.key} className="flex w-full gap-3 border-b border-gray-100 py-3">
              <img
                src={item.thumbnailUrl}
                alt={item.productName}
                className="h-20 w-20 shrink-0 rounded object-cover"
              />
              <div className="flex flex-1 flex-col gap-1">
                <p className="text-sm font-medium">{item.productName}</p>
                <p className="text-xs text-gray-500">{item.brandName}</p>
                <p className="text-xs text-gray-500">{item.optionText}</p>
                <p className="text-xs text-gray-500">수량 {item.quantity}개</p>
                <p className="text-sm font-bold">
                  {(item.salePrice * item.quantity).toLocaleString()}원
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="my-1 h-2 w-full bg-gray-100" />

        {/* 배송지 선택 */}
        <div className="w-full">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-sm font-bold text-[#212B36]">배송지</p>
            <button
              type="button"
              onClick={() => navigate('/addresses')}
              className="text-xs text-gray-400 underline"
            >
              배송지 관리
            </button>
          </div>

          {loadingAddresses && (
            <div className="w-full py-6 text-center text-sm text-gray-400">불러오는 중...</div>
          )}

          {!loadingAddresses && addresses.length === 0 && (
            <div className="flex w-full flex-col items-center gap-2 rounded border border-gray-200 py-6">
              <p className="text-sm text-gray-400">등록된 배송지가 없습니다.</p>
              <button
                type="button"
                onClick={() => navigate('/addresses')}
                className="text-primary-200 text-sm font-semibold underline"
              >
                배송지 추가하러 가기
              </button>
            </div>
          )}

          {!loadingAddresses &&
            addresses.map((address) => (
              <button
                key={address.addressId}
                type="button"
                onClick={() => setSelectedAddressId(address.addressId)}
                className={`mb-2 w-full rounded border p-3 text-left ${
                  selectedAddressId === address.addressId ? 'border-primary-200' : 'border-gray-200'
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-bold text-[#212B36]">{address.alias}</span>
                  {address.isDefault && (
                    <span className="text-primary-200 border-primary-200 rounded border px-1.5 py-0.5 text-[10px] font-bold">
                      기본배송지
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {address.recipientName} · {formatPhoneNumber(address.recipientPhone)}
                </p>
                <p className="mt-1 text-sm text-[#212B36]">
                  {address.mainAddress} {address.detailAddress}
                </p>
              </button>
            ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="w-full bg-white px-3 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-bold text-[#212B36]">총 결제 금액</span>
          <span className="text-lg font-bold text-red-300">{totalPrice.toLocaleString()}원</span>
        </div>
        <button
          type="button"
          onClick={handlePurchase}
          disabled={!selectedAddressId || isSubmitting}
          className="bg-primary-200 w-full rounded py-3 text-base font-bold text-white disabled:bg-gray-300"
        >
          {isSubmitting ? '주문 처리 중...' : '구매하기'}
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
