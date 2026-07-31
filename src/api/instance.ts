import axios from 'axios';

const PUBLIC_URLS = ['/auth/login', '/auth/signup', '/auth/password/reset', '/auth/findEmail'];

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  if (config.url && PUBLIC_URLS.includes(config.url)) {
    return config;
  }
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const isPublicUrl = error.config?.url && PUBLIC_URLS.includes(error.config.url);

    if (error.response?.status === 401 && !isPublicUrl) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default instance;
