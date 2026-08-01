import { useEffect, useState } from 'react';
import { Human, Gear, Receipt, FilledHeart } from '@/components/icons';
import { useNavigate } from 'react-router-dom';
import { logout, getMyProfile } from '@/api/auth';

function MyPageGuest() {
  const navigate = useNavigate();

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-3 bg-white px-6 py-20">
      <p className="text-sm text-gray-400">로그인이 필요한 기능입니다.</p>
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="bg-primary-200 w-full rounded py-3 text-base font-bold text-white"
      >
        로그인하러 가기
      </button>
      <button
        type="button"
        onClick={() => navigate('/register')}
        className="text-primary-200 border-primary-200 w-full rounded border py-3 text-base font-bold"
      >
        회원가입하러 가기
      </button>
    </div>
  );
}

function MyPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      setIsLoggedIn(false);
      return undefined;
    }

    setIsLoggedIn(true);

    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        const response = await getMyProfile(controller.signal);
        setNickname(response.data.nickname);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error('회원 정보 조회 실패', err);
      }
    };

    fetchProfile();

    return () => controller.abort();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('로그아웃 실패', err);
    } finally {
      localStorage.removeItem('accessToken');
      navigate('/login');
    }
  };

  const menuItems = [
    {
      label: '주문내역',
      path: '/order-list',
      icon: <Receipt size={24} color="#346AFF" />,
    },
    {
      label: '찜리스트',
      path: '/wishlist',
      icon: <FilledHeart size={24} color="#346AFF" />,
    },
  ];

  if (!isLoggedIn) {
    return <MyPageGuest />;
  }

  return (
    <div className="relative flex w-full flex-col bg-white">
      <header className="bg-primary-100 flex h-[72px] w-full items-center justify-between px-4 py-5">
        <div className="flex items-center gap-1">
          <Human size={24} color="#212B36" />
          <span className="text-lg font-bold">{nickname}</span>
        </div>
        <button type="button" onClick={() => navigate('/profile')}>
          <Gear size={24} color="#212B36" />
        </button>
      </header>
      <div className="grid grid-cols-2 gap-2 px-8">
        {menuItems.map((item) => (
          <button
            key={item.path}
            type="button"
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-1 py-2"
          >
            <div className="flex h-12 w-12 items-center justify-center text-gray-700">
              {item.icon}
            </div>
            <span className="text-sm text-[#212B36]">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="my-2 h-2 w-full bg-gray-100" />
      <div className="border-t border-gray-100" />
      <button
        type="button"
        onClick={handleLogout}
        className="px-4 py-3 text-center text-xs text-gray-400"
      >
        로그아웃
      </button>
    </div>
  );
}

export default MyPage;
