import { Ionicons } from "@expo/vector-icons";
import {
  Button,
  SearchField,
  Separator,
  Spinner,
  Typography,
  useThemeColor,
} from "heroui-native";
import { useCallback, useState } from "react";
import { FlatList, View } from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { DoctorCard } from "../../features/doctors/components/doctor-card";
import { useDoctors } from "../../features/doctors/hooks/use-doctors";

export default function Doctors() {
  const foreground = useThemeColor("foreground");
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDoctors({ pageSize: 20 });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allItems = data?.pages.flatMap((p) => p.items) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <ScreenWrapper isLoading={isLoading} isScrollable={false} bottomPadding={0}>
      <FlatList
        data={allItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        renderItem={({ item }) => (
          <DoctorCard
            name={item.name}
            specialization={item.specialization}
            profileImageUrl={item.profileImageUrl}
            visitPrice={item.visitPrice}
            governorate={item.governorate}
            averageRating={item.averageRating}
            totalRatings={item.totalRatings}
            isOpen={item.isOpen}
            todaySchedule={item.todaySchedule}
            isFavorite={favorites.has(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            className="mt-4"
          />
        )}
        ListHeaderComponent={
          <View>
            <View className="flex-row-reverse items-center justify-between">
              <Typography.Heading type="h3">الاطباء</Typography.Heading>

              <Button variant="tertiary" size="sm" isIconOnly>
                <Ionicons name="filter-outline" color={foreground} size={24} />
              </Button>
            </View>

            <Separator className="mt-3" />

            <SearchField className="mt-4">
              <SearchField.Group>
                <SearchField.SearchIcon className="left-auto right-3" />
                <SearchField.Input
                  className="pr-9 pl-12"
                  style={{ fontFamily: "Cairo" }}
                  textAlign="right"
                  placeholder="بحث..."
                />
                <SearchField.ClearButton className="right-auto left-3" />
              </SearchField.Group>
            </SearchField>
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4 items-center">
              <Spinner />
            </View>
          ) : (
            <View className="h-6" />
          )
        }
      />
    </ScreenWrapper>
  );
}
