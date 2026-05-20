import { Avatar, Chip, Text } from "heroui-native";
import { View } from "react-native";

type Props = {
  imageUrl: string | null;
  fullName?: string;
  email?: string;
};

export function ProfileHeader({ imageUrl, fullName, email }: Props) {
  return (
    <View className="items-center mt-4">
      <View>
        <Avatar size="lg" className="w-28 h-28 rounded-full">
          {imageUrl ? <Avatar.Image source={{ uri: imageUrl }} /> : null}
          <Avatar.Fallback delayMs={200}>
            {fullName?.charAt(0) ?? "؟"}
          </Avatar.Fallback>
        </Avatar>
      </View>

      <Text.Heading type="h3" weight="bold" align="center" className="mt-4">
        {fullName ?? "المستخدم"}
      </Text.Heading>

      <Chip size="md" className="mt-3 px-4" variant="secondary">
        <Chip.Label className="text-muted text-sm">{email}</Chip.Label>
      </Chip>
    </View>
  );
}
