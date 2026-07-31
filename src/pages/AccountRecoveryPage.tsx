import Header from '@/components/Header';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftArrow } from '@/components/icons';
import FindEmailForm from '@/components/FindEmailForm';
import ResetPasswordForm from '@/components/ResetPasswordForm';

function AccountRecoveryPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'findEmail' | 'resetPassword'>('findEmail');

  return (
    <div>
      <div className="relative flex h-[72px] w-full items-center justify-end">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <LeftArrow size={24} color="#212B36" />
        </button>
        <Header />
      </div>
      <div className="flex border-b border-gray-300">
        <button
          className={`flex-1 py-3 text-center font-medium transition-colors ${tab === 'findEmail' ? 'text-primary-200 border-primary-200 border-b-2' : 'text-gray-300 hover:text-gray-700'} `}
          onClick={() => setTab('findEmail')}
        >
          이메일 찾기
        </button>

        <button
          onClick={() => setTab('resetPassword')}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            tab === 'resetPassword'
              ? 'border-primary-200 text-primary-200 border-b-2'
              : 'text-gray-300 hover:text-gray-700'
          }`}
        >
          비밀번호 재설정
        </button>
      </div>
      <div className="mt-8">{tab === 'findEmail' ? <FindEmailForm /> : <ResetPasswordForm />}</div>
    </div>
  );
}
export default AccountRecoveryPage;
