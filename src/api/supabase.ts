import axios from 'axios';

const supabase = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_URL,
  headers: {
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  },
});

export default supabase;

export const sendResetEmail = (email: string) => {
  console.log(import.meta.env.VITE_SUPABASE_URL);

  return supabase.post('/auth/v1/otp', {
    email,
    create_user: true,
  });
};

export const verifyResetCode = (email: string, token: string) => {
  return supabase.post('/auth/v1/verify', {
    type: 'email',
    email,
    token,
  });
};
