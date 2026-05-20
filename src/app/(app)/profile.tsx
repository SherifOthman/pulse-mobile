import { useMe } from "@/src/features/profile/profile-queries";
import { useAuthStore } from "@/src/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import {
  Avatar,
  Chip,
  Separator,
  Spinner,
  Text,
  useThemeColor,
} from "heroui-native";
import { Pressable, ScrollView, View } from "react-native";
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

  const menuItems: MenuItem[] = [
    {
      icon: "pencil-outline",
      label: "تعديل الملف الشخصي",
      onPress: () => router.push("/(app)/edit-profile"),
    },
    {
      icon: "settings-outline",
      label: "الإعدادات",
      onPress: () => router.push("/(app)/settings"),
    },
    { icon: "people-outline", label: "دعوة صديق", onPress: () => {} },
  ];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Spinner />
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
      <View
        className="w-full rounded-2xl overflow-hidden"
        style={{ backgroundColor: surface }}
      >
        {menuItems.map((item, index) => (
          <View key={item.label}>
            <RTLRow
              icon={item.icon}
              label={item.label}
              onPress={item.onPress}
              iconBg={accent + "18"}
              iconColor={accent}
              muted={muted}
            />
            {index < menuItems.length - 1 && <Separator className="mx-4" />}
          </View>
        ))}
      </View>

      {/* Logout */}
      <View
        className="w-full rounded-2xl overflow-hidden"
        style={{ backgroundColor: surface }}
      >
        <RTLRow
          icon="log-out-outline"
          label="تسجيل الخروج"
          onPress={handleLogout}
          iconBg={danger + "18"}
          iconColor={danger}
          textColor={danger}
          muted={muted}
          showArrow={false}
        />
      </View>
    </ScrollView>
  );
}

type MenuItem = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
  danger?: boolean;
};

// RTL row: icon (right) → text → arrow (left)
function RTLRow({
  icon,
  label,
  onPress,
  iconBg,
  iconColor,
  textColor,
  muted,
  showArrow = true,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
  iconBg: string;
  iconColor: string;
  textColor?: string;
  muted: string;
  showArrow?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {/* Arrow — far left */}
      {showArrow && <Ionicons name="chevron-back" size={16} color={muted} />}

      {/* Text — fills middle */}
      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <Text
          className="text-right"
          type="body"
          weight="medium"
          style={textColor ? { color: textColor } : undefined}
        >
          {label}
        </Text>
      </View>

      {/* Icon circle — far right */}
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: iconBg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
    </Pressable>
  );
}
