import instance from './instance';

export interface SearchRequest {
  keyword: string;
  sort?: 'RANKING' | 'LATEST' | 'LOW_PRICE' | 'HIGH_PRICE';
  page?: number;
  size?: number;
}

export interface SearchProduct {
  productId: number;
  thumbnailUrl: string;
  productName: string;
  originalPrice: number;
  discountRate: number;
  salePrice: number;
  rating: number;
  reviewCount: number;
}

export interface SearchResponse {
  message: string;
  data: {
    keyword: string;
    products: SearchProduct[];
    isLastPage: boolean;
  };
}

export const searchProducts = (params: SearchRequest, signal?: AbortSignal) => {
  return instance.get<SearchResponse>('/search', { params, signal });
};

export interface AutocompleteResponse {
  message: string;
  suggestions: string[];
}

export const getAutocompleteSuggestions = (keyword: string, signal?: AbortSignal) => {
  return instance.get<AutocompleteResponse>('/search/autocomplete', {
    params: { keyword },
    signal,
  });
};

export interface SearchInitResponse {
  message: string;
  recommendKeywords: string[];
}

export const getSearchInit = (signal?: AbortSignal) => {
  return instance.get<SearchInitResponse>('/search/init', { signal });
};
