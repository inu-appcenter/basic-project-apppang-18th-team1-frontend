import {
  Human,
  Gear,
  Receipt,
  FilledHeart,
  ShoppingBag,
  HandBag,
  LayoutGrid,
} from '@/components/icons';
import { useNavigate } from 'react-router-dom';

function MyPage() {
  const navigate = useNavigate();
  const menuItems = [
    {
      label: '주문내역',
      path: '/orders',
      icon: <Receipt size={24} color="#346AFF" />,
    },
    {
      label: '찜리스트',
      path: '/wishlist',
      icon: <FilledHeart size={24} color="#346AFF" />,
    },
    {
      label: '최근본상품',
      path: '/recent-products',
      icon: <ShoppingBag size={24} color="#346AFF" />,
    },
    {
      label: '자주산상품',
      path: '/frequent-products',
      icon: <HandBag size={24} color="#346AFF" />,
    },
    {
      label: '전체메뉴',
      path: '/all-menu',
      icon: <LayoutGrid size={24} color="#346AFF" />,
    },
  ];

  return (
    <div className="relative flex w-full flex-col bg-white">
      <header className="bg-primary-100 flex h-[72px] w-full items-center justify-between px-4 py-5">
        <div className="flex items-center gap-1">
          <Human size={24} color="#212B36" />
          <span className="text-lg font-bold">홍길동</span>
        </div>
        <button type="button">
          <Gear size={24} color="#212B36" />
        </button>
      </header>
      <div className="grid grid-cols-5 gap-2 px-8">
        {menuItems.map((item) => (
          <button
            key={item.path}
            type="button"
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center"
          >
            <div className="flex h-12 w-12 items-center justify-center text-gray-700">
              {item.icon}
            </div>
            <span className="text-xs text-[#212B36]">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="my-2 h-2 w-full bg-gray-100" />
    </div>
  );
}

export default MyPage;
