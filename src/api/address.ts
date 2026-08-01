import instance from './instance';

export interface AddAddressRequest {
  alias?: string;
  recipientName: string;
  recipientPhone: string;
  mainAddress: string;
  detailAddress?: string;
  deliveryMessage?: string;
  isDefault?: boolean;
}

export const addAddress = (data: AddAddressRequest, signal?: AbortSignal) => {
  return instance.post('/addresses', data, { signal });
};

export interface Address {
  addressId: number;
  alias: string;
  recipientName: string;
  recipientPhone: string;
  mainAddress: string;
  detailAddress: string;
  deliveryMessage: string;
  isDefault: boolean;
}

export interface GetAddressesResponse {
  message: string;
  data: Address[];
}

export const getAddresses = (signal?: AbortSignal) => {
  return instance.get<GetAddressesResponse>('/addresses', { signal });
};

export interface UpdateAddressRequest {
  alias?: string;
  recipientName: string;
  recipientPhone: string;
  mainAddress: string;
  detailAddress?: string;
  deliveryMessage?: string;
}

export interface UpdateAddressResponse {
  message: string;
  data: Address;
}

export const updateAddress = (
  addressId: number,
  data: UpdateAddressRequest,
  signal?: AbortSignal,
) => {
  return instance.patch<UpdateAddressResponse>(`/addresses/${addressId}`, data, { signal });
};

export interface DeleteAddressResponse {
  message: string;
  addressId: number;
}

export const deleteAddress = (addressId: number, signal?: AbortSignal) => {
  return instance.delete<DeleteAddressResponse>(`/addresses/${addressId}`, { signal });
};

export interface SetDefaultAddressResponse {
  message: string;
  data: Address;
}

export const setDefaultAddress = (addressId: number, signal?: AbortSignal) => {
  return instance.patch<SetDefaultAddressResponse>(`/addresses/${addressId}/default`, null, {
    signal,
  });
};
