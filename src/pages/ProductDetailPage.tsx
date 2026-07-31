import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LeftArrow, FilledHeart, EmptyHeart, Share, Pencil, Star } from '@/components/icons';
import { getProductDetail, toggleWishlist, type ProductDetail } from '@/api/product';
import { addToCart } from '@/api/cart';
import {
  createReview,
  getReviews,
  updateReview,
  getReviewOwnership,
  type ReviewListItem,
} from '@/api/review';

const REVIEW_PAGE_SIZE = 10;
const REVIEW_CONTENT_PREVIEW_LIMIT = 100;
const REVIEW_CONTENT_MAX_LENGTH = 1000;

function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const touchStartX = useRef(0);
  const [isWished, setIsWished] = useState(false);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState<ReviewListItem[]>([]);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsTotalPages, setReviewsTotalPages] = useState(1);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [expandedReviewIds, setExpandedReviewIds] = useState<Set<number>>(new Set());
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editContent, setEditContent] = useState('');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [ownedReviewIds, setOwnedReviewIds] = useState<Set<number>>(new Set());

  const loadReviewOwnership = useCallback(
    async (reviewList: ReviewListItem[]) => {
      if (!productId || !localStorage.getItem('accessToken') || reviewList.length === 0) return;

      const results = await Promise.all(
        reviewList.map(async (review) => {
          try {
            const response = await getReviewOwnership(productId, review.reviewId);
            return response.data.isOwner ? review.reviewId : null;
          } catch (err) {
            console.error('리뷰 작성자 확인 실패', err);
            return null;
          }
        }),
      );

      setOwnedReviewIds((prev) => {
        const next = new Set(prev);
        results.forEach((reviewId) => {
          if (reviewId !== null) next.add(reviewId);
        });
        return next;
      });
    },
    [productId],
  );

  const loadReviews = useCallback(
    async (page: number) => {
      if (!productId) return;

      try {
        setReviewsLoading(true);
        const response = await getReviews(productId, { page, size: REVIEW_PAGE_SIZE });
        setReviews((prev) =>
          page === 1 ? response.data.reviews : [...prev, ...response.data.reviews],
        );
        setReviewsPage(response.data.page);
        setReviewsTotalPages(response.data.totalPages);
        loadReviewOwnership(response.data.reviews);
      } catch (err) {
        console.error('리뷰 조회 실패', err);
      } finally {
        setReviewsLoading(false);
      }
    },
    [productId, loadReviewOwnership],
  );

  useEffect(() => {
    loadReviews(1);
  }, [loadReviews]);

  const toggleReviewExpand = (reviewId: number) => {
    setExpandedReviewIds((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      return next;
    });
  };

  const handleLoadMoreReviews = () => {
    loadReviews(reviewsPage + 1);
  };

  useEffect(() => {
    if (!productId) return undefined;

    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getProductDetail(productId, controller.signal);

        setProduct(response.data);
        setIsWished(response.data.isWishlist);
        setCurrentImage(0);
        setSelectedVariantId(
          response.data.variants.find((variant) => variant.isPopular)?.variantId ?? null,
        );
        setQuantity(1);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error('에러 발생', err);
        setError('상품 정보를 불러오지 못했습니다.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, [productId]);

  const images = product?.productImages ?? [];
  const selectedVariant = product?.variants.find(
    (variant) => variant.variantId === selectedVariantId,
  );

  const handleWishClick = async () => {
    if (!productId) return;

    if (!localStorage.getItem('accessToken')) {
      alert('로그인이 필요한 기능입니다.');
      navigate('/login');
      return;
    }

    try {
      const response = await toggleWishlist(productId);
      setIsWished(response.data.isWishlist);
    } catch (err) {
      console.error('찜하기 요청 실패', err);
    }
  };

  const handleAddToCart = async () => {
    if (!productId) return;

    if (!localStorage.getItem('accessToken')) {
      alert('로그인이 필요한 기능입니다.');
      navigate('/login');
      return;
    }

    if (!selectedVariantId) {
      alert('옵션을 선택해주세요.');
      return;
    }

    try {
      const response = await addToCart({
        productId: Number(productId),
        optionId: selectedVariantId,
        quantity,
      });
      alert(response.data.message);
    } catch (err) {
      console.error('장바구니 담기 실패', err);
    }
  };

  const handleToggleReviewForm = () => {
    if (!localStorage.getItem('accessToken')) {
      alert('로그인이 필요한 기능입니다.');
      navigate('/login');
      return;
    }

    setShowReviewForm((prev) => !prev);
  };

  const handleSubmitReview = async () => {
    if (!productId) return;

    if (!localStorage.getItem('accessToken')) {
      alert('로그인이 필요한 기능입니다.');
      navigate('/login');
      return;
    }

    if (reviewRating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }

    if (!reviewContent.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const response = await createReview(productId, {
        rating: reviewRating,
        content: reviewContent,
        mediaList: [],
      });
      alert(response.data.message);
      setReviewRating(0);
      setReviewContent('');
      setShowReviewForm(false);
      loadReviews(1);
    } catch (err) {
      console.error('리뷰 작성 실패', err);
      alert('리뷰 작성에 실패했습니다.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleToggleEditReview = (review: ReviewListItem) => {
    if (!localStorage.getItem('accessToken')) {
      alert('로그인이 필요한 기능입니다.');
      navigate('/login');
      return;
    }

    if (editingReviewId === review.reviewId) {
      setEditingReviewId(null);
      return;
    }

    setEditingReviewId(review.reviewId);
    setEditRating(review.rating);
    setEditContent(review.content);
  };

  const handleUpdateReview = async (reviewId: number) => {
    if (!productId) return;

    if (editRating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }

    if (!editContent.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmittingEdit(true);
      const response = await updateReview(productId, reviewId, {
        rating: editRating,
        content: editContent,
      });
      alert(response.data.message);
      setReviews((prev) =>
        prev.map((review) =>
          review.reviewId === reviewId
            ? { ...review, rating: editRating, content: editContent }
            : review,
        ),
      );
      setEditingReviewId(null);
    } catch (err) {
      console.error('리뷰 수정 실패', err);
      alert('리뷰 수정에 실패했습니다.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (images.length <= 1) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentImage((prev) => (prev + 1) % images.length);
      } else {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center py-20 text-sm text-gray-400">
        불러오는 중...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="relative flex w-full flex-col bg-white">
        <header className="flex h-[72px] w-full items-center py-5">
          <button type="button" onClick={() => navigate(-1)} className="p-1">
            <LeftArrow size={24} color="#212B36" />
          </button>
        </header>
        <div className="w-full py-20 text-center text-sm text-red-400">
          {error || '상품 정보를 불러오지 못했습니다.'}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full flex-col bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 z-10 flex h-[72px] w-full items-center py-5">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <LeftArrow size={24} color="#212B36" />
        </button>
      </header>
      {/* Image Slider */}
      <div
        className="grid w-full overflow-hidden"
        style={{ height: '390px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="col-start-1 row-start-1 flex h-[390px] transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentImage * 100}%)` }}
        >
          {images.length > 0 ? (
            images.map((imageUrl, index) => (
              <div
                key={imageUrl}
                className="flex h-[390px] min-w-full items-center justify-center bg-gray-100"
              >
                <img
                  src={imageUrl}
                  alt={`${product.productName} 이미지 ${index + 1}`}
                  className="h-[390px] w-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="flex h-[390px] min-w-full items-center justify-center bg-gray-100">
              <span className="text-gray-400">상품 이미지 없음</span>
            </div>
          )}
        </div>
        <div className="pointer-events-none z-10 col-start-1 row-start-1 flex items-end justify-center gap-2 pb-4">
          {images.map((imageUrl, index) => (
            <button
              key={imageUrl}
              type="button"
              onClick={() => setCurrentImage(index)}
              className={`pointer-events-auto h-2 w-2 rounded-full transition-colors ${index === currentImage ? 'bg-black' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        {/* Wished Button */}
        <div className="pointer-events-none z-10 col-start-1 row-start-1 flex items-end justify-end pr-4 pb-4">
          <button
            type="button"
            onClick={handleWishClick}
            className="pointer-events-auto flex items-center justify-center rounded-full bg-white p-1.5"
          >
            {isWished ? (
              <FilledHeart size={24} color="#CB1400" />
            ) : (
              <EmptyHeart size={24} color="#212B36" />
            )}
          </button>
        </div>
      </div>
      {/* Product Information */}
      <div className="mt-2 flex items-center gap-2 px-2">
        {product.brand.brandLogoUrl ? (
          <img
            src={product.brand.brandLogoUrl}
            alt={product.brand.brandName}
            className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200" />
        )}
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-1">
            <span className="text-[14px] font-bold text-[#212B36]">{product.brand.brandName}</span>
            <span className="text-[14px] font-bold text-[#212B36]">&gt;</span>
          </div>
          <button type="button" className="text-left text-[12px] text-gray-300">
            브랜드 상품 모아보기
          </button>
        </div>
      </div>
      <p className="line-clamp-2 px-2 py-1 text-base">{product.productName}</p>
      <div className="flex flex-col gap-1">
        <div className="flex items-center px-2">
          {product.discountRate > 0 && (
            <span className="inline-block min-w-[50px] bg-red-300 py-0.5 pr-4 pl-2 text-left text-sm font-bold text-white [clip-path:polygon(0_0,100%_0,80%_100%,0_100%)]">
              {product.discountRate}%
            </span>
          )}
          <span className="text-xl font-bold text-red-300">
            {product.salePrice.toLocaleString()}원
          </span>
          {product.discountRate > 0 && (
            <span className="text-sm text-gray-400 line-through">
              {product.originalPrice.toLocaleString()}원
            </span>
          )}
        </div>
      </div>
      {/* Divider */}
      <div className="my-2 h-2 w-full bg-gray-100" />
      {/* Variants */}
      {product.variants.length > 0 && (
        <div className="flex flex-col gap-3 px-2 py-3">
          <div className="flex flex-wrap items-end gap-2">
            {product.variants.map((variant) => (
              <div key={variant.variantId} className="flex flex-col items-center gap-1">
                {variant.isPopular && (
                  <span className="text-primary-200 text-xs font-bold">인기 상품</span>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedVariantId(variant.variantId)}
                  className={`flex h-24 w-[100px] flex-col items-center justify-center rounded border px-1 py-2 text-center text-sm leading-tight font-semibold ${
                    selectedVariantId === variant.variantId
                      ? 'border-primary-200 text-primary-200'
                      : 'border-gray-200 text-[#212B36]'
                  }`}
                >
                  {variant.variantName}
                </button>
              </div>
            ))}
          </div>

          {selectedVariant && (
            <div className="flex flex-wrap items-center gap-2 px-1">
              <span className="text-lg font-bold text-red-300">
                {(product.salePrice + selectedVariant.price).toLocaleString()}원
              </span>
              <span className="text-sm text-gray-500">
                {selectedVariant.saveAmount.toLocaleString()}원 할인
              </span>
              <span className="text-sm text-gray-500">{selectedVariant.shippingType}</span>

              {/* 수량 선택 (증감 버튼 방식) */}
              <div className="flex items-center rounded border border-gray-200">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-2 py-1 text-sm text-[#212B36]"
                >
                  -
                </button>
                <span className="w-6 text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="px-2 py-1 text-sm text-[#212B36]"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* 상품 정보 */}
      <div className="mt-5 flex flex-col">
        <p className="px-2 text-base font-bold text-[#212B36]">상품 정보</p>
        <div className="my-2 h-2 w-full bg-gray-100" />
        {product.detailImages.map((imageUrl, index) => (
          <img
            key={imageUrl}
            src={imageUrl}
            alt={`${product.productName} 상세 이미지 ${index + 1}`}
            className="w-full"
          />
        ))}
      </div>
      <div className="my-2 h-2 w-full bg-gray-100" />
      {/* 상품 리뷰 */}
      <div className="mb-20 flex flex-col">
        <p className="px-2 pt-4 pb-3 text-base font-bold text-[#212B36]">상품 리뷰</p>
        <div className="border-t border-gray-100" />
        <p className="px-2 py-3 text-xs text-gray-400">
          동일한 상품에 대해 작성된 상품평으로, 판매자는 다를 수 있습니다.
        </p>
        <div className="flex items-center justify-end px-2 pb-5">
          <button
            type="button"
            onClick={handleToggleReviewForm}
            className="border-primary-200 text-primary-200 flex items-center gap-1 rounded border px-3 py-1.5 text-sm font-bold"
          >
            <Pencil size={15} color="#346AFF" /> 리뷰 작성하기
          </button>
        </div>

        {showReviewForm && (
          <div className="flex flex-col gap-4 border-t border-gray-100 px-2 pt-4 pb-6">
            {/* 별점 */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setReviewRating(score)}
                  className="p-0.5"
                >
                  <Star
                    size={28}
                    color={score <= reviewRating ? '#F5B000' : '#CDCDCD'}
                    fill={score <= reviewRating ? '#F5B000' : '#CDCDCD'}
                  />
                </button>
              ))}
            </div>

            {/* 리뷰 본문 */}
            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="상품에 대한 리뷰를 남겨주세요."
              maxLength={REVIEW_CONTENT_MAX_LENGTH}
              className="min-h-[180px] w-full resize-none rounded border border-gray-200 p-3 text-sm"
            />

            <button
              type="button"
              onClick={handleSubmitReview}
              disabled={isSubmittingReview}
              className="bg-primary-200 w-full rounded py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              등록하기
            </button>
          </div>
        )}

        {/* 구분선 */}
        <div className="border-t border-gray-100" />

        {/* 리뷰 목록 */}
        <div className="flex flex-col">
          {!reviewsLoading && reviews.length === 0 && (
            <p className="px-2 py-10 text-center text-sm text-gray-400">
              아직 작성된 리뷰가 없습니다.
            </p>
          )}

          {reviews.map((review) => {
            const isExpanded = expandedReviewIds.has(review.reviewId);
            const isLongContent = review.content.length > REVIEW_CONTENT_PREVIEW_LIMIT;
            const isEditing = editingReviewId === review.reviewId;

            return (
              <div
                key={review.reviewId}
                className="flex flex-col gap-2 border-b border-gray-100 px-2 py-4 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      <Star
                        size={14}
                        color={review.rating >= 1 ? '#F5B000' : '#CDCDCD'}
                        fill={review.rating >= 1 ? '#F5B000' : '#CDCDCD'}
                      />
                      <Star
                        size={14}
                        color={review.rating >= 2 ? '#F5B000' : '#CDCDCD'}
                        fill={review.rating >= 2 ? '#F5B000' : '#CDCDCD'}
                      />
                      <Star
                        size={14}
                        color={review.rating >= 3 ? '#F5B000' : '#CDCDCD'}
                        fill={review.rating >= 3 ? '#F5B000' : '#CDCDCD'}
                      />
                      <Star
                        size={14}
                        color={review.rating >= 4 ? '#F5B000' : '#CDCDCD'}
                        fill={review.rating >= 4 ? '#F5B000' : '#CDCDCD'}
                      />
                      <Star
                        size={14}
                        color={review.rating >= 5 ? '#F5B000' : '#CDCDCD'}
                        fill={review.rating >= 5 ? '#F5B000' : '#CDCDCD'}
                      />
                    </div>
                    <span className="text-xs font-medium text-[#212B36]">{review.nickname}</span>
                  </div>
                  {ownedReviewIds.has(review.reviewId) && (
                    <button
                      type="button"
                      onClick={() => handleToggleEditReview(review)}
                      className="text-xs text-gray-400 underline"
                    >
                      수정하기
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex flex-col gap-4 pt-1">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => setEditRating(score)}
                          className="p-0.5"
                        >
                          <Star
                            size={28}
                            color={score <= editRating ? '#F5B000' : '#CDCDCD'}
                            fill={score <= editRating ? '#F5B000' : '#CDCDCD'}
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="상품에 대한 리뷰를 남겨주세요."
                      maxLength={REVIEW_CONTENT_MAX_LENGTH}
                      className="min-h-[180px] w-full resize-none rounded border border-gray-200 p-3 text-sm"
                    />

                    <button
                      type="button"
                      onClick={() => handleUpdateReview(review.reviewId)}
                      disabled={isSubmittingEdit}
                      className="bg-primary-200 w-full rounded py-3 text-sm font-bold text-white disabled:opacity-50"
                    >
                      수정하기
                    </button>
                  </div>
                ) : (
                  <>
                    <p className={`text-sm text-[#212B36] ${isExpanded ? '' : 'line-clamp-3'}`}>
                      {review.content}
                    </p>

                    {isLongContent && (
                      <button
                        type="button"
                        onClick={() => toggleReviewExpand(review.reviewId)}
                        className="self-start text-xs text-gray-400 underline"
                      >
                        {isExpanded ? '접기' : '더보기'}
                      </button>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">도움돼요 {review.helpfulCount}</span>
                      <button
                        type="button"
                        className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-500"
                      >
                        도움돼요
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {reviewsPage < reviewsTotalPages && (
            <button
              type="button"
              onClick={handleLoadMoreReviews}
              disabled={reviewsLoading}
              className="mx-2 my-3 rounded border border-gray-200 py-2 text-sm text-gray-500 disabled:opacity-50"
            >
              {reviewsLoading ? '불러오는 중...' : '리뷰 더보기'}
            </button>
          )}
        </div>
      </div>
      {/* Bottom CTA */}
      <div className="fixed bottom-16 left-1/2 z-40 w-full max-w-120 -translate-x-1/2 bg-white px-3 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="text-primary-200 border-primary-200 flex-1 rounded border py-3 font-bold"
          >
            장바구니 담기
          </button>
          <button className="bg-primary-200 flex-1 rounded py-3 font-bold text-white">
            바로구매
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProductDetailPage;
