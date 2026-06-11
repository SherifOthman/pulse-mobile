import { NewsCard } from "@/src/features/news/components/news-card";
import { NewsCardSkeletonList } from "@/src/features/news/components/news-skeleton";
import { useNews } from "@/src/features/news/use-news";
import { useDebounce } from "@/src/useDebounce";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  SearchField,
  Separator,
  Spinner,
  Tabs,
  Typography,
} from "heroui-native";
import { useCallback, useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CATEGORIES = [
  { value: "all", label: "الكل" },
  { value: "طب", label: "طب" },
  { value: "أدوية", label: "أدوية" },
  { value: "تغذية", label: "تغذية" },
];

export default function News() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const category = activeCategory === "all" ? undefined : activeCategory;

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    isError,
  } = useNews({
    category,
    search: debouncedSearch || undefined,
    pageSize: 10,
  });

  const articles = data?.pages.flatMap((p) => p.items) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top + 16 }}
    >
      {/* ── Header ─────────────────────────────────── */}
      <View className="px-5 mb-3">
        <View className="flex-row-reverse items-center justify-between mb-4">
          <Typography.Heading type="h3" weight="bold">
            الأخبار
          </Typography.Heading>
          {isFetching && !isLoading && <Spinner size="sm" />}
        </View>

        {/* Search */}
        <SearchField
          value={searchTerm}
          onChange={setSearchTerm}
          className="mb-3"
        >
          <SearchField.Group>
            <SearchField.SearchIcon className="left-auto right-3" />
            <SearchField.Input
              className="pr-9 pl-12"
              style={{ fontFamily: "Cairo" }}
              textAlign="right"
              placeholder="ابحث في الأخبار..."
            />
            <SearchField.ClearButton className="right-auto left-3" />
          </SearchField.Group>
        </SearchField>

        {/* Category tabs — centered, not full width */}
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          variant="primary"
          className="self-center"
        >
          <Tabs.List className="self-center">
            <Tabs.ScrollView scrollAlign="start">
              <Tabs.Indicator />
              {CATEGORIES.map((cat) => (
                <Tabs.Trigger key={cat.value} value={cat.value}>
                  <Tabs.Label style={{ fontFamily: "Cairo" }}>
                    {cat.label}
                  </Tabs.Label>
                </Tabs.Trigger>
              ))}
            </Tabs.ScrollView>
          </Tabs.List>
        </Tabs>
      </View>

      <Separator />

      {/* ── Content ────────────────────────────────── */}
      {isLoading ? (
        <View className="px-5 mt-4">
          <NewsCardSkeletonList count={3} />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-5">
          <Ionicons name="cloud-offline-outline" size={48} color="#9ca3af" />
          <Typography.Paragraph color="muted" align="center" className="mt-3">
            تعذّر تحميل الأخبار
          </Typography.Paragraph>
          <View className="mt-2">
            <Typography.Paragraph
              type="body-sm"
              className="text-accent"
              onPress={() => refetch()}
            >
              إعادة المحاولة
            </Typography.Paragraph>
          </View>
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: insets.bottom + 110,
          }}
          ItemSeparatorComponent={() => <View className="h-4" />}
          renderItem={({ item }) => (
            <NewsCard
              article={item}
              onPress={() => router.push(`/(app)/news/${item.id}` as any)}
            />
          )}
          ListEmptyComponent={
            !isFetching ? (
              <View className="flex-1 items-center justify-center py-20">
                <Ionicons name="newspaper-outline" size={48} color="#9ca3af" />
                <Typography.Paragraph
                  color="muted"
                  align="center"
                  className="mt-3"
                >
                  لا توجد أخبار{searchTerm ? " تطابق بحثك" : " في هذا القسم"}
                </Typography.Paragraph>
              </View>
            ) : null
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-6 items-center">
                <Spinner />
              </View>
            ) : (
              <View className="h-4" />
            )
          }
        />
      )}
    </View>
  );
}
