import { Ionicons } from "@expo/vector-icons";
import { Avatar, Button, Card, Chip, Typography, useThemeColor } from "heroui-native";
import { View } from "react-native";
import { nameInitial } from "@/src/utils/arabic";
import type { DoctorDetailsResponse } from "../api/doctor-details-api";

type Props = {
  data: DoctorDetailsResponse;
  onToggleFavorite: () => void;
};

export function DoctorDetailHeader({ data, onToggleFavorite }: Props) {
  const [dangerColor, mutedColor] = useThemeColor(["danger", "muted"]);

  return (
    <Card>
      <Card.Body className="flex-row-reverse gap-4 p-4 items-center">
        <Avatar size="lg">
          {data.profileImageUrl ? (
            <Avatar.Image source={{ uri: data.profileImageUrl }} />
          ) : (
            <Avatar.Fallback>{nameInitial(data.name)}</Avatar.Fallback>
          )}
        </Avatar>

        <View className="flex-1 gap-1">
          <Typography.Heading type="h5" className="text-right">{data.name}</Typography.Heading>
          <Chip size="sm" variant="secondary" color="default">
            <Chip.Label>{data.specialization}</Chip.Label>
          </Chip>
          <View className="flex-row-reverse items-center gap-1 mt-1">
            <Ionicons name="star" size={14} color="#facc15" />
            <Typography.Paragraph type="body-sm" weight="semibold" className="text-yellow-500">
              {data.averageRating > 0 ? data.averageRating.toFixed(1) : "—"}
            </Typography.Paragraph>
            <Typography.Paragraph type="body-sm" color="muted">
              ({data.totalRatings} تقييم)
            </Typography.Paragraph>
          </View>
        </View>

        <Button variant="ghost" size="sm" isIconOnly onPress={onToggleFavorite}>
          <Ionicons
            name={data.isFavorite ? "heart" : "heart-outline"}
            size={26}
            color={data.isFavorite ? dangerColor : mutedColor}
          />
        </Button>
      </Card.Body>
    </Card>
  );
}
