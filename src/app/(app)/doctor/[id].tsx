import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Chip, Skeleton, Typography, useThemeColor } from "heroui-native";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PageHeader } from "@/src/components/PageHeader";
import { ScreenWrapper } from "@/src/components/ScreenWrapper";
import { BranchCard } from "@/src/features/doctors/components/branch-card";
import { DetailSection } from "@/src/features/doctors/components/detail-section";
import { DoctorDetailHeader } from "@/src/features/doctors/components/doctor-detail-header";
import { WorkingDayRow } from "@/src/features/doctors/components/working-day-row";
import { useDoctorDetails } from "@/src/features/doctors/hooks/use-doctor-details";
import { useToggleFavorite } from "@/src/features/favorites/hooks/use-favorites";

export default function DoctorDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useDoctorDetails(id);
  const toggleFav = useToggleFavorite();
  const [mutedColor] = useThemeColor(["muted"]);
  const insets = useSafeAreaInsets();

  return (
    <ScreenWrapper
      isScrollable={false}
      isLoading={isLoading}
      loadingView={
        <View className="gap-4">
          <Skeleton className="w-full h-32 rounded-xl" />
          <Skeleton className="w-2/3 h-6 rounded-lg" />
          <Skeleton className="w-1/2 h-4 rounded-lg" />
        </View>
      }
    >
      <PageHeader title={data?.name ?? ""} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, gap: 20 }}
      >
        {data && (
          <>
            <DoctorDetailHeader
              data={data}
              onToggleFavorite={() => toggleFav.mutate(data.id)}
            />

            {/* Quick info chips */}
            <View className="flex-row-reverse flex-wrap gap-2">
              {data.visitPrice != null && (
                <Chip size="sm" variant="secondary">
                  <Ionicons name="cash-outline" size={12} color={mutedColor} />
                  <Chip.Label>{data.visitPrice.toLocaleString("ar-EG")} ج.م</Chip.Label>
                </Chip>
              )}
              <Chip size="sm" variant="secondary">
                <Ionicons name="location-outline" size={12} color={mutedColor} />
                <Chip.Label>{data.city}، {data.governorate}</Chip.Label>
              </Chip>
            </View>

            {data.description && (
              <DetailSection title="نبذة">
                <Typography.Paragraph className="text-right leading-6">
                  {data.description}
                </Typography.Paragraph>
              </DetailSection>
            )}

            {data.workingDays.length > 0 && (
              <DetailSection title="مواعيد العمل">
                <View className="gap-2">
                  {data.workingDays.map((wd) => <WorkingDayRow key={wd.day} wd={wd} />)}
                </View>
              </DetailSection>
            )}

            {data.phoneNumbers.length > 0 && (
              <DetailSection title="للتواصل">
                <View className="gap-2">
                  {data.phoneNumbers.map((p, i) => (
                    <View key={i} className="flex-row-reverse items-center gap-2">
                      <Ionicons name="call-outline" size={16} color={mutedColor} />
                      <Typography.Paragraph>{p.number}</Typography.Paragraph>
                      {p.type && (
                        <Typography.Paragraph type="body-sm" color="muted">
                          ({p.type})
                        </Typography.Paragraph>
                      )}
                    </View>
                  ))}
                </View>
              </DetailSection>
            )}

            {data.address && (
              <DetailSection title="العنوان">
                <View className="flex-row-reverse items-center gap-2">
                  <Ionicons name="location-outline" size={16} color={mutedColor} />
                  <Typography.Paragraph className="flex-1 text-right">
                    {data.address}
                  </Typography.Paragraph>
                </View>
              </DetailSection>
            )}

            {data.branches.length > 0 && (
              <DetailSection title={`الفروع (${data.branches.length})`}>
                <View className="gap-3">
                  {data.branches.map((branch) => (
                    <BranchCard key={branch.id} branch={branch} />
                  ))}
                </View>
              </DetailSection>
            )}
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
