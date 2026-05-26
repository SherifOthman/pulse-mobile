import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

type AuthStore = {
  accessToken: string | null;
  refreshToken: string | null;
  hydrate: () => Promise<void>;
  setSession: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,

  hydrate: async () => {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    set({ accessToken, refreshToken });
  },

  setSession: async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);

    set({ accessToken, refreshToken });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    set({ accessToken: null, refreshToken: null });
  },
}));
