import instance from './instance';

export interface ProductRequest {
  category: string;
  sort?: string;
  page: number;
  size: number;
}

export const getProductList = (params: ProductRequest) => {
  return instance.get('/products', {
    params,
  });
};

export interface Product {
  productId: number;
  thumbnailUrl: string;
  productName: string;
  originalPrice: number;
  discountRate: number;
  salePrice: number;
  unitPrice: string;
  rating: number;
  reviewCount: number;
}

export interface ProductResponse {
  message: string;
  data: {
    products: Product[];
    isLastPage: boolean;
  };
}
