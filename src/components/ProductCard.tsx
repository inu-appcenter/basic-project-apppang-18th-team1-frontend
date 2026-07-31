import { useNavigate } from 'react-router-dom';
import type { Product } from '@/api/product';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/products/${product.id}`)}
      className="flex w-full gap-3 border-b border-gray-200 p-3 text-left"
    >
      {/* 상품 이미지 */}
      <img
        src={product.mainImageUrl}
        alt={product.name}
        className="h-28 w-28 shrink-0 rounded object-cover"
      />

      {/* 상품 정보 */}
      <div className="flex flex-1 flex-col justify-between">
        {/* 브랜드명 */}
        <p className="text-xs text-gray-500">{product.brandName}</p>

        {/* 상품명 */}
        <p className="line-clamp-2 text-sm font-medium">{product.name}</p>

        {/* 원가 */}
        <p className="text-xs text-gray-400 line-through">
          {product.originPrice.toLocaleString()}원
        </p>

        {/* 할인율 + 판매가 */}
        <div className="flex items-center gap-1">
          {product.discountRate > 0 && (
            <span className="inline-block min-w-[50px] bg-red-300 py-0.5 pr-4 pl-2 text-left text-sm font-bold text-white [clip-path:polygon(0_0,100%_0,80%_100%,0_100%)]">
              {product.discountRate}%
            </span>
          )}

          <span className="text-lg font-bold text-red-300">
            {product.salePrice.toLocaleString()}원
          </span>
        </div>
      </div>
    </button>
  );
}

export default ProductCard;
