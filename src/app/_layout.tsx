import { Stack } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useEffect, useState } from "react";
import Providers from "../Providers";
import { useAuthStore } from "../stores/auth-store";

export default function RootLayout() {
  const [background] = useThemeColor(["background"]);
  const hydrate = useAuthStore((state) => state.hydrate);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const init = async () => {
      await hydrate();
      setHydrated(true);
    };
    init();
  }, []);

  if (!hydrated) return null;

  return (
    <Providers>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </Providers>
  );
}
