import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import Providers from "../Providers";
import { useAuthStore } from "../stores/auth-store";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const { accessToken, hydrate } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      await hydrate();
      setReady(true);
    };

    init();
  }, []);

  useEffect(() => {
    const inAuth = segments[0] === "(auth)";

    if (!accessToken && !inAuth) {
      router.replace("/(auth)/login");
    }

    if (accessToken && inAuth) {
      router.replace("/(app)/home");
    }
  }, [accessToken, segments]);

  if (!ready) return null;

  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false }} />
    </Providers>
  );
}
