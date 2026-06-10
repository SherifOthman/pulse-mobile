import type { BusinessListItem } from "@/src/types";
import { formatSchedule, nameInitial } from "@/src/arabic";
import { getImageUrl } from "@/src/get-image-url";
import { Ionicons } from "@expo/vector-icons";
import {
  Avatar,
  Card,
  Chip,
  PressableFeedback,
  Typography,
  useThemeColor,
} from "heroui-native";
import { View } from "react-native";

export type BusinessCardProps = {
  item: BusinessListItem;
  onPress?: () => void;
  /** Rendered between name row and location/rating row — use for type-specific chips */
  extraChips?: React.ReactNode;
  /** Rendered between location row and schedule row — use for type-specific info */
  extraInfo?: React.ReactNode;
  className?: string;
};

export function BusinessCard({
  item,
  onPress,
  extraChips,
  extraInfo,
  className,
}: BusinessCardProps) {
  const [mutedColor] = useThemeColor(["muted"]);

  const schedule = formatSchedule(
    item.nextWorkingDay,
    item.startTime,
    item.endTime,
    item.isOpen,
  );

  return (
    <PressableFeedback onPress={onPress} animation={false}>
      <PressableFeedback.Scale>
        <Card className={className}>
          <Card.Body className="gap-2">
            {/* Row 1: avatar + name + open badge */}
            <View className="flex-row-reverse gap-3">
              <Avatar size="lg">
                {item.profileImageUrl ? (
                  <Avatar.Image source={{ uri: getImageUrl(item.profileImageUrl)! }} />
                ) : (
                  <Avatar.Fallback>{nameInitial(item.name)}</Avatar.Fallback>
                )}
              </Avatar>

              <View className="flex-1 gap-1">
                <Typography.Paragraph weight="bold" className="text-right">
                  {item.name}
                </Typography.Paragraph>
                <View className="flex-row-reverse gap-2 flex-wrap">
                  {extraChips}
                  {item.isOpen && (
                    <Chip size="sm" variant="soft" color="success">
                      <Chip.Label>مفتوح</Chip.Label>
                    </Chip>
                  )}
                </View>
              </View>
            </View>

            {extraInfo}

            {/* Row 2: location + visitPrice (right) | rating (left) */}
            <View className="flex-row-reverse items-center justify-between">
              <View className="flex-row-reverse items-center gap-1">
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={mutedColor}
                />
                <Typography.Paragraph type="body-xs" color="muted">
                  {item.governorate}
                </Typography.Paragraph>
                {item.visitPrice != null && (
                  <>
                    <Typography.Paragraph type="body-xs" color="muted">
                      -
                    </Typography.Paragraph>
                    <Ionicons
                      name="cash-outline"
                      size={14}
                      color={mutedColor}
                    />
                    <Typography.Paragraph type="body-xs" color="muted">
                      {item.visitPrice.toLocaleString("ar-EG")} ج.م
                    </Typography.Paragraph>
                  </>
                )}
              </View>
              <View className="flex-row-reverse items-center gap-1">
                <Ionicons name="star" size={12} color="#facc15" />
                <Typography.Paragraph
                  type="body-xs"
                  weight="semibold"
                  className="text-yellow-500"
                >
                  {item.averageRating.toFixed(1)}
                </Typography.Paragraph>
                <Typography.Paragraph type="body-xs" color="muted">
                  ({item.totalRatings})
                </Typography.Paragraph>
              </View>
            </View>

            {/* Row 3: schedule | heart */}
            <View className="flex-row-reverse items-center justify-between border-t border-border pt-2">
              <View className="flex-row-reverse items-center gap-1">
                <Ionicons name="time-outline" size={14} color={mutedColor} />
                <Typography.Paragraph type="body-xs">
                  {schedule}
                </Typography.Paragraph>
              </View>
              <View style={{ width: 22, height: 22 }} />
            </View>
          </Card.Body>
        </Card>
      </PressableFeedback.Scale>
      <PressableFeedback.Ripple />
    </PressableFeedback>
  );
}
