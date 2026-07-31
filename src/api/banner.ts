import instance from './instance';

export interface MainBannerProduct {
  id: number;
  brandName: string;
  name: string;
  originPrice: number;
  discountRate: number;
  salePrice: number;
  mainImageUrl: string;
}

export interface MainBanner {
  rank: number;
  product: MainBannerProduct;
}

export interface MainBannerResponse {
  message: string;
  data: MainBanner[];
}

export const getMainBanners = (limit = 3, signal?: AbortSignal) => {
  return instance.get<MainBannerResponse>('/main-banners', {
    params: { limit },
    signal,
  });
};
