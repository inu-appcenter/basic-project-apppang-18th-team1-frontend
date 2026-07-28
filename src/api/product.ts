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
