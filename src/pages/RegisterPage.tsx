import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center gap-3 bg-white px-3 pb-10">
      {/* Header */}
      <header className="flex h-[72px] w-full items-center justify-center py-5">
        {/* 뒤로가기 버튼 */}
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7E7E7E"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* 타이틀 */}
        <h1 className="text-[20px] leading-none font-bold">회원가입</h1>
      </header>

      {/* Logo */}
      <div className="flex w-full items-center justify-center py-3">
        <img src="/apppang-logo.png" alt="앱팡" className="h-[29.51px]" />
      </div>

      {/* 안내 문구 */}
      <p className="w-full py-4 text-sm font-bold">회원정보를 입력해주세요</p>

      {/* 아이디 입력 */}
      <div className="flex h-12 w-full items-center border border-gray-300">
        <div className="flex h-full w-12 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7E7E7E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 7l10 7 10-7" />
          </svg>
        </div>
        <input
          type="email"
          placeholder="아이디(이메일)"
          className="flex-1 px-3 text-sm font-bold outline-none placeholder:text-gray-300"
        />
      </div>

      {/* 비밀번호 입력 */}
      <div className="flex h-12 w-full items-center border border-gray-300">
        <div className="flex h-full w-12 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7E7E7E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <input
          type="password"
          placeholder="비밀번호"
          className="flex-1 px-3 text-sm font-bold outline-none placeholder:text-gray-300"
        />
      </div>

      {/* 이름 입력 */}
      <div className="flex h-12 w-full items-center border border-gray-300">
        <div className="flex h-full w-12 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7E7E7E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="이름"
          className="flex-1 px-3 text-sm font-bold outline-none placeholder:text-gray-300"
        />
      </div>

      {/* 휴대폰 번호 입력 */}
      <div className="flex h-12 w-full items-center border border-gray-300">
        <div className="flex h-full w-12 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7E7E7E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <circle cx="12" cy="17" r="1" />
          </svg>
        </div>
        <input
          type="tel"
          placeholder="휴대폰 번호"
          className="flex-1 px-3 text-sm font-bold outline-none placeholder:text-gray-300"
        />
      </div>
      <div></div>
      {/* 구분선 */}
      <div className="h-px w-full bg-gray-200" />

      {/* 약관 동의 섹션 */}
      <p className="mt-4 w-full text-sm font-bold">쿠팡 서비스 약관에 동의해주세요</p>
      {/* 모두 동의 */}
      <div className="flex items-start gap-3 px-3 py-3">
        <input
          type="checkbox"
          id="allAgree"
          className="shrink-0 accent-blue-500"
          style={{ width: '24px', height: '24px' }}
        />
        <div className="flex flex-col">
          <label htmlFor="allAgree" className="font-bold">
            모두 동의합니다
          </label>
          <p className="mt-1 text-xs font-semibold text-gray-400">
            동의에는 필수 및 선택 목적(광고성 정보 수신 포함) 에 대한 동의가 포함되어 있으며, 선택
            목적의 동의를 거부하시는 경우에도 서비스 이용이 가능합니다.
          </p>
        </div>
      </div>

      {/* 약관 박스 */}
      <div className="flex w-full flex-col border border-gray-200">
        {/* 동의 항목 1 */}
        <div className="mt-3 flex items-center gap-2 px-3 py-2">
          <input type="checkbox" id="agree1" className="h-6 w-6" />
          <label htmlFor="agree1" className="flex-1 text-sm font-bold">
            [필수] 만 14세 이상입니다
          </label>
        </div>

        {/* 동의 항목 2 */}
        <div className="flex items-center gap-2 px-3 py-2">
          <input type="checkbox" id="agree2" className="h-6 w-6" />
          <label htmlFor="agree2" className="flex-1 text-sm font-bold">
            [필수] 쿠팡 이용약관 동의
          </label>
          <button type="button" className="text-xs text-gray-400">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7E7E7E"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* 동의 항목 3 */}
        <div className="flex items-center gap-2 px-3 py-2">
          <input type="checkbox" id="agree3" className="h-6 w-6" />
          <label htmlFor="agree3" className="flex-1 text-sm font-bold">
            [필수] 전자금융거래 이용약관 동의
          </label>
          <button type="button" className="text-xs text-gray-400">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7E7E7E"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
        {/* 동의 항목 4 */}
        <div className="flex items-center gap-2 px-3 py-2">
          <input type="checkbox" id="agree4" className="h-6 w-6" />
          <label htmlFor="agree4" className="flex-1 text-sm font-bold">
            [필수] 개인정보 수집 및 이용 동의
          </label>
          <button type="button" className="text-xs text-gray-400">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7E7E7E"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
        {/* 동의 항목 5 */}
        <div className="flex items-center gap-2 px-3 py-2">
          <input type="checkbox" id="agree5" className="h-6 w-6" />
          <label htmlFor="agree5" className="flex-1 text-sm font-bold">
            [필수] 개인정보 제3자 제공 동의
          </label>
          <button type="button" className="text-xs text-gray-400">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7E7E7E"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
        {/* 동의 항목 6 */}
        <div className="mb-3 flex items-center gap-2 px-3 py-2">
          <input type="checkbox" id="agree6" className="h-6 w-6" />
          <label htmlFor="agree6" className="flex-1 text-sm font-bold">
            [선택] 마케팅 및 이벤트 목적의 개인정보 수집 및 이용동의
          </label>
          <button type="button" className="text-xs text-gray-400">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7E7E7E"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* 가입하기 버튼 */}
      <button
        type="button"
        className="mt-auto w-full bg-gray-200 py-3 text-base font-bold text-white"
      >
        가입하기
      </button>
    </div>
  );
}

export default RegisterPage;
