import { Dialog } from "heroui-native";
import { Image } from "expo-image";
import { Pressable, View, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  uri: string | null;
  isOpen: boolean;
  onClose: () => void;
  alt?: string;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 * Full-screen image preview modal for React Native.
 * Tap the image or the X button to close.
 */
export function ImagePreviewModal({ uri, isOpen, onClose, alt }: Props) {
  if (!uri) return null;

  return (
    <Dialog isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="bg-black/85"
          isCloseOnPress
        />
        <Dialog.Content
          className="bg-transparent shadow-none p-0 items-center justify-center"
          style={{ width: SCREEN_WIDTH, maxWidth: SCREEN_WIDTH, borderRadius: 0 }}
          isSwipeable
        >
          {/* Close button */}
          <View className="absolute top-4 right-4 z-10">
            <Pressable
              onPress={onClose}
              className="w-9 h-9 rounded-full bg-black/60 items-center justify-center"
              accessibilityLabel="إغلاق"
            >
              <Ionicons name="close" size={22} color="white" />
            </Pressable>
          </View>

          {/* Image */}
          <Pressable onPress={onClose} className="items-center justify-center">
            <Image
              source={{ uri }}
              style={{
                width: SCREEN_WIDTH - 32,
                height: SCREEN_HEIGHT * 0.7,
              }}
              contentFit="contain"
              accessibilityLabel={alt}
              transition={200}
            />
          </Pressable>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
