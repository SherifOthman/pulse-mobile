import { Separator, Typography } from "heroui-native";
import { View } from "react-native";

type Props = {
  title: string;
  children: React.ReactNode;
};

export function DetailSection({ title, children }: Props) {
  return (
    <View className="gap-3">
      <Typography.Heading type="h5" className="text-right">{title}</Typography.Heading>
      <Separator />
      {children}
    </View>
  );
}
