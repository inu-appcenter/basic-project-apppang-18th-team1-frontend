import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { LeftArrow, UpArrow, Cross } from '@/components/icons';
import {
  getCartList,
  deleteCartItem,
  toggleCartItemSelection,
  type CartShippingGroup,
  type CartListSummary,
} from '@/api/cart';
import { createOrder } from '@/api/order';

const EMPTY_SUMMARY: CartListSummary = {
  totalProductPrice: 0,
  totalCouponDiscount: 0,
  totalPaymentAmount: 0,
};

interface CartItemRowProps {
  cartItemId: number;
  productName: string;
  thumbnailUrl: string;
  brandName: string;
  optionText: string;
  estimatedArrivalDate: string;
  quantity: number;
  isSelected: boolean;
  originalPrice: number;
  discountRate: number;
  salePrice: number;
  shippingBadge: string;
  onQuantityChange: (cartItemId: number, delta: number) => void;
  onDelete: (cartItemId: number) => void;
  onSelectToggle: (cartItemId: number, isSelected: boolean) => void;
}

function CartItemRow({
  cartItemId,
  productName,
  thumbnailUrl,
  brandName,
  optionText,
  estimatedArrivalDate,
  quantity,
  isSelected,
  originalPrice,
  discountRate,
  salePrice,
  shippingBadge,
  onQuantityChange,
  onDelete,
  onSelectToggle,
}: CartItemRowProps) {
  return (
    <div className="w-full border-b border-gray-200 px-3 py-5">
      {/* 체크박스 + 상품명 + 옵션 + 삭제 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelectToggle(cartItemId, e.target.checked)}
            className="h-5 w-5 py-2"
          />
          <div className="flex flex-col">
            <p className="text-sm font-medium">{productName}</p>
            <p className="text-xs text-gray-500">{optionText}</p>
          </div>
        </div>
        <button type="button" onClick={() => onDelete(cartItemId)} className="shrink-0 p-1">
          <Cross size={16} color="#7E7E7E" />
        </button>
      </div>

      {/* 썸네일 + 상세 정보 */}
      <div className="mt-3 flex gap-3">
        <img
          src={thumbnailUrl}
          alt={productName}
          className="h-24 w-24 shrink-0 rounded object-cover"
        />
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-xs text-gray-500">{brandName}</p>
          <p className="text-xs text-gray-500">{estimatedArrivalDate} 도착 예정</p>
          <p className="text-xs text-gray-400 line-through">{originalPrice.toLocaleString()}원</p>
          <div className="flex items-center gap-1">
            {discountRate > 0 && (
              <span className="inline-block min-w-[50px] bg-red-300 py-0.5 pr-4 pl-2 text-left text-sm font-bold text-white [clip-path:polygon(0_0,100%_0,80%_100%,0_100%)]">
                {discountRate}%
              </span>
            )}
            <span className="text-base font-bold text-red-300">{salePrice.toLocaleString()}원</span>
            <span className="text-xs text-gray-500">{shippingBadge}</span>
          </div>

          {/* 수량 조절 */}
          <div className="flex w-fit items-center rounded border border-gray-200">
            <button
              type="button"
              onClick={() => onQuantityChange(cartItemId, -1)}
              className="px-2 py-1 text-sm text-[#212B36]"
            >
              -
            </button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(cartItemId, 1)}
              className="px-2 py-1 text-sm text-[#212B36]"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPage() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [shippingGroups, setShippingGroups] = useState<CartShippingGroup[]>([]);
  const [summary, setSummary] = useState<CartListSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);
  const hasAlertedRef = useRef(false);

  const allItems = shippingGroups.flatMap((group) => group.items);
  const isAllSelected = allItems.length > 0 && allItems.every((item) => item.isSelected);

  // 하단 결제 요약은 선택된(isSelected) 항목만 합산한다
  const selectedItems = allItems.filter((item) => item.isSelected);
  const itemCount = selectedItems.length;
  const totalProductPrice = selectedItems.reduce(
    (sum, item) => sum + item.price.salePrice * item.quantity,
    0,
  );
  const totalInstantDiscount = selectedItems.reduce(
    (sum, item) => sum + (item.price.originalPrice - item.price.salePrice) * item.quantity,
    0,
  );
  const totalPaymentAmount = totalProductPrice - summary.totalCouponDiscount;

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      if (!hasAlertedRef.current) {
        hasAlertedRef.current = true;
        alert('로그인이 필요한 기능입니다.');
        navigate('/login');
      }
      return undefined;
    }

    const controller = new AbortController();

    const fetchCart = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getCartList(controller.signal);
        setShippingGroups(response.data.data.shippingGroups);
        setSummary(response.data.data.summary);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error('장바구니 조회 실패', err);
        setError('장바구니를 불러오지 못했습니다.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchCart();

    return () => controller.abort();
  }, [navigate]);

  const handleQuantityChange = (cartItemId: number, delta: number) => {
    setShippingGroups((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: Math.min(item.maxQuantity, Math.max(1, item.quantity + delta)) }
            : item,
        ),
      })),
    );
  };

  const handleDeleteItem = async (cartItemId: number) => {
    try {
      await deleteCartItem(cartItemId);

      const response = await getCartList();
      setShippingGroups(response.data.data.shippingGroups);
      setSummary(response.data.data.summary);
    } catch (err) {
      console.error('장바구니 삭제 실패', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleSelectToggle = async (cartItemId: number, isSelected: boolean) => {
    try {
      const response = await toggleCartItemSelection(cartItemId, isSelected);

      setShippingGroups((prev) =>
        prev.map((group) => ({
          ...group,
          items: group.items.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, isSelected: response.data.isSelected }
              : item,
          ),
        })),
      );
    } catch (err) {
      console.error('선택 상태 변경 실패', err);
    }
  };

  // 전체 선택/해제 API가 따로 없어서, 값이 바뀌어야 하는 항목마다 선택 토글 API를 호출한다.
  const handleToggleAll = async () => {
    const target = !isAllSelected;
    const itemsToUpdate = allItems.filter((item) => item.isSelected !== target);

    if (itemsToUpdate.length === 0) return;

    try {
      await Promise.all(
        itemsToUpdate.map((item) => toggleCartItemSelection(item.cartItemId, target)),
      );

      const response = await getCartList();
      setShippingGroups(response.data.data.shippingGroups);
      setSummary(response.data.data.summary);
    } catch (err) {
      console.error('전체 선택 변경 실패', err);
    }
  };

  // 선택 항목 일괄 삭제 API가 따로 없어서, 선택된 항목마다 삭제 API를 호출한다.
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;

    try {
      await Promise.all(selectedItems.map((item) => deleteCartItem(item.cartItemId)));

      const response = await getCartList();
      setShippingGroups(response.data.data.shippingGroups);
      setSummary(response.data.data.summary);
    } catch (err) {
      console.error('선택 삭제 실패', err);
      alert('선택한 상품 삭제에 실패했습니다.');
    }
  };

  const handleOrder = () => {
    if (selectedItems.length === 0) {
      alert('주문할 상품을 선택해주세요.');
      return;
    }

    setShowOrderConfirm(true);
  };

  const handleConfirmOrder = async () => {
    setShowOrderConfirm(false);

    try {
      const response = await createOrder();
      navigate('/order', { state: { order: response.data.data } });
    } catch (err) {
      console.error('주문 생성 실패', err);
      alert('주문에 실패했습니다.');
    }
  };

  return (
    <div className="relative flex w-full flex-col items-center gap-3 bg-white px-3 pb-10">
      {/* Header */}
      <header className="flex h-[72px] w-full items-center justify-center py-5">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <LeftArrow size={24} color="#212B36" />
        </button>
        <h1 className="text-[20px] leading-none font-bold">장바구니</h1>
      </header>
      <div className="w-full">
        {!loading && !error && allItems.length > 0 && (
          <div className="flex w-full items-center gap-3 border-b border-gray-200 px-3 py-3">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleToggleAll}
              className="h-5 w-5"
            />
            <span className="text-sm">전체선택</span>
            <button type="button" onClick={handleDeleteSelected} className="text-sm text-gray-500">
              선택 삭제
            </button>
          </div>
        )}

        {loading && (
          <div className="w-full py-10 text-center text-sm text-gray-400">불러오는 중...</div>
        )}

        {error && <div className="w-full py-10 text-center text-sm text-red-400">{error}</div>}

        {!loading && !error && allItems.length === 0 && (
          <div className="w-full py-10 text-center text-sm text-gray-400">
            장바구니에 담긴 상품이 없습니다.
          </div>
        )}

        {!loading &&
          !error &&
          shippingGroups.map((group) =>
            group.items.map((item) => (
              <CartItemRow
                key={item.cartItemId}
                cartItemId={item.cartItemId}
                productName={item.productName}
                thumbnailUrl={item.thumbnailUrl}
                brandName={item.brandName}
                optionText={item.optionText}
                estimatedArrivalDate={item.estimatedArrivalDate}
                quantity={item.quantity}
                isSelected={item.isSelected}
                originalPrice={item.price.originalPrice}
                discountRate={item.price.wowCouponDiscountRate}
                salePrice={item.price.salePrice}
                shippingBadge={group.shippingBadge}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDeleteItem}
                onSelectToggle={handleSelectToggle}
              />
            )),
          )}

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
              <span className="text-sm font-bold">{totalProductPrice.toLocaleString()}원</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#212B36]">총 즉시할인</span>
              <span className="text-sm font-bold text-red-500">
                -{totalInstantDiscount.toLocaleString()}원
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#212B36]">총 쿠폰 할인</span>
              <span className="text-sm font-bold text-red-500">
                -{summary.totalCouponDiscount.toLocaleString()}원
              </span>
            </div>

            {/* 구분선 */}
            <div className="my-2 border-t border-gray-300" />

            {/* 총 결제 예상 금액 */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#212B36]">총 결제 예상 금액</span>
              <span className="text-base font-bold text-red-300">
                {totalPaymentAmount.toLocaleString()}원
              </span>
            </div>
          </div>
        )}
        <div className="flex cursor-pointer items-center justify-between border-t border-gray-200 px-3 py-4">
          <span className="text-sm font-bold text-[#212B36]">총 결제 예상 금액</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{totalPaymentAmount.toLocaleString()}원</span>
            <button
              type="button"
              className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <UpArrow size={20} color="#212B36" />
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleOrder}
          className="bg-primary-200 w-full px-3 py-4 text-base font-bold text-white"
        >
          총 {itemCount}개의 상품 구매하기
        </button>
      </div>

      {showOrderConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6"
          onClick={() => setShowOrderConfirm(false)}
        >
          <div
            className="w-full max-w-80 rounded-lg bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-5 text-center text-sm font-bold text-[#212B36]">구매하시겠습니까?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowOrderConfirm(false)}
                className="flex-1 rounded border border-gray-300 py-2 text-sm font-semibold text-[#212B36]"
              >
                아니오
              </button>
              <button
                type="button"
                onClick={handleConfirmOrder}
                className="bg-primary-200 flex-1 rounded py-2 text-sm font-semibold text-white"
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
