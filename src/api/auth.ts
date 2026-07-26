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

export interface FindEmailRequest {
  name: string;
  phoneNumber: string;
}

export const findEmail = (data: FindEmailRequest) => {
  return instance.post('/auth/login/findEmail', data);
};
