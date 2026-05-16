import { env } from "@/src/config/env";
import { api } from "@/src/services/api";
import { useAuthStore } from "@/src/stores/auth-store";
import * as Google from "expo-auth-session/providers/google";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Button, Text } from "heroui-native";
import { useEffect } from "react";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const insets = useSafeAreaInsets();
  const setSession = useAuthStore((s) => s.setSession);
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: env.googleWebClientId,
    androidClientId: env.googleAndroidClientId,
  });

  useEffect(() => {
    const login = async () => {
      if (response?.type !== "success") return;

      const idToken = response.authentication?.idToken;

      if (!idToken) return;

      const res = await api.post("/auth/goole", { idToken });

      await setSession(res.data.accessToken, res.data.refreshToken);

      router.replace("/(app)/home");
    };
    login();
  }, [response]);

  return (
    <View
      className="bg-background flex-1 px-6  items-center"
      style={{ paddingTop: insets.top }}
    >
      <Text.Heading className="font-bold mt-4 "> احجزلى</Text.Heading>

      <Image
        className=""
        source={require("@/assets/images/city-driver.png")}
        style={{ width: 300, height: 300 }}
        resizeMode="cover"
      />
      <Button
        isDisabled={!request}
        onPress={() => promptAsync()}
        className="w-full mt-24"
        size="md"
        variant="tertiary"
      >
        <Image
          source={require("@/assets/icons/google-icon.png")}
          style={{ width: 25, height: 25, marginLeft: 8 }}
        />
        <Button.Label className="font-bold">تسجيل الدخول بجوجل </Button.Label>
      </Button>
      {/* <ThemeToggle /> */}
    </View>
  );
}
