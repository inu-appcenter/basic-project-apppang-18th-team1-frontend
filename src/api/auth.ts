import instance from './instance';

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  nickname: string;
}

export const signup = (data: SignupRequest) => {
  return instance.post('/auth/signup', data);
};

export interface LoginRequest {
  email: string;
  password: string;
}

export const login = (data: LoginRequest) => {
  return instance.post('/auth/login', data);
};

export const refresh = () => {
  return instance.post('/auth/refresh');
};

export const logout = () => {
  return instance.post('/auth/logout');
};

export interface MyProfileResponse {
  name: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  message: string;
}

export const getMyProfile = (signal?: AbortSignal) => {
  return instance.get<MyProfileResponse>('/auth/me', { signal });
};

export interface FindEmailRequest {
  name: string;
  phoneNumber: string;
}

export const findEmail = (data: FindEmailRequest) => {
  return instance.post('/auth/login/findEmail', data);
};

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  passwordCheck: string;
  supabaseToken: string;
}

export const resetPassword = (data: ResetPasswordRequest) => {
  return instance.patch('/auth/password/reset', data);
};
