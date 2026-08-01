import instance from './instance';

export interface AddToCartRequest {
  productId: number;
  optionId: number;
  quantity: number;
}

export interface CartSummary {
  totalOriginPrice: number;
  totalInstantDiscount: number;
  totalCouponDiscount: number;
  totalShippingFee: number;
  totalPaymentAmount: number;
}

export interface CartItem {
  cartItemId: number;
  productId: number;
  optionId: number;
  quantity: number;
  maxQuantity: number;
  summary: CartSummary;
}

export interface AddToCartResponse {
  message: string;
  data: CartItem;
}

export const addToCart = (body: AddToCartRequest, signal?: AbortSignal) => {
  return instance.post<AddToCartResponse>('/cart', body, { signal });
};

export interface CartListItem {
  cartItemId: number;
  productId: number;
  productName: string;
  thumbnailUrl: string;
  brandName: string;
  optionText: string;
  estimatedArrivalDate: string;
  quantity: number;
  maxQuantity: number;
  isSelected: boolean;
  price: {
    originalPrice: number;
    wowCouponDiscountRate: number;
    salePrice: number;
  };
}

export interface CartShippingGroup {
  groupId: number;
  shippingBadge: string;
  items: CartListItem[];
}

export interface CartListSummary {
  totalProductPrice: number;
  totalCouponDiscount: number;
  totalPaymentAmount: number;
}

export interface CartListResponse {
  message: string;
  data: {
    shippingGroups: CartShippingGroup[];
    summary: CartListSummary;
  };
}

export const getCartList = (signal?: AbortSignal) => {
  return instance.get<CartListResponse>('/cart', { signal });
};

export interface DeleteCartItemResponse {
  message: string;
  data: {
    cartItemId: number;
    summary: {
      totalProductPrice: number;
      totalDiscount: number;
      totalPaymentAmount: number;
    };
  };
}

// 명세서는 cartItemId를 쿼리파라미터로 받는다고 되어 있지만, 실제로는 경로 파라미터
// (DELETE /cart/{cartItemId})로 동작함을 확인함.
export const deleteCartItem = (cartItemId: number, signal?: AbortSignal) => {
  return instance.delete<DeleteCartItemResponse>(`/cart/${cartItemId}`, { signal });
};

export interface ToggleCartItemSelectionResponse {
  message: string;
  cartItemId: number;
  isSelected: boolean;
}

export const toggleCartItemSelection = (
  cartItemId: number,
  isSelected: boolean,
  signal?: AbortSignal,
) => {
  return instance.patch<ToggleCartItemSelectionResponse>(
    `/cart/${cartItemId}/select`,
    { isSelected },
    { signal },
  );
};
