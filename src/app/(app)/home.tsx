import { useMe } from "@/src/features/profile/hooks/use-profile";
import { Skeleton, Text } from "heroui-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useMe();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background">
        <Skeleton className="w-32 h-8 rounded-lg" />
        <Skeleton className="w-48 h-5 rounded-md" />
        <Skeleton className="w-40 h-4 rounded-md" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center gap-3 bg-background" style={{ paddingTop: insets.top }}>
      <Text.Heading type="h3" weight="bold">
        مرحباً
      </Text.Heading>
      <Text.Paragraph weight="semibold">{data?.fullName}</Text.Paragraph>
      <Text.Paragraph type="body-sm" color="muted">
        {data?.email}
      </Text.Paragraph>
    </View>
  );
}
