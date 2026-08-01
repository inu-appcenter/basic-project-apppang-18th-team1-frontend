import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftArrow, Cross } from '@/components/icons';
import AddressModal from '@/components/AddressModal';
import { getAddresses, deleteAddress, setDefaultAddress, type Address } from '@/api/address';

const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

function AddressesPage() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const hasAlertedRef = useRef(false);

  const fetchAddresses = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError('');

      const response = await getAddresses(signal);
      setAddresses(response.data.data);
    } catch (err) {
      if (signal?.aborted) return;
      console.error('배송지 조회 실패', err);
      setError('배송지를 불러오지 못했습니다.');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  const handleConfirmDelete = async () => {
    if (deleteTargetId === null) return;

    const targetId = deleteTargetId;
    setDeleteTargetId(null);

    try {
      await deleteAddress(targetId);
      setAddresses((prev) => prev.filter((address) => address.addressId !== targetId));
    } catch (err: any) {
      console.error('배송지 삭제 실패', err);
      if (!err.response) {
        alert('서버와 연결할 수 없습니다.');
        return;
      }
      alert(err.response.data.message);
    }
  };

  const handleSetDefault = async (addressId: number) => {
    try {
      const response = await setDefaultAddress(addressId);
      alert(response.data.message);
      setAddresses((prev) =>
        prev.map((address) => ({ ...address, isDefault: address.addressId === addressId })),
      );
    } catch (err: any) {
      console.error('기본 배송지 지정 실패', err);
      if (!err.response) {
        alert('서버와 연결할 수 없습니다.');
        return;
      }
      alert(err.response.data.message);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      if (!hasAlertedRef.current) {
        hasAlertedRef.current = true;
        alert('로그인이 필요한 기능입니다.');
        navigate('/login');
      }
      return undefined;
    }

    const controller = new AbortController();
    fetchAddresses(controller.signal);

    return () => controller.abort();
  }, [navigate, fetchAddresses]);

  return (
    <div className="relative flex w-full flex-col items-center gap-3 bg-white px-3 pb-10">
      <header className="flex h-[72px] w-full items-center justify-center py-5">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-3 p-1">
          <LeftArrow size={24} color="#212B36" />
        </button>
        <h1 className="text-[20px] leading-none font-bold">내 배송지</h1>
      </header>

      <div className="w-full">
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="text-primary-200 py-2 text-sm font-bold"
        >
          + 배송지 추가
        </button>
      </div>

      {loading && (
        <div className="w-full py-10 text-center text-sm text-gray-400">불러오는 중...</div>
      )}

      {error && <div className="w-full py-10 text-center text-sm text-red-400">{error}</div>}

      {!loading && !error && addresses.length === 0 && (
        <div className="w-full py-10 text-center text-sm text-gray-400">
          등록된 배송지가 없습니다.
        </div>
      )}

      {!loading &&
        !error &&
        addresses.map((address) => (
          <div key={address.addressId} className="w-full rounded border border-gray-200 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#212B36]">{address.alias}</span>
                {address.isDefault && (
                  <span className="text-primary-200 border-primary-200 rounded border px-1.5 py-0.5 text-[10px] font-bold">
                    기본배송지
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setDeleteTargetId(address.addressId)}
                className="shrink-0 p-1"
              >
                <Cross size={16} color="#7E7E7E" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              {address.recipientName} · {formatPhoneNumber(address.recipientPhone)}
            </p>
            <p className="mt-1 text-sm text-[#212B36]">
              {address.mainAddress} {address.detailAddress}
            </p>
            {address.deliveryMessage && (
              <p className="mt-1 text-xs text-gray-400">{address.deliveryMessage}</p>
            )}
            <div className="mt-2 flex justify-end gap-3">
              {!address.isDefault && (
                <button
                  type="button"
                  onClick={() => handleSetDefault(address.addressId)}
                  className="text-primary-200 text-xs font-semibold underline"
                >
                  기본 배송지로 설정
                </button>
              )}
              <button
                type="button"
                onClick={() => setEditingAddress(address)}
                className="text-xs text-gray-400 underline"
              >
                수정하기
              </button>
            </div>
          </div>
        ))}

      {(showAddModal || editingAddress) && (
        <AddressModal
          address={editingAddress ?? undefined}
          onClose={() => {
            setShowAddModal(false);
            setEditingAddress(null);
          }}
          onSuccess={() => fetchAddresses()}
        />
      )}

      {deleteTargetId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6"
          onClick={() => setDeleteTargetId(null)}
        >
          <div
            className="w-full max-w-80 rounded-lg bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-5 text-center text-sm font-bold text-[#212B36]">
              배송지를 삭제하시겠습니까?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 rounded border border-gray-300 py-2 text-sm font-semibold text-[#212B36]"
              >
                아니오
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="bg-primary-200 flex-1 rounded py-2 text-sm font-semibold text-white"
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddressesPage;
