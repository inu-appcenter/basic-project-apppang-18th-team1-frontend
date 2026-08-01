import instance from './instance';

export interface OrderItem {
  productId: number;
  productName: string;
  thumbnailUrl: string;
  brandName: string;
  optionText: string;
  quantity: number;
  price: number;
}

export interface OrderData {
  orderId: number;
  orderStatus: string;
  totalProductPrice: number;
  totalDiscountPrice: number;
  finalPaymentPrice: number;
  items: OrderItem[];
}

export interface CreateOrderResponse {
  message: string;
  data: OrderData;
}

export const createOrder = (addressId: number, signal?: AbortSignal) => {
  return instance.post<CreateOrderResponse>('/orders', { addressId }, { signal });
};

export interface BuyNowRequest {
  productId: number;
  optionId: number;
  quantity: number;
  addressId: number;
}

export const buyNow = (data: BuyNowRequest, signal?: AbortSignal) => {
  return instance.post<CreateOrderResponse>('/orders/buy-now', data, { signal });
};

export interface BuyNowRequest {
  productId: number;
  optionId: number;
  quantity: number;
}

export const buyNow = (data: BuyNowRequest, signal?: AbortSignal) => {
  return instance.post<CreateOrderResponse>('/orders/buy-now', data, { signal });
};

export interface OrderListItem {
  orderId: number;
  orderStatus: string;
  finalPaymentPrice: number;
  createdAt: string;
  shippingRecipientName: string;
  shippingRecipientPhone: string;
  shippingMainAddress: string;
  shippingDetailAddress: string;
  shippingDeliveryMessage: string;
  items: OrderItem[];
}

export interface OrderListResponse {
  message: string;
  data: OrderListItem[];
}

export const getOrderList = (signal?: AbortSignal) => {
  return instance.get<OrderListResponse>('/orders', { signal });
};

export interface CancelOrderResponse {
  message: string;
  data: {
    orderId: number;
    orderStatus: string;
  };
}

export const cancelOrder = (orderId: number, signal?: AbortSignal) => {
  return instance.patch<CancelOrderResponse>(`/orders/${orderId}/cancel`, null, { signal });
};
