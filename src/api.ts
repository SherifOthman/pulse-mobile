import axios from "axios";
import { env } from "./env";
import { useAuthStore } from "./features/auth/auth-store";

export const api = axios.create({
  baseURL: `${env.apiUrl}/mobile`,
  withCredentials: true,
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
      // Wait for the in-flight refresh; reject this request if refresh fails.
      return refreshPromise.then(
        () => {
          originalRequest._retry = true;
          originalRequest.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
          return api(originalRequest);
        },
        () => Promise.reject(err),
      );
    }

    originalRequest._retry = true;

    refreshPromise = (async () => {
      const store = useAuthStore.getState();

      if (!store.refreshToken) {
        throw new Error("No refresh token available");
      }

      // React Native doesn't manage cookies automatically.
      // Send the refresh token in the Cookie header explicitly.
      const res = await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        {},
        {
          headers: { Cookie: `refreshToken=${store.refreshToken}` },
          withCredentials: true,
        },
      );

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
