import { Ionicons } from "@expo/vector-icons";
import { ListGroup, Separator, useThemeColor } from "heroui-native";
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
  const [accent, danger] = useThemeColor(["accent", "danger"]);

  return (
    <>
      <ListGroup className="w-full">
        {menuItems.map((item, index) => (
          <View key={index}>
            {index > 0 && <Separator className="mx-4" />}
            <ListGroup.Item onPress={item.onPress}>
              <ListGroup.ItemSuffix className="rotate-180" />
              <ListGroup.ItemPrefix></ListGroup.ItemPrefix>
              <ListGroup.ItemContent>
                <ListGroup.ItemTitle className="text-right">
                  {item.label}
                </ListGroup.ItemTitle>
              </ListGroup.ItemContent>
              <View className="w-9 h-9 rounded-full bg-accent/10 items-center justify-center">
                <Ionicons name={item.icon} size={18} color={accent} />
              </View>
            </ListGroup.Item>
          </View>
        ))}
      </ListGroup>

      <ListGroup className="w-full">
        <ListGroup.Item onPress={logoutItem.onPress}>
          <ListGroup.ItemContent>
            <ListGroup.ItemTitle className="text-danger text-right">
              تسجيل الخروج
            </ListGroup.ItemTitle>
          </ListGroup.ItemContent>
          <ListGroup.ItemPrefix>
            <View className="w-9 h-9 rounded-full bg-danger/10 items-center justify-center">
              <Ionicons name="log-out-outline" size={18} color={danger} />
            </View>
          </ListGroup.ItemPrefix>
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}
