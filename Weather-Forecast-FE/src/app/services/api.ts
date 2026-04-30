import axios from "axios";
import { STORAGE_KEYS } from "../utils/constants";
import { storage } from "../utils/localStorage";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = String(originalRequest?.url || "");
    const isAuthRequest = requestUrl.includes("/auth/");
    const isUnauthorized = error.response?.status === 401;

    // Only try refresh for non-auth requests.
    // Avoid recursive loop when /auth/login or /auth/refresh returns 401.
    if (isUnauthorized && !isAuthRequest && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const response = await api.post("/auth/refresh");
        if (response.status === 200) {
          // Retry original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect to login
        storage.remove(STORAGE_KEYS.AUTH_TOKEN);
        storage.remove(STORAGE_KEYS.USER_DATA);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // For unauthorized non-auth requests, force sign-out and go to login.
    // For auth endpoints (e.g. wrong credentials on /auth/login), let UI handle error.
    if (isUnauthorized && !isAuthRequest) {
      storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      storage.remove(STORAGE_KEYS.USER_DATA);
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
export { baseURL };
