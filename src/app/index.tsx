import { Redirect } from "expo-router";
import { useAuthStore } from "../features/auth/store/auth-store";

export default function Index() {
  const { accessToken } = useAuthStore();

  if (!accessToken) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(app)/home" />;
}
