import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useApiStatusStore } from '../store/apiStatusStore';
import { apiBaseUrl } from '../config/env';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add auth token; clear "unavailable" when we send a request (user is retrying)
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  // Clear unavailable on next successful response (handled in response interceptor)
  return config;
});

// Response interceptor: handle 401 and set "service unavailable" on network/5xx
api.interceptors.response.use(
  (response) => {
    useApiStatusStore.getState().setUnavailable(false);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    const isNetworkError = !error.response;
    const isServerError = error.response?.status >= 500;
    if (isNetworkError || isServerError) {
      useApiStatusStore.getState().setUnavailable(true);
    }
    return Promise.reject(error);
  }
);

export default api;

