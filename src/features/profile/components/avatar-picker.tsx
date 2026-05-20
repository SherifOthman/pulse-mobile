import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Avatar, PressableFeedback, Text, useThemeColor } from "heroui-native";
import { Alert, View } from "react-native";

type Props = {
  avatarUri?: string;
  fallbackName?: string;
  onChangeImage: (uri: string) => void;
};

export function AvatarPicker({ avatarUri, fallbackName, onChangeImage }: Props) {
  const [accent] = useThemeColor(["accent"]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("الإذن مرفوض", "يرجى السماح بالوصول إلى الصور من الإعدادات");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onChangeImage(result.assets[0].uri);
    }
  };

  return (
    <View className="items-center gap-3">
      <View>
        <Avatar size="lg" style={{ width: 100, height: 100, borderRadius: 50 }}>
          {avatarUri ? <Avatar.Image source={{ uri: avatarUri }} /> : null}
          <Avatar.Fallback delayMs={200}>
            {fallbackName?.charAt(0) ?? "؟"}
          </Avatar.Fallback>
        </Avatar>

        <PressableFeedback
          onPress={pickImage}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: accent,
            alignItems: "center",
            justifyContent: "center",
            elevation: 3,
          }}
        >
          <Ionicons name="camera" size={16} color="white" />
        </PressableFeedback>
      </View>

      <PressableFeedback onPress={pickImage}>
        <Text type="body-sm" className="text-accent" weight="medium">
          تغيير الصورة
        </Text>
      </PressableFeedback>
    </View>
  );
}
