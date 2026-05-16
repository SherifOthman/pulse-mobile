import { useMe } from "@/src/features/profile/profile-queries";
import { useAuthStore } from "@/src/stores/auth-store";
import { Button, Spinner } from "heroui-native";
import { Text, View } from "react-native";

export default function Profile() {
  const logout = useAuthStore((state) => state.logout);
  const { data, isLoading } = useMe();

  if (isLoading) return <Spinner />;

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl">Profile</Text>

      <Text>{data?.email}</Text>

      <Button onPress={logout}>Logout</Button>
    </View>
  );
}
