import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    if (error.response?.status === 401 && !request._retry) {
      request._retry = true;
      
      try {
        // Use same-origin proxy so the refreshToken cookie (stored on frontend origin) is included.
        const response = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        
        const newToken = response.data.data;
        sessionStorage.setItem('accessToken', newToken);
        request.headers.Authorization = `Bearer ${newToken}`;
        
        return API(request);
      } catch {
        sessionStorage.clear();
        document.cookie = 'refreshToken=; path=/; max-age=0';
        window.location.href = '/signin';
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;
