import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import {
  Button,
  FieldError,
  Input,
  Label,
  Skeleton,
  Text,
  TextField,
  useThemeColor,
} from "heroui-native";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMe } from "@/src/features/profile/profile-queries";
import { updateMe } from "@/src/features/profile/profile-api";
import { AvatarPicker } from "@/src/features/profile/components/avatar-picker";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const schema = z.object({
  fullName: z
    .string()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(60, "الاسم طويل جداً"),
});

type FormData = z.infer<typeof schema>;

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useMe();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);

  const [foreground] = useThemeColor(["foreground"]);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: { fullName: data?.fullName ?? "" },
  });

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
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="w-48 h-6 rounded-lg mt-4" />
      </View>
    );
  }

  const hasChanges = isDirty || localImage !== null;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        className="flex-row items-center px-5 pb-4 border-b border-border"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-forward" size={20} color={foreground} />
        </Button>

        <View className="flex-1 items-center">
          <Text.Heading type="h5" weight="bold">
            تعديل الملف الشخصي
          </Text.Heading>
        </View>

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
        <AvatarPicker
          avatarUri={localImage ?? data?.imageUrl ?? undefined}
          fallbackName={data?.fullName}
          onChangeImage={setLocalImage}
        />

        <View className="gap-5">
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField isInvalid={!!errors.fullName}>
                <Label>الاسم الكامل</Label>
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="أدخل اسمك الكامل"
                  textAlign="right"
                />
                {errors.fullName && (
                  <FieldError>{errors.fullName.message}</FieldError>
                )}
              </TextField>
            )}
          />

          <TextField isDisabled>
            <Label>البريد الإلكتروني</Label>
            <Input value={data?.email ?? ""} textAlign="right" />
          </TextField>
        </View>

        {hasChanges && (
          <Button
            size="lg"
            variant="primary"
            isDisabled={isSaving}
            onPress={handleSubmit(onSubmit)}
            className="w-full mt-4"
          >
            <Button.Label>حفظ</Button.Label>
          </Button>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
