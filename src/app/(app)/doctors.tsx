import { useDebunce } from "@/src/hooks/useDebunce";
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
import { FlatList, RefreshControl, View } from "react-native";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { DoctorCard } from "../../features/doctors/components/doctor-card";
import {
  FilterBottomSheet,
  type FilterState,
} from "../../features/doctors/components/filter-bottom-sheet";
import { useDoctors } from "../../features/doctors/hooks/use-doctors";
import { useFavorites, useToggleFavorite } from "../../features/favorites/hooks/use-favorites";

const hasActiveFilter = (filters: FilterState, search: string) =>
  !!(filters.governorateId || filters.cityId || filters.specializationId || filters.gender !== undefined || search);

export default function Doctors() {
  const foreground = useThemeColor("foreground");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebunce(searchTerm, 300);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    governorateId: undefined,
    cityId: undefined,
    specializationId: undefined,
    gender: undefined,
  });
  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useDoctors({
    name: debouncedSearchTerm,
    governorateId: filters.governorateId,
    cityId: filters.cityId,
    specializationId: filters.specializationId,
    gender: filters.gender,
  });

  const allItems = data?.pages.flatMap((p) => p.items) ?? [];
  const isFiltered = hasActiveFilter(filters, debouncedSearchTerm);

  const { data: favData } = useFavorites();
  const toggleFav = useToggleFavorite();
  const favSet = new Set(favData?.favorites?.map((f) => f.id) ?? []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <ScreenWrapper isLoading={isLoading} isScrollable={false} bottomPadding={0}>
      <View className="flex-1">
        <View className="flex-row-reverse items-center justify-between">
          <Typography.Heading type="h3">الاطباء</Typography.Heading>
          <Button
            variant={isFiltered ? "secondary" : "tertiary"}
            size="sm"
            isIconOnly
            onPress={() => setIsFilterOpen(true)}
          >
            <Ionicons name="filter-outline" color={foreground} size={24} />
          </Button>
        </View>

        <Separator className="mt-3" />

        <SearchField
          className="mt-3 mb-2"
          value={searchTerm}
          onChange={setSearchTerm}
        >
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

        <FlatList
          data={allItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          renderItem={({ item }) => (
            <DoctorCard
              doctor={item}
              isFavorite={favSet.has(item.id)}
              onToggleFavorite={() => toggleFav.mutate(item.id)}
              className="mt-4"
            />
          )}
          ListEmptyComponent={
            // Don't flash empty state while a new query is in-flight
            isFetching ? null : (
              <View className="flex-1 items-center justify-center pt-20 gap-3">
                <Ionicons name="search-outline" size={52} color="#888" />
                <Typography.Paragraph weight="semibold">
                  لا توجد نتائج
                </Typography.Paragraph>
                <Typography.Paragraph type="body-sm" color="muted" className="text-center px-8">
                  {isFiltered
                    ? "لم يتم العثور على أطباء بهذه المعايير. جرب تغيير الفلتر."
                    : "لا يوجد أطباء متاحون حالياً."}
                </Typography.Paragraph>
                {isFiltered && (
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => {
                      setFilters({ governorateId: undefined, cityId: undefined, specializationId: undefined, gender: undefined });
                      setSearchTerm("");
                    }}
                  >
                    إلغاء الفلتر
                  </Button>
                )}
              </View>
            )
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
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>

      <FilterBottomSheet
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filters}
        onApply={setFilters}
      />
    </ScreenWrapper>
  );
}
