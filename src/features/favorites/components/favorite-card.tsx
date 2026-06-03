import { Ionicons } from "@expo/vector-icons";
import { Avatar, Card, PressableFeedback, Typography, useThemeColor } from "heroui-native";
import { TouchableOpacity, View } from "react-native";
import type { FavoriteListItem } from "../hooks/use-favorites";

export type FavoriteCardProps = FavoriteListItem & {
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPress?: () => void;
  className?: string;
};

export function FavoriteCard({
  name,
  profileImageUrl,
  averageRating,
  totalRatings,
  isFavorite,
  onToggleFavorite,
  onPress,
  className,
}: FavoriteCardProps) {
  const fallbackChar = name.replace(/^د\.?\s*/i, "").charAt(0);
  const [dangerColor, mutedColor] = useThemeColor(["danger", "muted"]);

  return (
    <PressableFeedback onPress={onPress} animation={false}>
      <PressableFeedback.Scale>
        <Card className={className}>
          <Card.Body className="flex-row-reverse gap-3 p-3">
            <Avatar size="lg">
              {profileImageUrl ? (
                <Avatar.Image source={{ uri: profileImageUrl }} />
              ) : (
                <Avatar.Fallback>{fallbackChar}</Avatar.Fallback>
              )}
            </Avatar>

            <View className="flex-1 gap-1 justify-center">
              <View className="flex-row-reverse items-center justify-between">
                <Typography.Paragraph weight="bold">{name}</Typography.Paragraph>
                <TouchableOpacity
                  onPress={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={22}
                    color={isFavorite ? dangerColor : mutedColor}
                  />
                </TouchableOpacity>
              </View>

              <View className="flex-row-reverse items-center gap-1">
                <Ionicons name="star" size={12} color="#facc15" />
                <Typography.Paragraph type="body-xs" weight="semibold" className="text-yellow-500">
                  {averageRating > 0 ? averageRating.toFixed(1) : "—"}
                </Typography.Paragraph>
                <Typography.Paragraph type="body-xs" color="muted">
                  ({totalRatings})
                </Typography.Paragraph>
              </View>
            </View>
          </Card.Body>
        </Card>
      </PressableFeedback.Scale>
      <PressableFeedback.Ripple />
    </PressableFeedback>
  );
}
