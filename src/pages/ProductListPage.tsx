import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { LeftArrow } from '@/components/icons';
import { getProductList, getWishlist, type Product } from '@/api/product';
import { searchProducts } from '@/api/search';
import ProductCard from '@/components/ProductCard';
import { CATEGORY_LABELS } from '@/constants/category';

const SORT_OPTIONS = ['랭킹순', '최신순', '최저가순', '최고가순'] as const;
const SORT_MAP: Record<
  (typeof SORT_OPTIONS)[number],
  'ranking' | 'latest' | 'priceLow' | 'priceHigh'
> = {
  랭킹순: 'ranking',
  최신순: 'latest',
  최저가순: 'priceLow',
  최고가순: 'priceHigh',
};
const SEARCH_SORT_MAP: Record<
  (typeof SORT_OPTIONS)[number],
  'RANKING' | 'LATEST' | 'LOW_PRICE' | 'HIGH_PRICE'
> = {
  랭킹순: 'RANKING',
  최신순: 'LATEST',
  최저가순: 'LOW_PRICE',
  최고가순: 'HIGH_PRICE',
};

function ProductListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isWishlistMode = location.pathname === '/wishlist';
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<(typeof SORT_OPTIONS)[number]>(SORT_OPTIONS[0]);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') ?? undefined;
  const searchKeyword = searchParams.get('search') ?? '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const pageTitle = isWishlistMode
    ? '찜리스트'
    : categoryParam
      ? (CATEGORY_LABELS[categoryParam] ?? categoryParam)
      : searchKeyword;
  // category가 있으면 카테고리 조회, 없고 검색어만 있으면 검색 API 사용
  const isSearchMode = !isWishlistMode && !categoryParam && searchKeyword.length > 0;

  // 카테고리/검색어/정렬이 바뀌면 이전 page(예: 더보기로 늘어난 값)를 그대로 요청하지 않도록
  // 같은 effect 안에서 필터 변경 여부를 확인해 요청 page를 0으로 맞춘다.
  const filterKey = `${isWishlistMode}::${categoryParam ?? ''}::${searchKeyword}::${selectedSort}`;
  const prevFilterKeyRef = useRef(filterKey);
  const hasAlertedRef = useRef(false);

  useEffect(() => {
    const filterChanged = filterKey !== prevFilterKeyRef.current;
    prevFilterKeyRef.current = filterKey;

    if (filterChanged && page !== 0) {
      setPage(0);
      setProducts([]);
      return undefined; // page가 0으로 바뀌면 이 effect가 다시 실행되면서 실제 요청을 보냄
    }

    if (isWishlistMode && !localStorage.getItem('accessToken')) {
      if (!hasAlertedRef.current) {
        hasAlertedRef.current = true;
        alert('로그인이 필요한 기능입니다.');
        navigate('/login');
      }
      return undefined;
    }

    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        if (isWishlistMode) {
          const response = await getWishlist(controller.signal);
          setProducts(response.data.data);
          setIsLastPage(true);
        } else if (isSearchMode) {
          const response = await searchProducts(
            {
              keyword: searchKeyword,
              sort: SEARCH_SORT_MAP[selectedSort],
              page: page + 1, // 검색 API는 실제로 1부터 시작 (page=0은 400)
              size: 20,
            },
            controller.signal,
          );

          const { products: searchResults, isLastPage: lastPage } = response.data.data;
          const mapped: Product[] = searchResults.map((item) => ({
            id: item.productId,
            brandName: '',
            name: item.productName,
            originPrice: item.originalPrice,
            discountRate: item.discountRate,
            salePrice: item.salePrice,
            mainImageUrl: item.thumbnailUrl,
          }));

          setProducts((prev) => (page === 0 ? mapped : [...prev, ...mapped]));
          setIsLastPage(lastPage);
        } else {
          const response = await getProductList(
            {
              category: categoryParam,
              sort: SORT_MAP[selectedSort],
              // TODO: 명세상 page는 0-indexed(기본값 0)인데, 실제 배포된 API는 page=0을 보내면
              // 400("page는 0 이상이어야 합니다")을 반환하고 page=1을 보내야 첫 페이지가 옴.
              // 백엔드가 내부적으로 1을 빼는 것으로 추정되어 +1 보정. 백엔드 수정되면 제거 필요.
              page: page + 1,
              size: 20,
            },
            controller.signal, // instance.get 두번째 인자로 signal 전달
          );

          const { products: newProducts, totalPages: newTotalPages } = response.data;

          setProducts((prev) => (page === 0 ? newProducts : [...prev, ...newProducts]));
          setIsLastPage(newTotalPages === 0 || page + 1 >= newTotalPages);
        }
      } catch (err) {
        if (controller.signal.aborted) return; // 취소된 요청은 무시
        console.error('에러 발생', err);
        setError('상품을 불러오지 못했습니다.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort(); // 클린업 시 이전 요청 취소
  }, [filterKey, page, categoryParam, selectedSort, searchKeyword, isSearchMode, isWishlistMode]);

  return (
    <div className="relative flex w-full flex-col items-center gap-3 bg-white px-3 pb-10">
      {/* Header */}
      <header className="flex h-[72px] w-full items-center justify-center py-5">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <LeftArrow size={24} color="#212B36" />
        </button>
        <h1 className="text-[20px] leading-none font-bold">{pageTitle}</h1>
      </header>

      {/* Sort Dropdown */}
      {!isWishlistMode && (
        <div className="flex w-full justify-end border-b border-gray-200 px-3 py-2">
          <div className="relative text-sm">
            <button type="button" onClick={() => setIsOpen((prev) => !prev)}>
              {selectedSort}
              {isOpen ? '▲' : '▼'}
            </button>
            <ul
              className={`absolute top-full left-1/2 z-10 w-18 -translate-x-1/2 transform divide-y divide-gray-200 overflow-hidden bg-white text-center shadow-md transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              {SORT_OPTIONS.map((option) => (
                <li key={option}>
                  <button
                    onClick={() => {
                      setSelectedSort(option);
                      setIsOpen(false);
                    }}
                    className="w-full px-2 py-2 text-sm hover:bg-gray-100"
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Product List */}
      {error && <div className="w-full py-10 text-center text-sm text-red-400">{error}</div>}

      {!loading && !error && isWishlistMode && products.length === 0 && (
        <div className="w-full py-10 text-center text-sm text-gray-400">찜한 상품이 없습니다.</div>
      )}

      {!error && (
        <div className="w-full">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {loading && (
        <div className="w-full py-4 text-center text-sm text-gray-400">불러오는 중...</div>
      )}

      {!loading && !error && !isLastPage && products.length > 0 && (
        <button
          type="button"
          onClick={() => setPage((prev) => prev + 1)}
          className="w-full py-3 text-center text-sm text-gray-500"
        >
          더보기
        </button>
      )}

      {isLastPage && !loading && products.length > 0 && (
        <div className="w-full py-3 text-center text-sm text-gray-300">마지막 상품입니다</div>
      )}
    </div>
  );
}

export default ProductListPage;
