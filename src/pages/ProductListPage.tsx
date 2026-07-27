import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LeftArrow } from '@/components/icons';
import { getProductList } from '@/api/product';

function ProductListPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const SORT_OPTIONS = ['랭킹순', '최신순', '최저가순', '최고가순'];
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]);
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const productCount = 10;

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await getProductList({
        category: searchKeyword ?? '',
        sort: undefined,
        page: 0,
        size: 20,
      });

      setProducts(response.data.data.products);
      setIsLastPage(response.data.data.isLastPage);
    } catch {
      setError('상품을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="relative flex w-full flex-col items-center gap-3 bg-white px-3 pb-10">
      {/* Header */}
      <header className="flex h-[72px] w-full items-center justify-center py-5">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <LeftArrow size={24} color="#212B36" />
        </button>

        <h1 className="text-[20px] leading-none font-bold">{searchKeyword}</h1>
      </header>
      {/* Sort Dropdown */}
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
      {/* Product List */}
      <div className="w-full">
        {products.map((product) => (
          <div key={index}>
            <div className="h-[152px] w-full" />
            <div className="h-px w-full bg-gray-200" />
          </div>
        ))}
      </div>
      <div className="w-full py-3 text-center text-sm text-gray-300">마지막 상품입니다</div>
    </div>
  );
}

export default ProductListPage;
