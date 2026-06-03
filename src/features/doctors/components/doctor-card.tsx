import { Ionicons } from "@expo/vector-icons";
import { Avatar, Chip, Surface, Typography } from "heroui-native";
import { Pressable, View } from "react-native";
import { formatSchedule } from "../../../utils/arabic";
import type { DoctorResponse } from "../api/doctors-api";

export interface DoctorCardProps {
  doctor: DoctorResponse;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  className?: string;
}

export function DoctorCard({
  doctor,
  onToggleFavorite,
  isFavorite,
  className,
}: DoctorCardProps) {
  const fallbackChar = doctor.name.replace(/^د\.?\s*/i, "").charAt(0);
  const schedule = formatSchedule(
    doctor.nextWorkingDay,
    doctor.startTime,
    doctor.endTime,
    doctor.isOpen,
  );

  return (
    <Surface className={`px-3 py-3 ${className ?? ""}`.trim()}>
      <View className="flex-row-reverse gap-3">
        <Avatar size="lg">
          {doctor.profileImageUrl ? (
            <Avatar.Image source={{ uri: doctor.profileImageUrl }} />
          ) : (
            <Avatar.Fallback>{fallbackChar}</Avatar.Fallback>
          )}
        </Avatar>

        <View className="flex-1 gap-1">
          <Typography.Paragraph weight="bold" className="text-right">
            {doctor.name}
          </Typography.Paragraph>

          <View className="flex-row-reverse gap-2">
            <Chip size="sm" variant="secondary">
              <Chip.Label className="text-right">
                {doctor.specialization}
              </Chip.Label>
            </Chip>
            {doctor.isOpen && (
              <Chip size="sm" className="bg-green-500/20">
                <Chip.Label className="text-green-600 font-bold">
                  مفتوح
                </Chip.Label>
              </Chip>
            )}
          </View>
        </View>
      </View>

      <View className="mt-2 flex-row-reverse items-center justify-between">
        <View className="flex-row-reverse items-center gap-2">
          <View className="flex-row-reverse items-center gap-1">
            <Ionicons name="location-outline" size={14} color="#888" />
            <Typography.Paragraph type="body-xs" color="muted">
              {doctor.governorate}
            </Typography.Paragraph>
          </View>
          {doctor.visitPrice != null && (
            <View className="flex-row-reverse items-center gap-1">
              <Ionicons name="cash-outline" size={14} color="#888" />
              <Typography.Paragraph type="body-xs" color="muted">
                {doctor.visitPrice.toLocaleString("ar-EG")} ج.م
              </Typography.Paragraph>
            </View>
          )}
        </View>
        <View className="flex-row-reverse items-center gap-1">
          <Ionicons name="star" size={12} color="#facc15" />
          <Typography.Paragraph
            type="body-xs"
            weight="semibold"
            style={{ color: "#facc15" }}
          >
            {doctor.averageRating.toFixed(1)}
          </Typography.Paragraph>
          <Typography.Paragraph type="body-xs" color="muted">
            ({doctor.totalRatings ?? 0})
          </Typography.Paragraph>
        </View>
      </View>

      <View className="mt-2 flex-row-reverse items-center justify-between border-t border-border pt-2">
        <View className="flex-row-reverse items-center gap-1">
          <Ionicons name="time-outline" size={14} color="#888" />
          <Typography.Paragraph type="body-xs">{schedule}</Typography.Paragraph>
        </View>
        <Pressable onPress={onToggleFavorite} className="p-2">
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={22}
            color={isFavorite ? "#ef4444" : "#888"}
          />
        </Pressable>
      </View>
    </Surface>
  );
}
