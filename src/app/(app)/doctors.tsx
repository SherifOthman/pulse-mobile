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
import { FilterBottomSheet, type FilterState } from "../../features/doctors/components/filters/filter-bottom-sheet";
import { useDoctors } from "../../features/doctors/hooks/use-doctors";

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
          <Button variant="tertiary" size="sm" isIconOnly onPress={() => setIsFilterOpen(true)}>
            <Ionicons name="filter-outline" color={foreground} size={24} />
          </Button>
        </View>

        <Separator className="mt-3" />

        <SearchField className="mt-3 mb-2" value={searchTerm} onChange={setSearchTerm}>
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
              isFavorite={false}
              onToggleFavorite={() => {}}
              className="mt-4"
            />
          )}
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
