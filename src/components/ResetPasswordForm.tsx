import { useState } from 'react';
import { Letter, RoundFrameCross, Lock, EyeOpen, EyeClose } from '@/components/icons';
import { sendResetEmail, verifyResetCode } from '../api/supabase';
import { resetPassword } from '@/api/auth';
import { useNavigate } from 'react-router-dom';

function ResetPasswordForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [supabaseToken, setSupabaseToken] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const isActive =
    isVerified &&
    newPassword.trim() !== '' &&
    passwordCheck.trim() !== '' &&
    newPassword === passwordCheck;

  const handleSendEmail = async () => {
    setError('');
    setIsSendingEmail(true);
    try {
      await sendResetEmail(email);
      setShowVerifyInput(true);
    } catch (error: any) {
      if (!error.response) {
        setError('서버와 연결할 수 없습니다.');
        return;
      }
      setError(error.response.data.msg);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleVerifyCode = async () => {
    setError('');

    try {
      const response = await verifyResetCode(email, verifyCode);

      setSupabaseToken(response.data.access_token);
      setIsVerified(true);

      alert('이메일 인증이 완료되었습니다.');
    } catch (error: any) {
      if (!error.response) {
        setError('인증 서버와 연결할 수 없습니다.');
        return;
      }

      setError(error.response.data.msg);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setPasswordError('');

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

      if (error.response.status === 400) {
        setPasswordError('비밀번호는 8자 이상, 영문+숫자+특수문자 조합이여야합니다.');
        return;
      }

      setError(error.response.data.message);
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
            disabled={isVerified}
            className="flex-1 px-3 text-sm font-bold outline-none placeholder:text-gray-300 disabled:bg-gray-50 disabled:text-gray-400"
          />
          {email && !isVerified && (
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
          disabled={!email.trim() || isSendingEmail || isVerified}
          className="bg-primary-200 h-12 rounded px-4 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-blue-600 disabled:bg-gray-300"
        >
          {isSendingEmail ? '보내는 중' : '인증하기'}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {showVerifyInput && (
        <p className="text-sm text-gray-500">입력한 이메일로 인증번호를 발송했습니다.</p>
      )}
      {showVerifyInput && (
        <div className="flex w-full gap-2">
          <div className="flex h-12 flex-1 items-center border border-gray-300 focus-within:border-blue-500">
            <input
              type="text"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              placeholder="인증번호 입력"
              disabled={isVerified}
              className="flex-1 px-3 text-sm font-bold outline-none disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <button
            type="button"
            onClick={handleVerifyCode}
            disabled={!verifyCode.trim() || isVerified}
            className="bg-primary-200 h-12 rounded px-4 text-sm font-semibold text-white disabled:bg-gray-300"
          >
            {isVerified ? '인증완료' : '인증확인'}
          </button>
        </div>
      )}
      {isVerified && <p className="text-sm text-green-600">✓ 이메일 인증이 완료되었습니다.</p>}
      <div
        className={
          'flex h-12 w-full items-center border border-gray-300 transition-colors focus-within:border-blue-500'
        }
      >
        <div className="flex h-full w-12 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50">
          <Lock size={20} color="#7E7E7E" />
        </div>
        <input
          type={showPassword1 ? 'text' : 'password'}
          placeholder="새 비밀번호"
          className="flex-1 px-3 text-sm font-bold outline-none placeholder:text-gray-300"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setPasswordError('');
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword1((prev) => !prev)}
          className="mr-3 shrink-0"
        >
          {showPassword1 ? (
            <EyeOpen size={20} color="#7E7E7E" />
          ) : (
            <EyeClose size={20} color="#7E7E7E" />
          )}
        </button>
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
          type={showPassword2 ? 'text' : 'password'}
          value={passwordCheck}
          onChange={(e) => {
            setPasswordCheck(e.target.value);
            setPasswordError('');
          }}
          placeholder="새 비밀번호 확인"
          className="flex-1 px-3 text-sm font-bold outline-none placeholder:text-gray-300"
        />
        <button
          type="button"
          onClick={() => setShowPassword2((prev) => !prev)}
          className="mr-3 shrink-0"
        >
          {showPassword2 ? (
            <EyeOpen size={20} color="#7E7E7E" />
          ) : (
            <EyeClose size={20} color="#7E7E7E" />
          )}
        </button>
      </div>
      {passwordError && <p className="w-full text-xs text-red-500">{passwordError}</p>}
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
