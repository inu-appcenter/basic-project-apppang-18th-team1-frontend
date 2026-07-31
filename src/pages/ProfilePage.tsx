import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftArrow } from '@/components/icons';
import { getMyProfile, type MyProfileResponse } from '@/api/auth';

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return value;
};

function ProfilePage() {
  const navigate = useNavigate();
  const hasAlertedRef = useRef(false);
  const [profile, setProfile] = useState<MyProfileResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      if (!hasAlertedRef.current) {
        hasAlertedRef.current = true;
        alert('로그인이 필요한 기능입니다.');
        navigate('/login');
      }
      return undefined;
    }

    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        const response = await getMyProfile(controller.signal);
        setProfile(response.data);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error('회원 정보 조회 실패', err);
        setError('회원 정보를 불러오지 못했습니다.');
      }
    };

    fetchProfile();

    return () => controller.abort();
  }, [navigate]);

  return (
    <div className="relative flex w-full flex-col items-center gap-3 bg-white px-3 pb-10">
      {/* Header */}
      <header className="flex h-[72px] w-full items-center justify-center py-5">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <LeftArrow size={24} color="#212B36" />
        </button>
        <h1 className="text-[20px] leading-none font-bold">프로필</h1>
      </header>

      {error && <div className="w-full py-10 text-center text-sm text-red-400">{error}</div>}

      {!error && profile && (
        <div className="flex w-full flex-col divide-y divide-gray-300 border-t border-gray-300">
          <div className="flex items-center justify-between py-4">
            <span className="text-sm text-gray-300">이름</span>
            <span className="text-sm font-medium text-[#212B36]">{profile.name}</span>
          </div>
          <div className="flex items-center justify-between py-4">
            <span className="text-sm text-gray-300">닉네임</span>
            <span className="text-sm font-medium text-[#212B36]">{profile.nickname}</span>
          </div>
          <div className="flex items-center justify-between py-4">
            <span className="text-sm text-gray-300">이메일</span>
            <span className="text-sm font-medium text-[#212B36]">{profile.email}</span>
          </div>
          <div className="flex items-center justify-between py-4">
            <span className="text-sm text-gray-300">전화번호</span>
            <span className="text-sm font-medium text-[#212B36]">
              {formatPhoneNumber(profile.phoneNumber)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
