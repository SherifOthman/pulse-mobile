import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "./global.css"; // <-- file from previous step

const client = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
