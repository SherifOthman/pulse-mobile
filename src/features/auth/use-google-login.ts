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

      if (signInResult.type !== "success") {
        throw new Error(`Sign in failed: type=${signInResult.type}`);
      }

      // signIn() can return a null idToken on some Android devices even with a
      // valid webClientId. getTokens() always returns a non-null idToken.
      const idToken =
        signInResult.data.idToken ?? (await GoogleSignin.getTokens()).idToken;

      if (!idToken) {
        throw new Error("Could not obtain ID token from Google");
      }

      const res = await loginWithGoogle(idToken);
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
        console.error("Sign in error — code:", err?.code, "message:", err?.message, err);
        setError(
          err?.code
            ? `Google Sign-In error (code ${err.code}): ${err.message}`
            : err?.response?.data?.message || err?.message || "Login failed",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [setSession]);

  return { signIn, isLoading, error };
}
