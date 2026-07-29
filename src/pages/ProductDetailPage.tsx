import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { LeftArrow, FilledHeart, EmptyHeart, Share } from '@/components/icons';
import {
  getProductDetail,
  toggleWishlist,
  type ProductDetail,
  type ProductVariant,
} from '@/api/product';
import { addToCart } from '@/api/cart';

// TODO: 배포된 API의 variants가 아직 전부 빈 배열이라 임시로 넣어둔 더미 데이터.
// 백엔드가 실제 variants를 내려주면 이 상수와 아래 fallback 코드를 제거할 것.
const DUMMY_VARIANTS: ProductVariant[] = [
  {
    variantId: 2001,
    variantName: '옵션 1',
    price: 12000,
    shippingType: '로켓배송',
    saveAmount: 3000,
    isPopular: true,
  },
  {
    variantId: 2002,
    variantName: '옵션 2',
    price: 12500,
    shippingType: '새벽배송',
    saveAmount: 2500,
    isPopular: false,
  },
];

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

  useEffect(() => {
    if (!productId) return undefined;

    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getProductDetail(productId, controller.signal);
        const variants =
          response.data.variants.length > 0 ? response.data.variants : DUMMY_VARIANTS;

        setProduct({ ...response.data, variants });
        setIsWished(response.data.isWishlist);
        setCurrentImage(0);
        setSelectedVariantId(variants.find((variant) => variant.isPopular)?.variantId ?? null);
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
      <div className="flex flex-col gap-2 px-4 py-3">
        <div className="flex justify-end">
          <button type="button">
            <Share size={24} color="#212B36" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 px-2">
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
