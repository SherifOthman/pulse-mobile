import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import Providers from "../Providers";
import { useAuthStore } from "../features/auth/auth-store";
import { useThemeColor } from "heroui-native";
import { useUniwind } from "uniwind";

/**
 * AppShell sits inside Providers so it has access to the
 * HeroUI / Uniwind context needed for useUniwind().
 */
function AppShell() {
  const { theme } = useUniwind();
  const [background] = useThemeColor(["background"]);
  const statusBarStyle = theme === "dark" ? "light" : "dark";

  return (
    <>
      <StatusBar style={statusBarStyle} />
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
    </>
  );
}

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const init = async () => {
      await hydrate();
      setHydrated(true);
    };
    init();
  }, [hydrate]);

  if (!hydrated) return null;

  return (
    <Providers>
      <AppShell />
    </Providers>
  );
}
