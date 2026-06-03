import { Ionicons } from "@expo/vector-icons";
import { Card, Separator, Typography, useThemeColor } from "heroui-native";
import { View } from "react-native";
import { WorkingDayRow } from "./working-day-row";
import type { BranchDetail } from "../api/doctor-details-api";

type Props = {
  branch: BranchDetail;
};

export function BranchCard({ branch }: Props) {
  const [mutedColor] = useThemeColor(["muted"]);

  return (
    <Card variant="secondary">
      <Card.Body className="p-3 gap-2">
        <Typography.Paragraph weight="bold" className="text-right">
          {branch.name}
        </Typography.Paragraph>

        {branch.address && (
          <View className="flex-row-reverse items-center gap-2">
            <Ionicons name="location-outline" size={14} color={mutedColor} />
            <Typography.Paragraph type="body-sm" color="muted" className="flex-1 text-right">
              {branch.address}
            </Typography.Paragraph>
          </View>
        )}

        {branch.phoneNumbers.map((p, i) => (
          <View key={i} className="flex-row-reverse items-center gap-2">
            <Ionicons name="call-outline" size={14} color={mutedColor} />
            <Typography.Paragraph type="body-sm">{p.number}</Typography.Paragraph>
          </View>
        ))}

        {branch.workingDays.length > 0 && (
          <>
            <Separator className="my-1" />
            {branch.workingDays.map((wd) => (
              <WorkingDayRow key={wd.day} wd={wd} size="sm" />
            ))}
          </>
        )}
      </Card.Body>
    </Card>
  );
}
