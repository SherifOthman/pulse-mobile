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
        <Avatar size="lg" style={{ width: 112, height: 112, borderRadius: 56 }}>
          {imageUrl ? <Avatar.Image source={{ uri: imageUrl }} /> : null}
          <Avatar.Fallback delayMs={200}>
            {fullName?.charAt(0) ?? "؟"}
          </Avatar.Fallback>
        </Avatar>
      </View>

      <Text.Heading type="h3" weight="bold" align="center" className="mt-4">
        {fullName ?? "المستخدم"}
      </Text.Heading>

      <Chip size="md" className="mt-3 bg-default px-4">
        <Chip.Label className="text-muted text-sm">{email}</Chip.Label>
      </Chip>
    </View>
  );
}
