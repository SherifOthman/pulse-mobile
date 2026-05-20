import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import {
  Avatar,
  Button,
  Spinner,
  Text,
  useThemeColor,
} from "heroui-native";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMe } from "@/src/features/profile/profile-queries";
import { updateMe } from "@/src/features/profile/auth-api";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// ─── Validation schema ───────────────────────────────────────────────
const schema = z.object({
  fullName: z
    .string()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(60, "الاسم طويل جداً"),
});

type FormData = z.infer<typeof schema>;

// ─── Reusable field ──────────────────────────────────────────────────
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-1.5">
      <Text type="body-sm" weight="medium" align="end" className="text-foreground">
        {label}
      </Text>
      {children}
      {error && (
        <Text type="body-xs" className="text-danger text-right">
          {error}
        </Text>
      )}
    </View>
  );
}

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useMe();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);

  const [accent, muted, foreground, border, surface, fieldBg] = useThemeColor([
    "accent",
    "muted",
    "foreground",
    "border",
    "surface",
    "field",
  ]);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: { fullName: data?.fullName ?? "" },
  });

  // ─── Pick image ────────────────────────────────────────────────────
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
      setLocalImage(result.assets[0].uri);
    }
  };

  // ─── Submit ────────────────────────────────────────────────────────
  const onSubmit = async (values: FormData) => {
    setIsSaving(true);
    try {
      await updateMe({
        fullName: values.fullName,
        imageUri: localImage ?? undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      router.back();
    } catch {
      Alert.alert("خطأ", "فشل تحديث الملف الشخصي، حاول مرة أخرى");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Spinner />
      </View>
    );
  }

  const avatarUri = localImage ?? data?.imageUrl ?? undefined;
  const hasChanges = isDirty || localImage !== null;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View
        className="flex-row items-center px-5 pb-4 border-b border-border"
        style={{ paddingTop: insets.top + 12 }}
      >
        {/* Back button — right side for RTL */}
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-forward" size={20} color={foreground} />
        </Pressable>

        <View className="flex-1 items-center">
          <Text.Heading type="h5" weight="bold">
            تعديل الملف الشخصي
          </Text.Heading>
        </View>

        {/* Spacer to keep title centered */}
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 24,
          gap: 24,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar picker */}
        <View className="items-center gap-3">
          <View>
            <Avatar
              size="lg"
              style={{ width: 100, height: 100, borderRadius: 50 }}
            >
              {avatarUri ? (
                <Avatar.Image source={{ uri: avatarUri }} />
              ) : null}
              <Avatar.Fallback delayMs={200}>
                {data?.fullName?.charAt(0) ?? "؟"}
              </Avatar.Fallback>
            </Avatar>

            {/* Camera badge */}
            <Pressable
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
            </Pressable>
          </View>

          <Pressable onPress={pickImage}>
            <Text type="body-sm" className="text-accent" weight="medium">
              تغيير الصورة
            </Text>
          </Pressable>
        </View>

        {/* Form fields */}
        <View className="gap-5">
          {/* Full name */}
          <Field label="الاسم الكامل" error={errors.fullName?.message}>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="أدخل اسمك الكامل"
                  placeholderTextColor={muted}
                  textAlign="right"
                  style={{
                    backgroundColor: fieldBg,
                    borderWidth: 1,
                    borderColor: errors.fullName ? "#ef4444" : border,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 15,
                    color: foreground,
                    fontFamily: "Cairo",
                  }}
                />
              )}
            />
          </Field>

          {/* Email — read only */}
          <Field label="البريد الإلكتروني">
            <View
              style={{
                backgroundColor: fieldBg,
                borderWidth: 1,
                borderColor: border,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 8,
                opacity: 0.6,
              }}
            >
              <Text
                type="body"
                style={{ color: muted, fontFamily: "Cairo" }}
              >
                {data?.email}
              </Text>
              <Ionicons name="lock-closed-outline" size={16} color={muted} />
            </View>
          </Field>
        </View>

        {/* Save button at bottom */}
        {hasChanges && (
          <Button
            size="lg"
            variant="primary"
            isDisabled={isSaving}
            onPress={handleSubmit(onSubmit)}
            className="w-full mt-4"
          >
            {isSaving ? <Spinner /> : <Button.Label>حفظ</Button.Label>}
          </Button>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}