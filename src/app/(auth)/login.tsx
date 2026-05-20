import { useGoogleLogin } from "@/src/features/auth/use-google-login";
import { Button, Spinner, Text, useThemeColor } from "heroui-native";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Login() {
  const insets = useSafeAreaInsets();
  const { signIn, isLoading, error } = useGoogleLogin();
  const [accent, accentForeground] = useThemeColor(["accent", "accent-foreground"]);

  return (
    <View
      className="bg-background flex-1"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Top section — brand + illustration */}
      <View className="flex-1 items-center justify-center px-8 gap-6">
        {/* Logo / brand mark */}
        <View className="items-center gap-2">
          <View
            className="w-20 h-20 rounded-3xl bg-accent items-center justify-center"
            style={{ shadowColor: accent, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 12 }}
          >
            <Text style={{ fontSize: 40 }}>🩺</Text>
          </View>
          <Text.Heading
            type="h1"
            weight="bold"
            align="center"
            className="text-foreground mt-2"
          >
            نبض
          </Text.Heading>
          <Text.Paragraph
            type="body-sm"
            color="muted"
            align="center"
          >
            Pulse
          </Text.Paragraph>
        </View>

        {/* Feature highlights */}
        <View className="gap-3 w-full mt-4">
          {[
            { icon: "👨‍⚕️", text: "أطباء, صيدليات, معامل وأشعة" },
            { icon: "⏰", text: "مواعيد العمل وأوقات الزيارة" },
            { icon: "⭐", text: "تقييمات وتعليقات المرضى" },
          ].map((item, i) => (
            <View
              key={i}
              className="flex-row-reverse items-center gap-3 bg-surface-secondary rounded-2xl px-4 py-3"
            >
              <Text style={{ fontSize: 22 }}>{item.icon}</Text>
              <Text.Paragraph type="body-sm" weight="medium" align="end" className="flex-1">
                {item.text}
              </Text.Paragraph>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom section — CTA */}
      <View className="px-6 pb-8 gap-4">
        {/* Error */}
        {error && (
          <View className="bg-danger/10 rounded-2xl px-4 py-3">
            <Text.Paragraph type="body-sm" align="center" className="text-danger">
              {error}
            </Text.Paragraph>
          </View>
        )}

        {/* Google sign-in button */}
        <Button
          variant="primary"
          size="lg"
          isDisabled={isLoading}
          onPress={signIn}
          className="w-full"
          feedbackVariant="scale-ripple"
        >
          {isLoading ? (
            <Spinner color={accentForeground} />
          ) : (
            <>
              <Image
                source={require("@/assets/icons/google-icon.png")}
                style={{ width: 22, height: 22 }}
                resizeMode="contain"
              />
              <Button.Label className="font-bold">
                تسجيل الدخول بجوجل
              </Button.Label>
            </>
          )}
        </Button>

        {/* Terms */}
        <Text.Paragraph type="body-xs" color="muted" align="center">
          بالمتابعة، أنت توافق على شروط الاستخدام وسياسة الخصوصية
        </Text.Paragraph>
      </View>
    </View>
  );
}