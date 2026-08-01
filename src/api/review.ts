import instance from './instance';

export interface ReviewMedia {
  mediaUrl: string;
  mediaType: string;
  duration: number;
}

export interface CreateReviewRequest {
  rating: number;
  content: string;
  mediaList: ReviewMedia[];
}

export interface CreateReviewResponse {
  message: string;
  reviewId: number;
}

export const createReview = (
  productId: string | number,
  body: CreateReviewRequest,
  signal?: AbortSignal,
) => {
  return instance.post<CreateReviewResponse>(`/products/${productId}/reviews`, body, { signal });
};

export interface ReviewListItem {
  reviewId: number;
  nickname: string;
  rating: number;
  content: string;
  helpfulCount: number;
  isHelpful: boolean;
  thumbnailUrl: string | null;
}

export interface ReviewListResponse {
  reviews: ReviewListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const getReviews = (
  productId: string | number,
  params: { page: number; size: number },
  signal?: AbortSignal,
) => {
  return instance.get<ReviewListResponse>(`/products/${productId}/reviews`, {
    params,
    signal,
  });
};

export interface UpdateReviewRequest {
  rating: number;
  content: string;
}

export interface UpdateReviewResponse {
  message: string;
  reviewId: number;
}

export const updateReview = (
  productId: string | number,
  reviewId: number,
  body: UpdateReviewRequest,
  signal?: AbortSignal,
) => {
  return instance.patch<UpdateReviewResponse>(`/products/${productId}/reviews/${reviewId}`, body, {
    signal,
  });
};

export interface ToggleReviewHelpfulResponse {
  message: string;
  isHelpful: boolean;
  helpfulCount: number;
}

export const toggleReviewHelpful = (
  productId: string | number,
  reviewId: number,
  signal?: AbortSignal,
) => {
  return instance.post<ToggleReviewHelpfulResponse>(
    `/products/${productId}/reviews/${reviewId}/helpful`,
    null,
    { signal },
  );
};

export interface ReviewOwnershipResponse {
  isOwner: boolean;
}

export const getReviewOwnership = (
  productId: string | number,
  reviewId: number,
  signal?: AbortSignal,
) => {
  return instance.get<ReviewOwnershipResponse>(
    `/products/${productId}/reviews/${reviewId}/ownership`,
    { signal },
  );
};
