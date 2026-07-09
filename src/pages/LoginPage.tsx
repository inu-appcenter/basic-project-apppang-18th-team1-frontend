import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RightArrow, Cross, RoundFrameCross, EyeOpen, EyeClose } from '@/components/icons';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const isActive = email.length > 0 && password.length > 0;

  function handlePasswordLimit() {
    if (password.length > 0 && password.length < 8) {
      setPasswordError('비밀번호는 8자 이상이어야 합니다.');
    } else {
      setPasswordError('');
    }
  }
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center gap-3 bg-white px-3">
      {/* Header */}
      <header className="flex w-full items-center justify-end py-5">
        <button type="button" onClick={() => navigate('/')} className="p-1">
          <Cross size={24} color="#7E7E7E" />
        </button>
      </header>

      {/* Logo */}
      <div className="flex w-full items-center justify-center py-3">
        <img src="/apppang-logo.png" alt="앱팡" className="h-[29.51px]" />
      </div>

      {/* Email Field */}
      <div className="flex w-full items-center gap-2 border border-gray-300 px-3 py-3 transition-colors focus-within:border-blue-500">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="아이디(이메일)"
          className="text-body-1 flex-1 outline-none placeholder:text-gray-300"
        />
        {email && (
          <button
            type="button"
            onClick={() => setEmail('')}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-300"
          >
            <RoundFrameCross size={12} color="white" />
          </button>
        )}
      </div>

      {/* Password Field */}
      <div
        className={`flex w-full items-center gap-2 border px-3 py-3 transition-colors ${passwordError ? 'border-red-500' : 'border-gray-300 focus-within:border-blue-500'}`}
      >
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError('');
          }}
          onFocus={() => setPasswordFocused(true)}
          onBlur={handlePasswordLimit}
          placeholder="비밀번호"
          className="text-body-1 flex-1 outline-none placeholder:text-gray-300"
        />
        <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="shrink-0">
          {showPassword ? (
            <EyeOpen size={20} color="#7E7E7E" />
          ) : (
            <EyeClose size={20} color="#7E7E7E" />
          )}
        </button>
      </div>

      {/* Login Button */}
      <button
        type="button"
        disabled={!isActive}
        onClick={() => setLoginError(true)}
        className={`flex w-full items-center justify-center py-3 text-base font-bold text-white transition-colors ${
          isActive ? 'bg-primary-200' : 'bg-gray-200'
        }`}
      >
        로그인
      </button>

      {/* Find Account */}
      <div className="flex w-full justify-end">
        <button
          type="button"
          className="text-primary-200 flex items-center gap-1 text-xs font-semibold"
        >
          아이디·비밀번호 찾기
          <RightArrow size={12} color="#346AFF" />
        </button>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-200" />

      {/* Register Button */}
      <button
        type="button"
        onClick={() => navigate('/register')}
        className="text-primary-200 flex w-full items-center justify-center border border-gray-200 py-3 text-base font-bold"
      >
        회원가입
      </button>

      {/* Business Row */}
      <div className="flex w-full items-center justify-center gap-1">
        <span className="text-xs font-semibold text-black">사업자이신가요?</span>
        <button
          type="button"
          className="text-primary-200 flex items-center gap-1 text-xs font-semibold"
        >
          사업자 회원 가입하기
          <RightArrow size={12} color="#346AFF" />
        </button>
      </div>

      {/* Toast - 로그인 실패 */}
      {loginError && (
        <div className="absolute top-[57px] left-[95px] flex w-[200px] items-center gap-2 rounded bg-white px-3 py-2 shadow-[4px_4px_12px_0px_rgba(0,0,0,0.25)]">
          <button type="button" onClick={() => setLoginError(false)} className="shrink-0">
            <Cross size={12} color="#7E7E7E" />
          </button>
          <p className="flex-1 text-xs font-semibold">
            아이디 또는 비밀번호가
            <br />
            일치하지 않습니다
          </p>
        </div>
      )}
      {passwordError && <p className="w-full text-xs text-red-500">{passwordError}</p>}
    </div>
  );
}

export default LoginPage;
