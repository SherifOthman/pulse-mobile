import { env } from "@/src/env";
import { router } from "expo-router";
import { useState, useCallback } from "react";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { loginWithGoogle } from "./auth-api";
import { useAuthStore } from "./auth-store";

GoogleSignin.configure({
  webClientId: env.googleWebClientId,
  iosClientId: env.googleIosClientId,
});

export function useGoogleLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();

      if (signInResult.type !== "success" || !signInResult.data.idToken) {
        throw new Error("Sign in failed or no ID token received");
      }

      const res = await loginWithGoogle(signInResult.data.idToken);
      await setSession(res.data.accessToken, res.data.refreshToken);
      router.replace("/(app)/(tabs)/home");
    } catch (err: any) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        setError(null);
      } else if (err.code === statusCodes.IN_PROGRESS) {
        setError("Sign in already in progress");
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError("Google Play Services not available or needs update");
      } else {
        console.error("Sign in error:", err);
        setError(err?.response?.data?.message || err?.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  }, [setSession]);

  return { signIn, isLoading, error };
}
