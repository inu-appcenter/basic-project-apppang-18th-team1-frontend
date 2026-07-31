import { LeftArrow, Search } from '@/components/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getAutocompleteSuggestions, getSearchInit } from '@/api/search';

const RECENT_SEARCH_STORAGE_KEY = 'recentSearchKeywords';
const MAX_RECENT_SEARCHES = 5;

function getStoredRecentKeywords(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function highlightKeyword(text: string, keyword: string) {
  if (!keyword) return text;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

  return parts.map((part, index) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      // eslint-disable-next-line react/no-array-index-key
      <span key={index} className="font-bold">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function SearchPage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recommendKeywords, setRecommendKeywords] = useState<string[]>([]);
  const [recentKeywords, setRecentKeywords] = useState<string[]>(() => getStoredRecentKeywords());
  const inputRef = useRef<HTMLInputElement>(null);

  function addRecentKeyword(keyword: string) {
    setRecentKeywords((prev) => {
      const updated = [keyword, ...prev.filter((item) => item !== keyword)].slice(
        0,
        MAX_RECENT_SEARCHES,
      );
      localStorage.setItem(RECENT_SEARCH_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function goToSearchResult(keyword: string) {
    addRecentKeyword(keyword);
    navigate(`/products?search=${encodeURIComponent(keyword)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const trimmed = searchValue.trim();
    if (e.key === 'Enter' && trimmed) {
      goToSearchResult(trimmed);
    }
  }

  function handleSearchClick() {
    const trimmed = searchValue.trim();
    if (trimmed) {
      goToSearchResult(trimmed);
    }
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 검색 페이지 진입 시 추천 검색어 조회
  useEffect(() => {
    const controller = new AbortController();

    const fetchRecommendKeywords = async () => {
      try {
        const response = await getSearchInit(controller.signal);
        setRecommendKeywords(response.data.recommendKeywords);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error('추천 검색어 조회 실패', err);
      }
    };

    fetchRecommendKeywords();

    return () => controller.abort();
  }, []);

  // 검색어 입력 중 자동완성 (300ms debounce, 1자 이상일 때만 조회)
  useEffect(() => {
    const trimmed = searchValue.trim();
    if (!trimmed) {
      setSuggestions([]);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await getAutocompleteSuggestions(trimmed, controller.signal);
        setSuggestions(response.data.suggestions);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error('자동완성 조회 실패', err);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchValue]);

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
            maxLength={100}
            className="flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-gray-400"
          />
          <button type="button" onClick={handleSearchClick} className="mr-4">
            <Search size={20} color="#212B36" />
          </button>
        </div>
      </header>

      {/* 자동완성 추천 검색어 */}
      {searchValue.trim() && suggestions.length > 0 && (
        <ul className="w-full divide-y divide-gray-200">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => goToSearchResult(suggestion)}
                className="w-full px-2 py-3 text-left text-sm"
              >
                {highlightKeyword(suggestion, searchValue.trim())}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 최근 검색어 */}
      {!searchValue.trim() && recentKeywords.length > 0 && (
        <div className="flex w-full flex-col gap-2 px-2 py-3">
          <p className="text-sm font-bold text-[#212B36]">최근 검색어</p>
          <ul className="w-full">
            {recentKeywords.map((keyword) => (
              <li key={keyword}>
                <button
                  type="button"
                  onClick={() => goToSearchResult(keyword)}
                  className="w-full px-2 py-3 text-left text-sm transition-colors hover:bg-gray-200"
                >
                  {keyword}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 검색 페이지 초기 화면: 쿠팡 추천 검색어 */}
      {!searchValue.trim() && recommendKeywords.length > 0 && (
        <div className="flex w-full flex-col gap-2 px-2 py-3">
          <p className="text-sm font-bold text-[#212B36]">쿠팡 추천 검색어</p>
          <div className="flex flex-wrap gap-2">
            {recommendKeywords.map((keyword) => (
              <button
                key={keyword}
                type="button"
                onClick={() => goToSearchResult(keyword)}
                className="rounded-full border border-gray-200 px-4 py-1.5 text-sm whitespace-nowrap"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
