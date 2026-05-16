import { useAuthStore } from "@/src/stores/auth-store";
import { Image, Text, View } from "react-native";

export default function Home() {
  const user = useAuthStore((state) => state.user);

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl">Welcome</Text>

      <Text>{user?.fullName}</Text>

      {user?.ImageUrl && (
        <Image
          source={{ uri: user.ImageUrl }}
          className="w-20 h-20 rounded-full mt-4"
        />
      )}
    </View>
  );
}
