import { ProfileHeader } from "@/src/features/profile/components/profile-header";
import { ProfileMenu } from "@/src/features/profile/components/profile-menu";
import { useMe } from "@/src/features/profile/hooks/use-profile";
import { useAuthStore } from "@/src/features/auth/store/auth-store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { Skeleton } from "heroui-native";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile() {
  const insets = useSafeAreaInsets();
  const logout = useAuthStore((state) => state.logout);
  const { data, isLoading } = useMe();

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
      className="flex-1 bg-background px-5"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 100,
        alignItems: "center",
        gap: 16,
      }}
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeader imageUrl={data?.imageUrl ?? null} fullName={data?.fullName} email={data?.email} />

      <ProfileMenu
        menuItems={[
          { icon: "pencil-outline", label: "تعديل الملف الشخصي", onPress: () => router.push("/(app)/edit-profile") },
          { icon: "settings-outline", label: "الإعدادات", onPress: () => router.push("/(app)/settings") },
          { icon: "people-outline", label: "دعوة صديق" },
        ]}
        logoutItem={{ onPress: handleLogout }}
      />
    </ScrollView>
  );
}
