import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Pressable,
  Text,
  View,
} from "react-native";

const GoogleButton = () => (
  <Pressable
    className="flex-row items-center justify-center h-12 px-6 rounded-full bg-white border border-gray-300 active:bg-gray-100 shadow-sm w-full max-w-xs"
    onPress={() => router.replace("/(app)/home")}
  >
    <Ionicons name="logo-google" size={20} color="#4285F4" />
    <Text className="ml-3 text-base font-medium text-gray-700">
      Sign in with Google
    </Text>
  </Pressable>
);

export default function Login() {
  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center px-8">
        <Ionicons name="cloud-done-outline" size={80} color="#4285F4" />

        <Text className="text-3xl font-bold mt-6">Drive</Text>
        <Text className="text-base text-gray-500 mt-2 text-center max-w-xs">
          Store, share, and access your files from anywhere
        </Text>

        <View className="w-full items-center mt-12">
          <GoogleButton />
        </View>
      </View>

      <Text className="text-xs text-gray-400 text-center pb-8">
        By signing in, you agree to our Terms of Service
      </Text>
    </View>
  );
}
