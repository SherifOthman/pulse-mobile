import { Ionicons } from "@expo/vector-icons";
import { ListGroup, Separator, Text, useThemeColor } from "heroui-native";
import { View } from "react-native";

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
};

type Props = {
  menuItems: MenuItem[];
  logoutItem: { onPress: () => void };
};

export function ProfileMenu({ menuItems, logoutItem }: Props) {
  const [muted, accent, danger] = useThemeColor(["muted", "accent", "danger"]);

  return (
    <>
      <ListGroup className="w-full">
        {menuItems.map((item, index) => (
          <View key={index}>
            {index > 0 && <Separator className="mx-4" />}
            <ListGroup.Item
              onPress={item.onPress}
              className="flex-row-reverse"
            >
              <View className="w-9 h-9 rounded-full bg-accent/10 items-center justify-center ml-3">
                <Ionicons name={item.icon} size={18} color={accent} />
              </View>
              <View className="flex-1 items-end">
                <ListGroup.ItemTitle>{item.label}</ListGroup.ItemTitle>
              </View>
              <Ionicons name="chevron-back" size={16} color={muted} />
            </ListGroup.Item>
          </View>
        ))}
      </ListGroup>

      <ListGroup className="w-full">
        <ListGroup.Item
          onPress={logoutItem.onPress}
          className="flex-row-reverse"
        >
          <View className="w-9 h-9 rounded-full bg-danger/10 items-center justify-center ml-3">
            <Ionicons name="log-out-outline" size={18} color={danger} />
          </View>
          <View className="flex-1 items-end">
            <Text type="body" weight="medium" className="text-danger">
              تسجيل الخروج
            </Text>
          </View>
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}
