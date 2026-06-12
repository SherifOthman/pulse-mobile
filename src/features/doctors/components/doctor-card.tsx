import { Chip, useThemeColor } from "heroui-native";
import { Ionicons } from "@expo/vector-icons";
import { BusinessCard } from "@/src/features/businesses/components/business-card";
import type { DoctorResponse } from "../api/doctors-api";

export type DoctorCardProps = {
  doctor: DoctorResponse;
  onPress?: () => void;
  className?: string;
};

export function DoctorCard({ doctor, onPress, className }: DoctorCardProps) {
  const [mutedColor] = useThemeColor(["muted"]);

  return (
    <BusinessCard
      item={doctor}
      onPress={onPress}
      className={className}
      extraChips={
        <>
          <Chip size="sm" variant="secondary">
            <Chip.Label className="text-right">{doctor.specialization}</Chip.Label>
          </Chip>
          {doctor.visitPrice != null && (
            <Chip size="sm" variant="soft" color="success">
              <Ionicons name="cash-outline" size={11} color={mutedColor} />
              <Chip.Label>{doctor.visitPrice} ج.م</Chip.Label>
            </Chip>
          )}
        </>
      }
    />
  );
}
