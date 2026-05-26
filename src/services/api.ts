import axios from "axios";
import { API_URL } from "../config/constants";
import { useAuthStore } from "../features/auth/store/auth-store";

export const api = axios.create({
  baseURL: API_URL || "http://localhost:5170",
});

let refreshPromise: Promise<void> | null = null;

api.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(err);
    }

    if (refreshPromise) {
      await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
      return api(originalRequest);
    }

    originalRequest._retry = true;

    refreshPromise = (async () => {
      const store = useAuthStore.getState();

      if (!store.refreshToken) {
        throw new Error("No refresh token available");
      }

      const res = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, {
        accessToken: store.accessToken,
        refreshToken: store.refreshToken,
      });

      await store.setSession(res.data.accessToken, res.data.refreshToken);
    })();

    try {
      await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
      return api(originalRequest);
    } catch {
      useAuthStore.getState().logout();
      throw err;
    } finally {
      refreshPromise = null;
    }
  },
);
