import { api } from "@/src/services/api";

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export const loginWithGoogle = (idToken: string) =>
  api.post<AuthResponse>("/auth/google", { idToken });
