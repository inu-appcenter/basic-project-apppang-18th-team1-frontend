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

export const createOrder = (signal?: AbortSignal) => {
  return instance.post<CreateOrderResponse>('/orders', undefined, { signal });
};
