import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ListGroup,
  Separator,
  Switch,
  Text,
  useThemeColor,
} from "heroui-native";
import { Pressable, ScrollView, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Uniwind, useUniwind } from "uniwind";

export default function Settings() {
  const insets = useSafeAreaInsets();
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const [accent, muted, foreground] = useThemeColor([
    "accent",
    "muted",
    "foreground",
  ]);

  const toggleTheme = () => Uniwind.setTheme(isDark ? "light" : "dark");

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="flex-row-reverse items-center px-5 pb-4 border-b border-border"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Text.Heading type="h4" weight="bold">
          الإعدادات
        </Text.Heading>
        <View className="flex-1" />
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-default items-center justify-center"
        >
          <Ionicons name="chevron-back" size={20} color={foreground} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance section */}
        <View className="gap-2">
          <Text.Paragraph
            type="body-sm"
            color="muted"
            className="mr-1 text-right"
          >
            المظهر
          </Text.Paragraph>

          <ListGroup>
            {/* Dark mode row — RTL */}
            <ListGroup.Item style={{ flexDirection: "row-reverse" }}>
              {/* Icon */}
              <View className="w-9 h-9 rounded-full bg-accent/10 items-center justify-center ml-3">
                <Ionicons
                  name={isDark ? "moon" : "sunny-outline"}
                  size={18}
                  color={accent}
                />
              </View>
              {/* Label */}
              <View className="flex-1">
                <ListGroup.ItemTitle>الوضع الليلي</ListGroup.ItemTitle>
                <ListGroup.ItemDescription>
                  {isDark ? "مفعّل" : "معطّل"}
                </ListGroup.ItemDescription>
              </View>
              {/* HeroUI Switch */}
              <Switch
                isSelected={isDark}
                onSelectedChange={toggleTheme}
                className="w-14 h-8"
              >
                <Switch.Thumb
                  className="size-6"
                  animation={{
                    left: {
                      value: 4,
                      springConfig: { damping: 30, stiffness: 300 },
                    },
                  }}
                />
                <Switch.StartContent className="left-1.5">
                  {isDark && (
                    <Animated.View entering={ZoomIn.springify()}>
                      <Ionicons name="moon" size={14} color="white" />
                    </Animated.View>
                  )}
                </Switch.StartContent>
                <Switch.EndContent className="right-1.5">
                  {!isDark && (
                    <Animated.View entering={ZoomIn.springify()}>
                      <Ionicons name="sunny" size={14} color="white" />
                    </Animated.View>
                  )}
                </Switch.EndContent>
              </Switch>
            </ListGroup.Item>
          </ListGroup>
        </View>

        {/* Notifications section */}
        <View className="gap-2">
          <Text.Paragraph
            type="body-sm"
            color="muted"
            className="mr-1 text-right"
          >
            الإشعارات
          </Text.Paragraph>

          <ListGroup>
            <ListGroup.Item style={{ flexDirection: "row-reverse" }}>
              <View className="w-9 h-9 rounded-full bg-accent/10 items-center justify-center ml-3">
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color={accent}
                />
              </View>
              <View className="flex-1">
                <ListGroup.ItemTitle>إشعارات التطبيق</ListGroup.ItemTitle>
                <ListGroup.ItemDescription>
                  تلقّي الإشعارات
                </ListGroup.ItemDescription>
              </View>
              <Switch
                isSelected={true}
                onSelectedChange={() => {}}
                className="w-14 h-8"
              >
                <Switch.Thumb className="size-6" />
              </Switch>
            </ListGroup.Item>
            <Separator className="mx-4" />
            <ListGroup.Item style={{ flexDirection: "row-reverse" }}>
              <View className="w-9 h-9 rounded-full bg-accent/10 items-center justify-center ml-3">
                <Ionicons name="mail-outline" size={18} color={accent} />
              </View>
              <View className="flex-1">
                <ListGroup.ItemTitle>إشعارات البريد</ListGroup.ItemTitle>
                <ListGroup.ItemDescription>
                  تلقّي رسائل البريد
                </ListGroup.ItemDescription>
              </View>
              <Switch
                isSelected={false}
                onSelectedChange={() => {}}
                className="w-14 h-8"
              >
                <Switch.Thumb className="size-6" />
              </Switch>
            </ListGroup.Item>
          </ListGroup>
        </View>

        {/* About section */}
        <View className="gap-2">
          <Text.Paragraph
            type="body-sm"
            color="muted"
            className="mr-1 text-right"
          >
            حول التطبيق
          </Text.Paragraph>

          <ListGroup>
            <ListGroup.Item style={{ flexDirection: "row-reverse" }}>
              <View className="w-9 h-9 rounded-full bg-accent/10 items-center justify-center ml-3">
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={accent}
                />
              </View>
              <View className="flex-1">
                <ListGroup.ItemTitle>الإصدار</ListGroup.ItemTitle>
                <ListGroup.ItemDescription>1.0.0</ListGroup.ItemDescription>
              </View>
            </ListGroup.Item>
            <Separator className="mx-4" />
            <ListGroup.Item style={{ flexDirection: "row-reverse" }}>
              <View className="w-9 h-9 rounded-full bg-accent/10 items-center justify-center ml-3">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color={accent}
                />
              </View>
              <View className="flex-1">
                <ListGroup.ItemTitle>سياسة الخصوصية</ListGroup.ItemTitle>
              </View>
              <Ionicons name="chevron-back" size={16} color={muted} />
            </ListGroup.Item>
          </ListGroup>
        </View>
      </ScrollView>
    </View>
  );
}
