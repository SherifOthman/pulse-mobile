import { DoctorCard } from "@/src/features/doctors/components/doctor-card";
import { useDoctors } from "@/src/features/doctors/hooks/use-doctors";
import { router } from "expo-router";
import { Card, Separator, Skeleton } from "heroui-native";
import { FlatList, View } from "react-native";
import { SectionHeader } from "./section-header";

function DoctorStripSkeleton() {
  return (
    <Card className="w-64 p-3 gap-3">
      <View className="flex-row-reverse gap-3 items-center">
        <Skeleton className="w-14 h-14 rounded-full" />
        <View className="flex-1 gap-2">
          <Skeleton className="w-full h-4 rounded-md" />
          <Skeleton className="w-3/4 h-3 rounded-md" />
          <Skeleton className="w-1/2 h-3 rounded-md" />
        </View>
      </View>
      <Separator />
      <View className="flex-row-reverse justify-between pt-2">
        <Skeleton className="w-24 h-3 rounded-md" />
        <Skeleton className="w-16 h-3 rounded-md" />
      </View>
    </Card>
  );
}

export function FeaturedDoctorsStrip() {
  const { data, isLoading } = useDoctors({ pageSize: 8 });
  const doctors = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <View>
      <SectionHeader
        title="الأطباء المتاحون "
        onSeeAll={() => router.push("/(app)/(tabs)/doctors" as any)}
      />
      {isLoading ? (
        <FlatList
          data={[1, 2, 3]}
          horizontal
          inverted
          showsHorizontalScrollIndicator={false}
          keyExtractor={(i) => String(i)}
          ItemSeparatorComponent={() => <View className="w-3" />}
          renderItem={() => <DoctorStripSkeleton />}
          contentContainerStyle={{ paddingHorizontal: 0 }}
        />
      ) : (
        <FlatList
          data={doctors}
          horizontal
          inverted
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className="w-3" />}
          renderItem={({ item }) => (
            <DoctorCard
              doctor={item}
              onPress={() => router.push(`/(app)/doctor/${item.id}` as any)}
              className="w-64"
            />
          )}
          ListEmptyComponent={<View />}
          contentContainerStyle={{ paddingHorizontal: 0 }}
        />
      )}
    </View>
  );
}
