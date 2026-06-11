import { ScreenWrapper } from "@/src/components/ScreenWrapper";
import { LocationFilterSheet, type LocationFilter } from "@/src/features/businesses/components/location-filter-sheet";
import { DoctorsEmptyState } from "@/src/features/doctors/components/doctors-empty-state";
import { PharmacyCard } from "@/src/features/pharmacies/pharmacy-card";
import { usePharmacies } from "@/src/features/pharmacies/hooks/use-pharmacies";
import { useDebounce } from "@/src/useDebounce";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, SearchField, Separator, Spinner, Typography, useThemeColor } from "heroui-native";
import { useCallback, useState } from "react";
import { FlatList, View } from "react-native";

const EMPTY_FILTER: LocationFilter = { governorateId: undefined, cityId: undefined };

export default function Pharmacies() {
  const foreground = useThemeColor("foreground");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<LocationFilter>(EMPTY_FILTER);

  const isFiltered = !!(filters.governorateId || filters.cityId || debouncedSearch);

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePharmacies({ name: debouncedSearch, governorateId: filters.governorateId, cityId: filters.cityId });

  const allItems = data?.pages.flatMap((p) => p.items) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <ScreenWrapper isLoading={isLoading} isScrollable={false} bottomPadding={0}>
      <View className="flex-1 px-5">
        <View className="flex-row-reverse items-center justify-between">
          <Typography.Heading type="h3">الصيدليات</Typography.Heading>
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

        <SearchField className="mt-3 mb-2" value={searchTerm} onChange={setSearchTerm}>
          <SearchField.Group>
            <SearchField.SearchIcon className="left-auto right-3" />
            <SearchField.Input className="pr-9 pl-12" style={{ fontFamily: "Cairo" }} textAlign="right" placeholder="بحث..." />
            <SearchField.ClearButton className="right-auto left-3" />
          </SearchField.Group>
        </SearchField>

        <FlatList
          data={allItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          ItemSeparatorComponent={() => <View className="h-4" />}
          renderItem={({ item }) => (
            <PharmacyCard pharmacy={item} onPress={() => router.push(`/(app)/pharmacy/${item.id}` as any)} />
          )}
          ListEmptyComponent={isFetching ? null : <DoctorsEmptyState isFiltered={isFiltered} onClearFilter={() => { setFilters(EMPTY_FILTER); setSearchTerm(""); }} />}
          ListFooterComponent={isFetchingNextPage ? <View className="py-4 items-center"><Spinner /></View> : <View className="h-6" />}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>

      <LocationFilterSheet
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filters}
        onApply={setFilters}
        businessType={2}
      />
    </ScreenWrapper>
  );
}
