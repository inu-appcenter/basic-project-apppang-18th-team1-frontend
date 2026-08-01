import { useState } from 'react';
import { Cross } from '@/components/icons';
import { addAddress, updateAddress, type Address } from '@/api/address';

interface AddressModalProps {
  address?: Address;
  onClose: () => void;
  onSuccess: () => void;
}

function formatPhoneNumber(value: string) {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
}

function AddressModal({ address, onClose, onSuccess }: AddressModalProps) {
  const isEditMode = Boolean(address);
  const [alias, setAlias] = useState(address?.alias ?? '');
  const [recipientName, setRecipientName] = useState(address?.recipientName ?? '');
  const [recipientPhone, setRecipientPhone] = useState(
    formatPhoneNumber(address?.recipientPhone ?? ''),
  );
  const [mainAddress, setMainAddress] = useState(address?.mainAddress ?? '');
  const [detailAddress, setDetailAddress] = useState(address?.detailAddress ?? '');
  const [deliveryMessage, setDeliveryMessage] = useState(address?.deliveryMessage ?? '');
  const [isDefault, setIsDefault] = useState(address?.isDefault ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLabel = isEditMode ? '수정하기' : '배송지 추가하기';
  const submittingLabel = isEditMode ? '수정 중...' : '추가 중...';

  const isActive =
    recipientName.trim() !== '' && recipientPhone.trim() !== '' && mainAddress.trim() !== '';

  const handleSubmit = async () => {
    if (!isActive) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (address) {
        const response = await updateAddress(address.addressId, {
          alias: alias.trim() || undefined,
          recipientName,
          recipientPhone: recipientPhone.replace(/-/g, ''),
          mainAddress,
          detailAddress: detailAddress.trim() || undefined,
          deliveryMessage: deliveryMessage.trim() || undefined,
        });
        alert(response.data.message);
      } else {
        await addAddress({
          alias: alias.trim() || undefined,
          recipientName,
          recipientPhone: recipientPhone.replace(/-/g, ''),
          mainAddress,
          detailAddress: detailAddress.trim() || undefined,
          deliveryMessage: deliveryMessage.trim() || undefined,
          isDefault,
        });
        alert('배송지가 추가되었습니다.');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('배송지 저장 실패', err);
      if (!err.response) {
        alert('서버와 연결할 수 없습니다.');
        return;
      }
      alert(err.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-100 overflow-y-auto rounded-lg bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#212B36]">
            {isEditMode ? '배송지 수정' : '배송지 추가'}
          </h2>
          <button type="button" onClick={onClose} className="shrink-0 p-1">
            <Cross size={20} color="#7E7E7E" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">배송지명</label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="예) 집, 회사"
              className="h-11 border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">수령인 이름</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="수령인 이름"
              className="h-11 border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">수령인 전화번호</label>
            <input
              type="tel"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(formatPhoneNumber(e.target.value))}
              placeholder="010-0000-0000"
              maxLength={13}
              className="h-11 border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">기본 주소</label>
            <input
              type="text"
              value={mainAddress}
              onChange={(e) => setMainAddress(e.target.value)}
              placeholder="기본 주소"
              className="h-11 border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">상세 주소</label>
            <input
              type="text"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
              placeholder="상세 주소"
              className="h-11 border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">배송 요청사항</label>
            <input
              type="text"
              value={deliveryMessage}
              onChange={(e) => setDeliveryMessage(e.target.value)}
              placeholder="배송 요청사항"
              className="h-11 border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {!isEditMode && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm text-[#212B36]">기본 배송지로 설정</span>
            </label>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isActive || isSubmitting}
          className={`mt-4 w-full rounded py-3 text-sm font-bold text-white ${
            isActive ? 'bg-primary-200' : 'bg-gray-300'
          }`}
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </div>
  );
}

export default AddressModal;
