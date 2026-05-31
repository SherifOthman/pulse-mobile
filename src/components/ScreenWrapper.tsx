import type { ReactNode } from "react";
import { Spinner, Typography, useThemeColor } from "heroui-native";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  isError?: boolean;
  isScrollable?: boolean;
  isTabPage?: boolean;
  loadingView?: ReactNode;
  emptyView?: ReactNode;
  errorView?: ReactNode;
  className?: string;
  bottomPadding?: number;
};

export function ScreenWrapper({
  children,
  isLoading,
  isEmpty,
  isError,
  isScrollable = true,
  isTabPage = false,
  loadingView,
  emptyView,
  errorView,
  className = "",
  bottomPadding,
}: Props) {
  const insets = useSafeAreaInsets();
  const [muted] = useThemeColor(["muted"]);

  const topPadding = insets.top + (isTabPage ? 16 : 12);
  const bottomPaddingVal = bottomPadding ?? (isTabPage ? insets.bottom + 100 : insets.bottom + 40);

  const stateView = isLoading
    ? (loadingView ?? (
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      ))
    : isError
      ? (errorView ?? (
          <View className="flex-1 items-center justify-center px-5">
            <Typography.Paragraph color="muted" align="center">
              حدث خطأ ما
            </Typography.Paragraph>
          </View>
        ))
      : isEmpty
        ? (emptyView ?? (
            <View className="flex-1 items-center justify-center px-5">
              <Typography.Paragraph color="muted" align="center">
                لا توجد بيانات
              </Typography.Paragraph>
            </View>
          ))
        : null;

  const content = stateView ?? children;

  if (!isScrollable) {
    return (
      <View
        className={`flex-1 bg-background px-5 ${className}`}
        style={{ paddingTop: topPadding, paddingBottom: bottomPaddingVal }}
      >
        {content}
      </View>
    );
  }

  return (
    <ScrollView
      className={`flex-1 bg-background px-5 ${className}`}
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: topPadding,
        paddingBottom: bottomPaddingVal,
      }}
      showsVerticalScrollIndicator={false}
    >
      {content}
    </ScrollView>
  );
}
