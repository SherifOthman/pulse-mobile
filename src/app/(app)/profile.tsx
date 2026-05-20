import { useMe } from "@/src/features/profile/profile-queries";
import { useAuthStore } from "@/src/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import {
  Avatar,
  Button,
  Chip,
  ListGroup,
  Separator,
  Skeleton,
  Text,
  useThemeColor,
} from "heroui-native";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile() {
  const insets = useSafeAreaInsets();
  const logout = useAuthStore((state) => state.logout);
  const { data, isLoading } = useMe();
  const [muted, accent, danger, surface] = useThemeColor([
    "muted",
    "accent",
    "danger",
    "surface",
  ]);

  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut();
    } catch {}
    await logout();
    router.replace("/(auth)/login");
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Skeleton className="w-28 h-28 rounded-full" />
        <Skeleton className="w-40 h-6 rounded-lg mt-6" />
        <Skeleton className="w-48 h-8 rounded-full mt-4" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 100,
        paddingHorizontal: 20,
        alignItems: "center",
        gap: 16,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar */}
      <View className="items-center mt-4">
        <View>
          <Avatar
            size="lg"
            style={{ width: 112, height: 112, borderRadius: 56 }}
          >
            {data?.imageUrl ? (
              <Avatar.Image source={{ uri: data.imageUrl }} />
            ) : null}
            <Avatar.Fallback delayMs={200}>
              {data?.fullName?.charAt(0) ?? "؟"}
            </Avatar.Fallback>
          </Avatar>
        </View>

        <Text.Heading type="h3" weight="bold" align="center" className="mt-4">
          {data?.fullName ?? "المستخدم"}
        </Text.Heading>

        <Chip size="md" className="mt-3 bg-default px-4">
          <Chip.Label className="text-muted text-sm">{data?.email}</Chip.Label>
        </Chip>
      </View>

      {/* Menu */}
      <ListGroup className="w-full">
        <ListGroup.Item
          onPress={() => router.push("/(app)/edit-profile")}
          className="flex-row-reverse"
        >
          <View className="w-9 h-9 rounded-full bg-accent/10 items-center justify-center ml-3">
            <Ionicons name="pencil-outline" size={18} color={accent} />
          </View>
          <View className="flex-1 items-end">
            <ListGroup.ItemTitle>تعديل الملف الشخصي</ListGroup.ItemTitle>
          </View>
          <Ionicons name="chevron-back" size={16} color={muted} />
        </ListGroup.Item>

        <Separator className="mx-4" />

        <ListGroup.Item
          onPress={() => router.push("/(app)/settings")}
          className="flex-row-reverse"
        >
          <View className="w-9 h-9 rounded-full bg-accent/10 items-center justify-center ml-3">
            <Ionicons name="settings-outline" size={18} color={accent} />
          </View>
          <View className="flex-1 items-end">
            <ListGroup.ItemTitle>الإعدادات</ListGroup.ItemTitle>
          </View>
          <Ionicons name="chevron-back" size={16} color={muted} />
        </ListGroup.Item>

        <Separator className="mx-4" />

        <ListGroup.Item className="flex-row-reverse">
          <View className="w-9 h-9 rounded-full bg-accent/10 items-center justify-center ml-3">
            <Ionicons name="people-outline" size={18} color={accent} />
          </View>
          <View className="flex-1 items-end">
            <ListGroup.ItemTitle>دعوة صديق</ListGroup.ItemTitle>
          </View>
          <Ionicons name="chevron-back" size={16} color={muted} />
        </ListGroup.Item>
      </ListGroup>

      {/* Logout */}
      <ListGroup className="w-full">
        <ListGroup.Item
          onPress={handleLogout}
          className="flex-row-reverse"
        >
          <View className="w-9 h-9 rounded-full bg-danger/10 items-center justify-center ml-3">
            <Ionicons name="log-out-outline" size={18} color={danger} />
          </View>
          <View className="flex-1 items-end">
            <Text type="body" weight="medium" className="text-danger">
              تسجيل الخروج
            </Text>
          </View>
        </ListGroup.Item>
      </ListGroup>
    </ScrollView>
  );
}
