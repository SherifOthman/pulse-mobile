import { ScreenWrapper } from "@/src/components/ScreenWrapper";
import { DoctorCard } from "@/src/features/doctors/components/doctor-card";
import { DoctorsEmptyState } from "@/src/features/doctors/components/doctors-empty-state";
import {
  FilterBottomSheet,
  type FilterState,
} from "@/src/features/doctors/components/filter-bottom-sheet";
import { SortPills } from "@/src/features/doctors/components/sort-pills";
import { useDoctors } from "@/src/features/doctors/hooks/use-doctors";
import { useDebounce } from "@/src/useDebounce";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

const EMPTY_FILTERS: FilterState = {
  governorateId: undefined,
  cityId: undefined,
  specializationId: undefined,
  gender: undefined,
};

const hasAnyFilter = (f: FilterState, search: string) =>
  !!(
    f.governorateId ||
    f.cityId ||
    f.specializationId ||
    f.gender !== undefined ||
    search
  );

export default function Doctors() {
  const foreground = useThemeColor("foreground");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<string>("asc");

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDoctors({
    name: debouncedSearch,
    governorateId: filters.governorateId,
    cityId: filters.cityId,
    specializationId: filters.specializationId,
    gender: filters.gender,
    sortBy,
    sortDirection,
  });

  const allItems = data?.pages.flatMap((p) => p.items) ?? [];
  const isFiltered = hasAnyFilter(filters, debouncedSearch);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleClearFilter = () => {
    setFilters(EMPTY_FILTERS);
    setSearchTerm("");
  };

  return (
    <ScreenWrapper isLoading={isLoading} isScrollable={false} bottomPadding={0}>
      <View className="flex-1 px-5">
        {/* Header */}
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

        {/* Search */}
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

        {/* List */}
        <FlatList
          data={allItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          ListHeaderComponent={
            <View className="pb-2">
              {/* Sort pills */}
              <SortPills
                sortBy={sortBy}
                sortDirection={sortDirection}
                onChange={(sb, sd) => {
                  setSortBy(sb);
                  setSortDirection(sd);
                }}
              />

              {/* Loading indicator for background fetches (sort/filter changes) */}
              {isFetching && !isFetchingNextPage && data && (
                <View className="py-1 items-center">
                  <Spinner />
                </View>
              )}
            </View>
          }
          ItemSeparatorComponent={() => <View className="h-4" />}
          renderItem={({ item }) => (
            <DoctorCard
              doctor={item}
              onPress={() => router.push(`/(app)/doctor/${item.id}` as any)}
            />
          )}
          ListEmptyComponent={
            isFetching ? null : (
              <DoctorsEmptyState
                isFiltered={isFiltered}
                onClearFilter={handleClearFilter}
              />
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
          contentContainerStyle={{
            paddingTop: 8,
            paddingBottom: 16,
            flexGrow: 1,
          }}
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
