import { Stack } from "expo-router";
import { useThemeColor } from "heroui-native";

export default function AppLayout() {
  const [background] = useThemeColor(["background"]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="doctor/[id]" />
      <Stack.Screen name="pharmacy/[id]" />
      <Stack.Screen name="lab/[id]" />
      <Stack.Screen name="radiology/[id]" />
      <Stack.Screen name="news/[id]" />
      <Stack.Screen name="reviews/[businessId]" />
      <Stack.Screen name="favorites" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="edit-profile" />
    </Stack>
  );
}
