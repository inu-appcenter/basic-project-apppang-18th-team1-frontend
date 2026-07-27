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
