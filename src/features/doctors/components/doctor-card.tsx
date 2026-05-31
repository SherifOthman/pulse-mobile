import { Ionicons } from "@expo/vector-icons";
import { Avatar, Chip, Surface, Typography } from "heroui-native";
import { Pressable, View } from "react-native";

export interface DoctorCardProps {
  name: string;
  specialization: string;
  profileImageUrl?: string | null;
  visitPrice?: number | null;
  governorate: string;
  averageRating?: number | null;
  totalRatings?: number | null;
  isOpen: boolean;
  todaySchedule: string;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  className?: string;
}

export function DoctorCard({
  name,
  specialization,
  profileImageUrl,
  visitPrice,
  governorate,
  averageRating,
  totalRatings,
  isOpen,
  todaySchedule,
  onToggleFavorite,
  isFavorite,
  className,
}: DoctorCardProps) {
  const fallbackChar = name.replace(/^د\.?\s*/i, "").charAt(0);

  return (
    <Surface className={`px-3 py-3 ${className ?? ""}`.trim()}>
      <View className="flex-row-reverse gap-3">
        <Avatar size="lg">
          {profileImageUrl ? (
            <Avatar.Image source={{ uri: profileImageUrl }} />
          ) : (
            <Avatar.Fallback>{fallbackChar}</Avatar.Fallback>
          )}
        </Avatar>

        <View className="flex-1 gap-1 ">
          <View className="flex-row-reverse items-center gap-2 justify-between">
            <Typography.Paragraph weight="bold">{name}</Typography.Paragraph>
            <Pressable onPress={onToggleFavorite} className="ml-2">
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={22}
                color={isFavorite ? "#ef4444" : "#888"}
              />
            </Pressable>
          </View>

          <View className="flex-row-reverse gap-2">
            <Chip size="sm" variant="secondary">
              <Chip.Label className="text-right">{specialization}</Chip.Label>
            </Chip>
            {isOpen && (
              <View className="rounded-full bg-green-500/20 px-2 py-0.5">
                <Typography.Paragraph
                  type="body-xs"
                  weight="bold"
                  className="text-green-600"
                >
                  مفتوح
                </Typography.Paragraph>
              </View>
            )}
            <View className="flex-row-reverse items-center gap-1">
              <Ionicons name="star" size={12} color="#facc15" />
              <Typography.Paragraph
                type="body-xs"
                weight="semibold"
                style={{ color: "#facc15" }}
              >
                {averageRating != null ? averageRating.toFixed(1) : "0"}
              </Typography.Paragraph>
              <Typography.Paragraph type="body-xs" color="muted">
                ({totalRatings ?? 0})
              </Typography.Paragraph>
            </View>
          </View>
        </View>
      </View>

      <View className="mt-2 flex-row-reverse items-center gap-2">
        <View className="flex-row-reverse items-center gap-1">
          <Ionicons name="location-outline" size={14} color="#888" />
          <Typography.Paragraph type="body-xs" color="muted">
            {governorate}
          </Typography.Paragraph>
        </View>
        {visitPrice != null && (
          <View className="flex-row-reverse items-center gap-1">
            <Ionicons name="cash-outline" size={14} color="#888" />
            <Typography.Paragraph type="body-xs" color="muted">
              {visitPrice.toLocaleString("ar-EG")} ج.م
            </Typography.Paragraph>
          </View>
        )}
      </View>

      {todaySchedule ? (
        <View className="mt-2 flex-row-reverse items-center gap-1 border-t border-border pt-2">
          <Ionicons name="time-outline" size={14} color="#888" />
          <Typography.Paragraph type="body-xs">
            من {todaySchedule}
          </Typography.Paragraph>
        </View>
      ) : null}
    </Surface>
  );
}
