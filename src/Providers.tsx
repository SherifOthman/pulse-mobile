import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import {
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from "@expo-google-fonts/cairo";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "./global.css"; // <-- file from previous step

const client = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const [loaded] = useFonts({
    Cairo: Cairo_400Regular,
    "Cairo-Bold": Cairo_700Bold,
    "Cairo-Medium": Cairo_500Medium,
    "Cairo-SemiBold": Cairo_600SemiBold,
  });

  if (!loaded) return null;

  return (
    <GestureHandlerRootView className="flex-1 bg-background">
      <HeroUINativeProvider>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
