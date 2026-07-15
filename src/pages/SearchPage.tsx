import { LeftArrow, Camera } from '@/components/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

function SearchPage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/products?search=${searchValue}`);
    }
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <div className="relative flex w-full flex-col items-center gap-3 bg-white px-3">
      {/* Header */}
      <header className="flex h-[72px] w-full items-center justify-center py-5">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <LeftArrow size={24} color="#212B36" />
        </button>
        {/* Search Input Bar */}
        <div className="border-'#212B36' ml-8 flex h-10 w-[326px] items-center gap-2 rounded-full border-2 bg-gray-100">
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="검색어 입력"
            className="flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-gray-400"
          />
          <button type="button" className="mr-4">
            <Camera size={24} color="#212B36" />
          </button>
        </div>
      </header>
    </div>
  );
}

export default SearchPage;
