import { useState } from 'react';
import { RoundFrameCross, Person, Phone, RightArrow } from '@/components/icons';
import { findEmail } from '@/api/auth';
import { useNavigate } from 'react-router-dom';

function FindEmailForm() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailResult, setEmailResult] = useState('');
  const [error, setError] = useState('');

  const isActive = name.trim() !== '' && phoneNumber.replace(/-/g, '').length === 11;

  function formatPhoneNumber(value: string) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    else if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    else return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }

  const handleFindEmail = async () => {
    try {
      const response = await findEmail({
        name,
        phoneNumber: phoneNumber.replace(/-/g, ''),
      });

      setEmailResult(response.data.email);
      setError('');
    } catch (error: any) {
      setEmailResult('');

      if (!error.response) {
        setError('서버와 연결할 수 없습니다.');
        return;
      }

      setError(error.response.data.message);
    }
  };
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center gap-3 bg-white px-3 pb-10">
      <div
        className={
          'flex h-12 w-full items-center border border-gray-300 transition-colors focus-within:border-blue-500'
        }
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

      <div
        className={
          'flex h-12 w-full items-center border border-gray-300 transition-colors focus-within:border-blue-500'
        }
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
      <button
        type="button"
        disabled={!isActive}
        onClick={handleFindEmail}
        className={`w-full py-3 text-base font-bold text-white ${isActive ? 'bg-blue-500' : 'bg-gray-200'}`}
      >
        이메일 찾기
      </button>
      {emailResult && (
        <div className="text-center">
          <div className="mt-6 rounded-lg bg-gray-100 p-4">
            <p className="text-sm text-gray-500">가입된 이메일</p>
            <p className="mt-2 text-lg font-semibold">{emailResult}</p>
          </div>
          <button type="button" onClick={() => navigate('/login')} className="font-semibold">
            [로그인으로 이동]
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default FindEmailForm;
