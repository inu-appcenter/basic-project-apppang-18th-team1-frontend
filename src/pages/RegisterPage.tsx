function RegisterPage() {
  const navigate = useNavigate();
  const [allAgree, setAllAgree] = useState(false);
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [agree3, setAgree3] = useState(false);
  const [agree4, setAgree4] = useState(false);
  const [agree5, setAgree5] = useState(false);
  const [agree6, setAgree6] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [nameError, setNameError] = useState('');
  const [registerError, setRegisterError] = useState(false);

  const isActive =
    emailError === '' &&
    passwordError === '' &&
    nameError === '' &&
    phoneNumberError === '' &&
    agree1 &&
    agree2 &&
    agree3 &&
    agree4 &&
    agree5;

  function handleAllAgree() {
    const newValue = !allAgree;
    setAllAgree(newValue);
    setAgree1(newValue);
    setAgree2(newValue);
    setAgree3(newValue);
    setAgree4(newValue);
    setAgree5(newValue);
    setAgree6(newValue);
  }

  function handleEmailValidation(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) setEmailError('이메일을 입력해주세요.');
    else if (!emailRegex.test(value)) setEmailError('유효한 이메일 주소를 입력해주세요.');
    else setEmailError('');
  }

  function handlePasswordValidation(value: string) {
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    if (!value) setPasswordError('비밀번호를 입력해주세요.');
    else if (value.length < 8 || !hasLetter || !hasNumber)
      setPasswordError('비밀번호는 8자 이상, 영문+숫자 조합이여야합니다.');
    else setPasswordError('');
  }

  function handleNameValidation(value: string) {
    if (!value) setNameError('이름을 입력해주세요.');
    else if (value.length < 2) setNameError('이름은 최소 2자 이상이어야 합니다.');
    else setNameError('');
  }

  function handlePhoneNumberValidation(value: string) {
    const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
    if (!phoneNumber) setPhoneNumberError('휴대폰 번호를 입력해주세요.');
    else if (!phoneRegex.test(phoneNumber))
      setPhoneNumberError('유효한 휴대폰 번호를 입력해주세요.');
    else setPhoneNumberError('');
  }

  function formatPhoneNumber(value: string) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    else if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    else return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }

  useEffect(() => {
    if (agree1 && agree2 && agree3 && agree4 && agree5 && agree6) {
      setAllAgree(true);
    } else {
      setAllAgree(false);
    }
  }, [agree1, agree2, agree3, agree4, agree5, agree6]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center gap-3 bg-white px-3 pb-10">
      {/* Header */}
      <header className="flex h-[72px] w-full items-center justify-center py-5">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <LeftArrow size={24} color="#7E7E7E" />
        </button>

        <h1 className="text-[20px] leading-none font-bold">회원가입</h1>
      </header>

      {/* Logo */}
      <div className="flex w-full items-center justify-center py-3">
        <img src="/apppang-logo.png" alt="앱팡" className="h-[29.51px]" />
      </div>

      {/* Registration Info */}
      <p className="w-full py-4 text-sm font-bold">회원정보를 입력해주세요</p>

      {/* Email Field */}
      <div
        className={`flex h-12 w-full items-center border transition-colors ${
          emailError ? 'border-red-500' : 'border-gray-300 focus-within:border-blue-500'
        }`}
      >
        <div className="flex h-full w-12 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50">
          <Letter size={20} color="#7E7E7E" />
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            handleEmailValidation(e.target.value);
          }}
          onBlur={() => {
            handleEmailValidation(email);
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
      {emailError && <p className="w-full text-xs text-red-500">{emailError}</p>}

      {/* Password Field */}
      <div
        className={`flex h-12 w-full items-center border transition-colors ${
          passwordError ? 'border-red-500' : 'border-gray-300 focus-within:border-blue-500'
        }`}
      >
        <div className="flex h-full w-12 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50">
          <Lock size={20} color="#7E7E7E" />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            handlePasswordValidation(e.target.value);
          }}
          onBlur={() => {
            handlePasswordValidation(password);
          }}
          placeholder="비밀번호"
          className="flex-1 px-3 text-sm font-bold outline-none placeholder:text-gray-300"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="mr-3 shrink-0"
        >
          {showPassword ? (
            <EyeOpen size={20} color="#7E7E7E" />
          ) : (
            <EyeClose size={20} color="#7E7E7E" />
          )}
        </button>
      </div>
      {passwordError && <p className="w-full text-xs text-red-500">{passwordError}</p>}
      {!passwordError && password && (
        <p className="w-full text-xs text-green-500">✓ 사용가능한 비밀번호입니다.</p>
      )}

      {/* Name Field */}
      <div
        className={`flex h-12 w-full items-center border transition-colors ${
          nameError ? 'border-red-500' : 'border-gray-300 focus-within:border-blue-500'
        }`}
      >
        <div className="flex h-full w-12 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50">
          <Person size={20} color="#7E7E7E" />
        </div>
        <input
          type="text"
          placeholder="이름"
          className="flex-1 px-3 text-sm font-bold outline-none placeholder:text-gray-300"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            handleNameValidation(e.target.value);
          }}
          onBlur={() => {
            handleNameValidation(name);
          }}
        />
        {name && (
          <button
            type="button"
            onClick={() => setName('')}
            className="mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-300"
          >
            <RoundFrameCross size={10} color="white" />
          </button>
        )}
      </div>
      {nameError && <p className="w-full text-xs text-red-500">{nameError}</p>}

      {/* Phone Number Field */}
      <div
        className={`flex h-12 w-full items-center border transition-colors ${
          phoneNumberError ? 'border-red-500' : 'border-gray-300 focus-within:border-blue-500'
        }`}
      >
        <div className="flex h-full w-12 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50">
          <Phone size={20} color="#7E7E7E" />
        </div>
        <input
          type="tel"
          placeholder="휴대폰 번호"
          className="flex-1 px-3 text-sm font-bold outline-none placeholder:text-gray-300"
          value={formatPhoneNumber(phoneNumber)}
          onChange={(e) => {
            const formatted = formatPhoneNumber(e.target.value);
            setPhoneNumber(formatted);
            handlePhoneNumberValidation(e.target.value);
          }}
          onBlur={() => {
            handlePhoneNumberValidation(phoneNumber);
          }}
        />
        {phoneNumber && (
          <button
            type="button"
            onClick={() => setPhoneNumber('')}
            className="mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-300"
          >
            <RoundFrameCross size={10} color="white" />
          </button>
        )}
      </div>
      {phoneNumberError && <p className="w-full text-xs text-red-500">{phoneNumberError}</p>}

      {/* Divider */}
      <div></div>
      <div className="h-px w-full bg-gray-200" />

      {/* Agreement Field */}
      <p className="mt-4 w-full text-sm font-bold">쿠팡 서비스 약관에 동의해주세요</p>
      {/* All Agreement Button */}
      <div className="flex items-start gap-3 px-3 py-3">
        <input
          type="checkbox"
          id="allAgree"
          className="shrink-0 accent-blue-500"
          style={{ width: '24px', height: '24px' }}
          checked={allAgree}
          onChange={handleAllAgree}
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

      {/* Agreement Box */}
      <div className="flex w-full flex-col border border-gray-200">
        {/* Agreement 1 */}
        <div className="mt-3 flex items-center gap-2 px-3 py-2">
          <input
            type="checkbox"
            id="agree1"
            className="h-6 w-6"
            checked={agree1}
            onChange={() => setAgree1((prev) => !prev)}
          />
          <label htmlFor="agree1" className="flex-1 text-sm font-bold">
            [필수] 만 14세 이상입니다
          </label>
        </div>

        {/* Agreement 2 */}
        <div className="flex items-center gap-2 px-3 py-2">
          <input
            type="checkbox"
            id="agree2"
            className="h-6 w-6"
            checked={agree2}
            onChange={() => setAgree2((prev) => !prev)}
          />
          <label htmlFor="agree2" className="flex-1 text-sm font-bold">
            [필수] 쿠팡 이용약관 동의
          </label>
          <button type="button" className="text-xs text-gray-400">
            <RightArrow size={24} color="#7E7E7E" />
          </button>
        </div>

        {/* Agreement 3 */}
        <div className="flex items-center gap-2 px-3 py-2">
          <input
            type="checkbox"
            id="agree3"
            className="h-6 w-6"
            checked={agree3}
            onChange={() => setAgree3((prev) => !prev)}
          />
          <label htmlFor="agree3" className="flex-1 text-sm font-bold">
            [필수] 전자금융거래 이용약관 동의
          </label>
          <button type="button" className="text-xs text-gray-400">
            <RightArrow size={24} color="#7E7E7E" />
          </button>
        </div>
        {/* Agreement 4 */}
        <div className="flex items-center gap-2 px-3 py-2">
          <input
            type="checkbox"
            id="agree4"
            className="h-6 w-6"
            checked={agree4}
            onChange={() => setAgree4((prev) => !prev)}
          />
          <label htmlFor="agree4" className="flex-1 text-sm font-bold">
            [필수] 개인정보 수집 및 이용 동의
          </label>
          <button type="button" className="text-xs text-gray-400">
            <RightArrow size={24} color="#7E7E7E" />
          </button>
        </div>
        {/* Agreement 5 */}
        <div className="flex items-center gap-2 px-3 py-2">
          <input
            type="checkbox"
            id="agree5"
            className="h-6 w-6"
            checked={agree5}
            onChange={() => setAgree5((prev) => !prev)}
          />
          <label htmlFor="agree5" className="flex-1 text-sm font-bold">
            [필수] 개인정보 제3자 제공 동의
          </label>
          <button type="button" className="text-xs text-gray-400">
            <RightArrow size={24} color="#7E7E7E" />
          </button>
        </div>
        {/* Agreement 6 */}
        <div className="mb-3 flex items-center gap-2 px-3 py-2">
          <input
            type="checkbox"
            id="agree6"
            className="h-6 w-6"
            checked={agree6}
            onChange={() => setAgree6((prev) => !prev)}
          />
          <label htmlFor="agree6" className="flex-1 text-sm font-bold">
            [선택] 마케팅 및 이벤트 목적의 개인정보 수집 및 이용동의
          </label>
          <button type="button" className="text-xs text-gray-400">
            <RightArrow size={24} color="#7E7E7E" />
          </button>
        </div>
      </div>

      {/* Register Button */}
      <button
        type="button"
        disabled={!isActive}
        onClick={() => setRegisterError(true)}
        className={`mt-auto w-full py-3 text-base font-bold text-white ${isActive ? 'bg-blue-500' : 'bg-gray-200'}`}
      >
        가입하기
      </button>
      {registerError && (
        <div className="absolute top-[57px] left-[95px] flex w-[200px] items-center gap-2 rounded bg-white px-3 py-2 shadow-[4px_4px_12px_0px_rgba(0,0,0,0.25)]">
          <button type="button" onClick={() => setRegisterError(false)} className="shrink-0">
            <Cross size={12} color="#7E7E7E" />
          </button>
          <p className="flex-1 text-xs font-semibold">이미 존재하는 이메일입니다.</p>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;
