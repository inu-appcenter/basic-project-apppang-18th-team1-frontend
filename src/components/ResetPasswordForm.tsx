import { useState } from 'react';
import { Letter, RoundFrameCross, Lock } from '@/components/icons';
import { sendResetEmail, verifyResetCode } from '../api/supabase';
import { useNavigate } from 'react-router-dom';

function ResetPasswordForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [supabaseToken, setSupabaseToken] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const isActive =
    email.trim() !== '' &&
    verifyCode.trim() !== '' &&
    newPassword.trim() !== '' &&
    passwordCheck.trim() !== '' &&
    newPassword === passwordCheck;

  const handleSendEmail = async () => {
    setError('');
    try {
      await sendResetEmail(email);
      setShowVerifyInput(true);
    } catch (error: any) {
      if (!error.response) {
        setError('서버와 연결할 수 없습니다.');
        return;
      }
      setError(error.response.data.msg);
    }
  };

  const handleResetPassword = async () => {
    setError('');

    let supabaseToken = '';
    try {
      const verifyResponse = await verifyResetCode(email, verifyCode);

      supabaseToken = verifyResponse.data.access_token;
    } catch (error: any) {
      if (!error.response) {
        setError('인증 서버와 연결할 수 없습니다.');
        return;
      }

      setError(error.response.data.msg);
      return;
    }

    try {
      const response = await resetPassword({
        email,
        newPassword,
        passwordCheck,
        supabaseToken,
      });

      alert(response.data.message);

      navigate('/login');
    } catch (error: any) {
      if (!error.response) {
        setError('서버와 연결할 수 없습니다.');
        return;
      }

      switch (error.response.status) {
        case 400:
        case 401:
        case 404:
          setError(error.response.data.message);
          break;

        default:
          setError('비밀번호 변경에 실패했습니다.');
      }
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center gap-3 bg-white px-3 pb-10">
      <div className="flex w-full gap-2">
        <div
          className={
            'flex h-12 w-full items-center border border-gray-300 transition-colors focus-within:border-blue-500'
          }
        >
          <div className="flex h-full w-12 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50">
            <Letter size={20} color="#7E7E7E" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="아이디(이메일)"
            className="flex-1 px-3 text-sm font-bold outline-none placeholder:text-gray-300"
          />
          {email && (
            <button
              type="button"
              onClick={() => setEmail('')}
              className="mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-300"
            >
              <RoundFrameCross size={10} color="white" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleSendEmail}
          disabled={!email.trim()}
          className="bg-primary-200 h-12 rounded px-4 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-blue-600 disabled:bg-gray-300"
        >
          인증하기
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {showVerifyInput && (
        <p className="text-sm text-gray-500">입력한 이메일로 인증번호를 발송했습니다.</p>
      )}
      {showVerifyInput && (
        <div className="flex w-full gap-2">
          <div className="flex h-12 flex-1 items-center border border-gray-300 transition-colors focus-within:border-blue-500">
            <input
              type="text"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              placeholder="인증번호 입력"
              className="flex-1 px-3 text-sm font-bold outline-none placeholder:text-gray-300"
            />
          </div>
        </div>
      )}
      <div
        className={
          'flex h-12 w-full items-center border border-gray-300 transition-colors focus-within:border-blue-500'
        }
      >
        <div className="flex h-full w-12 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50">
          <Lock size={20} color="#7E7E7E" />
        </div>
        <input
          type="email"
          placeholder="새 비밀번호"
          className="flex-1 px-3 text-sm font-bold outline-none placeholder:text-gray-300"
        />
      </div>
      <div
        className={
          'flex h-12 w-full items-center border border-gray-300 transition-colors focus-within:border-blue-500'
        }
      >
        <div className="flex h-full w-12 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50">
          <Lock size={20} color="#7E7E7E" />
        </div>
        <input
          type="email"
          placeholder="새 비밀번호 확인"
          className="flex-1 px-3 text-sm font-bold outline-none placeholder:text-gray-300"
        />
      </div>
      <button
        type="button"
        disabled={!isActive}
        onClick={handleResetPassword}
        className={`w-full py-3 text-base font-bold text-white ${isActive ? 'bg-blue-500' : 'bg-gray-200'}`}
      >
        비밀번호 변경하기
      </button>
    </div>
  );
}

export default ResetPasswordForm;
