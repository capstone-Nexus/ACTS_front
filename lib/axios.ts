import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;

API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const token = sessionStorage.getItem('accessToken');
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return API(originalRequest);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.data;
        sessionStorage.setItem('accessToken', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        isRefreshing = false;
        return API(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        sessionStorage.clear();
        document.cookie = 'refreshToken=; path=/auth/refresh; max-age=0';
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
