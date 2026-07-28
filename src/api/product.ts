import instance from './instance';

export interface ProductRequest {
  category?: string;
  sort?: 'ranking' | 'latest' | 'priceLow' | 'priceHigh';
  page?: number;
  size?: number;
}

export interface Product {
  id: number;
  brandName: string;
  name: string;
  originPrice: number;
  discountRate: number;
  salePrice: number;
  mainImageUrl: string;
  unitPriceText: string | null;
}

export interface ProductListResponse {
  message?: string;
  products: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
export const getProductList = (params: ProductRequest, signal?: AbortSignal) => {
  return instance.get<ProductListResponse>('/products', {
    params,
    signal,
  });
};

export interface ProductBrand {
  brandId: number;
  brandName: string;
  brandLogoUrl: string | null;
}

export interface ProductVariant {
  variantId: number;
  variantName: string;
  price: number;
  shippingType: string;
  saveAmount: number;
  isPopular: boolean;
}

export interface ProductDetail {
  productId: number;
  productImages: string[];
  isWishlist: boolean;
  brand: ProductBrand;
  productName: string;
  originalPrice: number;
  discountRate: number;
  salePrice: number;
  unitPriceText: string | null;
  variants: ProductVariant[];
  detailImages: string[];
}

// TODO: 명세는 { message, data: {...} } 형태지만 실제 배포된 API는 message/data 래핑 없이
// ProductDetail 필드가 최상위로 바로 온다(상품 리스트 API와 동일한 패턴). 백엔드가 명세대로
// 수정되면 response.data.data 형태로 다시 바꿔야 함.
export const getProductDetail = (productId: string | number, signal?: AbortSignal) => {
  return instance.get<ProductDetail>(`/products/${productId}`, { signal });
};
