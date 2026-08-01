import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftArrow } from '@/components/icons';
import { getOrderList, cancelOrder, type OrderListItem } from '@/api/order';

const formatDateTime = (iso: string) => {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

function OrderListPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const hasAlertedRef = useRef(false);

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

    const fetchOrderList = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getOrderList(controller.signal);
        setOrders(response.data.data);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error('주문 내역 조회 실패', err);
        setError('주문 내역을 불러오지 못했습니다.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchOrderList();

    return () => controller.abort();
  }, [navigate]);

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('주문을 취소하시겠습니까?')) return;

    try {
      const response = await cancelOrder(orderId);
      const { orderStatus } = response.data.data;
      setOrders((prev) =>
        prev.map((order) => (order.orderId === orderId ? { ...order, orderStatus } : order)),
      );
    } catch (err) {
      console.error('주문 취소 실패', err);
      alert('주문 취소에 실패했습니다.');
    }
  };

  return (
    <div className="relative flex w-full flex-col items-center gap-3 bg-white px-3 pb-10">
      {/* Header */}
      <header className="flex h-[72px] w-full items-center justify-center py-5">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <LeftArrow size={24} color="#212B36" />
        </button>
        <h1 className="text-[20px] leading-none font-bold">주문 내역</h1>
      </header>

      {loading && (
        <div className="w-full py-10 text-center text-sm text-gray-400">불러오는 중...</div>
      )}

      {error && <div className="w-full py-10 text-center text-sm text-red-400">{error}</div>}

      {!loading && !error && orders.length === 0 && (
        <div className="w-full py-10 text-center text-sm text-gray-400">주문 내역이 없습니다.</div>
      )}

      {!loading &&
        !error &&
        orders.map((order) => (
          <div key={order.orderId} className="w-full rounded border border-gray-200 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs text-gray-500">{formatDateTime(order.createdAt)}</p>
              {order.orderStatus !== '주문취소' && (
                <button
                  type="button"
                  onClick={() => handleCancelOrder(order.orderId)}
                  className="text-xs text-gray-400 underline"
                >
                  주문 취소
                </button>
              )}
            </div>

            {order.items.map((item) => (
              <button
                key={item.productId}
                type="button"
                onClick={() => navigate(`/products/${item.productId}`)}
                className="flex w-full gap-3 border-b border-gray-100 py-3 text-left last:border-b-0"
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
              </button>
            ))}

            <div className="mt-2 border-t border-gray-200 pt-3">
              <p className="text-xs font-bold text-[#212B36]">배송지</p>
              <p className="mt-1 text-xs text-gray-500">
                {order.shippingRecipientName} · {formatPhoneNumber(order.shippingRecipientPhone)}
              </p>
              <p className="text-xs text-gray-500">
                {order.shippingMainAddress} {order.shippingDetailAddress}
              </p>
              {order.shippingDeliveryMessage && (
                <p className="text-xs text-gray-400">{order.shippingDeliveryMessage}</p>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-3">
              <span className="text-primary-200 text-sm font-bold">{order.orderStatus}</span>
              <span className="text-base font-bold text-red-300">
                {order.finalPaymentPrice.toLocaleString()}원
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}

export default OrderListPage;
