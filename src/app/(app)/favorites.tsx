import { PageHeader } from "@/src/components/PageHeader";
import type { FavoriteItem } from "@/src/features/favorites/api/favorites-api";
import { useFavorites } from "@/src/features/favorites/hooks/use-favorites";
import { nameInitial } from "@/src/arabic";
import { getImageUrl } from "@/src/get-image-url";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Avatar,
  PressableFeedback,
  Separator,
  Skeleton,
  Surface,
  Typography,
  useThemeColor,
} from "heroui-native";
import { SectionList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Metadata per type ────────────────────────────────────────────────────────

const TYPE_META: Record<number, { label: string; icon: React.ComponentProps<typeof Ionicons>["name"]; route: string }> = {
  1: { label: "الأطباء",    icon: "people-outline",  route: "/(app)/doctor"    },
  2: { label: "الصيدليات", icon: "medkit-outline",   route: "/(app)/pharmacy"  },
  3: { label: "المعامل",   icon: "flask-outline",    route: "/(app)/lab"       },
  4: { label: "الأشعة",    icon: "scan-outline",     route: "/(app)/radiology" },
};

// ── Row ───────────────────────────────────────────────────────────────────────

function FavoriteRow({ item }: { item: FavoriteItem }) {
  const [mutedColor] = useThemeColor(["muted"]);
  const meta = TYPE_META[item.businessType];

  const navigate = () => router.push(`${meta?.route ?? "/(app)/doctor"}/${item.id}` as any);

  return (
    <PressableFeedback onPress={navigate} animation={false}>
      <PressableFeedback.Scale>
        <View className="flex-row-reverse items-center gap-3 px-5 py-3.5">
          <Avatar size="md">
            {item.profileImageUrl ? (
              <Avatar.Image source={{ uri: getImageUrl(item.profileImageUrl)! }} />
            ) : (
              <Avatar.Fallback>{nameInitial(item.name)}</Avatar.Fallback>
            )}
          </Avatar>

          <View className="flex-1 items-end gap-0.5">
            <Typography.Paragraph weight="semibold" className="text-right">
              {item.name}
            </Typography.Paragraph>
            {item.averageRating > 0 && (
              <View className="flex-row-reverse items-center gap-1">
                <Ionicons name="star" size={12} color="#f59e0b" />
                <Typography.Paragraph type="body-xs" className="text-amber-500">
                  {item.averageRating.toFixed(1)}
                </Typography.Paragraph>
                <Typography.Paragraph type="body-xs" color="muted">
                  ({item.totalRatings})
                </Typography.Paragraph>
              </View>
            )}
          </View>

          <Ionicons name="chevron-back-outline" size={16} color={mutedColor} />
        </View>
      </PressableFeedback.Scale>
      <PressableFeedback.Ripple />
    </PressableFeedback>
  );
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader({ type }: { type: number }) {
  const [accentColor] = useThemeColor(["accent"]);
  const meta = TYPE_META[type];
  if (!meta) return null;

  return (
    <View className="flex-row-reverse items-center gap-2 px-5 py-2 bg-background">
      <Ionicons name={meta.icon} size={15} color={accentColor} />
      <Typography.Paragraph type="body-xs" weight="semibold" className="text-accent">
        {meta.label}
      </Typography.Paragraph>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { data: favorites = [], isLoading } = useFavorites();

  // Group into sections by businessType, keep order: 1→2→3→4
  const sections = [1, 2, 3, 4]
    .map((type) => ({
      type,
      data: favorites.filter((f) => f.businessType === type),
    }))
    .filter((s) => s.data.length > 0);

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="المفضلة" />

      {isLoading ? (
        <View className="px-5 gap-4 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="flex-row-reverse items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <View className="flex-1 gap-2 items-end">
                <Skeleton className="w-40 h-4 rounded-lg" />
                <Skeleton className="w-24 h-3 rounded-lg" />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 24,
            flexGrow: 1,
          }}
          renderSectionHeader={({ section }) => (
            <SectionHeader type={section.type} />
          )}
          renderItem={({ item, index, section }) => (
            <View>
              <FavoriteRow item={item} />
              {index < section.data.length - 1 && <Separator className="mx-5" />}
            </View>
          )}
          SectionSeparatorComponent={() => <View className="h-3" />}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-24">
              <Ionicons name="heart-outline" size={52} color="#9ca3af" />
              <Typography.Paragraph color="muted" className="mt-3 text-center">
                لا توجد عناصر في المفضلة بعد
              </Typography.Paragraph>
            </View>
          }
        />
      )}
    </View>
  );
}
