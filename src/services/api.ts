import axios from "axios";
import { useAuthStore } from "../stores/auth-store";

const API_URL = process.env.API_URL || "http://localhost:7225";

export const api = axios.create({
  baseURL: API_URL,
});

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
    if (err.response?.status === 401) {
      const store = useAuthStore.getState();

      const res = await axios.post(`${API_URL}/auth/refresh-token`, {
        accessToken: store.accessToken,
        refreshToken: store.refreshToken,
      });

      await store.setSession(res.data.accessToken, res.data.refreshToken);

      err.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return api.request(err.config);
    }
    return Promise.reject(err);
  },
);
