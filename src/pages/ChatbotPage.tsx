import { useNavigate, useSearchParams } from 'react-router-dom';
import { LeftArrow } from '@/components/icons';
import { useState, useRef } from 'react';

function ChatbotPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  return (
    <div className="relative flex w-full flex-col items-center gap-3 bg-white px-3 pb-10">
      {/* Header */}
      <header className="flex h-[72px] w-full items-center justify-center py-5">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <LeftArrow size={24} color="#212B36" />
        </button>
        <h1 className="text-[20px] leading-none font-bold">쇼핑 도우미</h1>
      </header>
      {/* Divider */}
      <div className="flex w-full justify-end border-b border-gray-200 px-3 py-2" />
      {/* Bottom CTA */}
      <div className="fixed bottom-0 w-full max-w-120 border-t border-gray-200 bg-white shadow-md">
        {/* Chating Bar */}
        <div className="flex justify-center px-3 py-3">
          <div className="border-'#212B36' flex w-[366px] items-center gap-2 rounded-full border-2 bg-gray-100">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInput}
              placeholder="메시지를 입력하세요..."
              maxLength={500}
              rows={1}
              className="ml-3 max-h-[80px] w-[280px] flex-1 resize-none overflow-y-auto bg-transparent px-3 text-sm outline-none placeholder:text-gray-300"
            />
            <button
              type="button"
              disabled={!message.trim()}
              className={`shrink-0 rounded-full p-2 ${
                message.trim() ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22 11 13 2 9l20-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPage;
