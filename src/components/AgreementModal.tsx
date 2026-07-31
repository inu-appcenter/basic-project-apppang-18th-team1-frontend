import type { ReactNode } from 'react';
import { Cross } from '@/components/icons';

interface AgreementModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

function AgreementModal({ title, onClose, children }: AgreementModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6"
      onClick={onClose}
    >
      <div
        className="max-h-[70vh] w-full max-w-100 overflow-y-auto rounded-lg bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#212B36]">{title}</h2>
          <button type="button" onClick={onClose} className="shrink-0 p-1">
            <Cross size={20} color="#7E7E7E" />
          </button>
        </div>
        <div className="text-sm whitespace-pre-line text-gray-600">{children}</div>
      </div>
    </div>
  );
}

export default AgreementModal;
