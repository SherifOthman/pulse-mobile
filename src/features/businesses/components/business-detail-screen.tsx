import { nameInitial } from "@/src/arabic";
import { PageHeader } from "@/src/components/PageHeader";
import { ScreenWrapper } from "@/src/components/ScreenWrapper";
import { SectionBlock } from "@/src/components/SectionBlock";
import { ImagePreviewModal } from "@/src/components/ImagePreviewModal";
import { LocationCard } from "@/src/features/businesses/components/location-card";
import { ReviewCard } from "@/src/features/reviews/components/ReviewCard";
import { ReviewForm } from "@/src/features/reviews/components/ReviewForm";
import { useSubmitReview } from "@/src/features/reviews/hooks/use-submit-review";
import { getImageUrl } from "@/src/get-image-url";
import type { BranchDetail, BusinessDetails } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  Avatar,
  Button,
  Chip,
  Separator,
  Skeleton,
  Surface,
  Typography,
  useThemeColor,
} from "heroui-native";
import { useState } from "react";
import { Pressable, View } from "react-native";

type Props = {
  data: BusinessDetails | undefined;
  isLoading: boolean;
  queryKey: readonly [string, string];
  onToggleFavorite: () => void;
  headerExtra?: React.ReactNode;
  extraSections?: React.ReactNode;
};

export function BusinessDetailScreen({
  data,
  isLoading,
  queryKey,
  onToggleFavorite,
  headerExtra,
  extraSections,
}: Props) {
  const [dangerColor, mutedColor, accentColor] = useThemeColor([
    "danger",
    "muted",
    "accent",
  ]);
  const [reviewFormVisible, setReviewFormVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const submitReview = useSubmitReview(queryKey);

  const handleSubmitReview = async (rating: number, text: string) => {
    if (!data) return;
    await submitReview.mutateAsync({ businessId: data.id, rating, text });
  };

  // Build a synthetic "main branch" from the business's own data
  // so we can render it in the same component as real branches
  const mainBranch: BranchDetail | null = data
    ? {
        id: data.id,
        parentBusinessId: data.id,
        name: "الفرع الرئيسي",
        address: data.address,
        governorate: data.governorate,
        city: data.city,
        visitPrice: null,
        latitude: data.latitude,
        longitude: data.longitude,
        isOpen: data.isOpen,
        phoneNumbers: data.phoneNumbers,
        workingDays: data.workingDays,
      }
    : null;

  const allBranches: (BranchDetail & { isMain?: boolean })[] = data
    ? [
        ...(mainBranch ? [{ ...mainBranch, isMain: true }] : []),
        ...data.branches,
      ]
    : [];

  return (
    <View className="flex-1 bg-background">
      {/* PageHeader already shows the name — no need to repeat it below */}
      <PageHeader title={data?.name ?? ""} />

      <ScreenWrapper
        hasHeader
        isLoading={isLoading}
        isScrollable
        bottomPadding={40}
        loadingView={
          <View className="gap-4 pt-4">
            <Skeleton className="w-full h-52" />
            <View className="px-4 gap-3">
              <View className="items-end gap-2">
                <Skeleton className="w-2/3 h-6 rounded-xl" />
                <Skeleton className="w-1/2 h-4 rounded-xl" />
              </View>
              <Skeleton className="w-full h-20 rounded-2xl" />
            </View>
          </View>
        }
      >
        {data && (
          <>
            {/* ── Cover ─────────────────────────────────────── */}
            <View className="w-full relative">
              {data.coverImageUrl ? (
                <Pressable
                  onPress={() => setPreviewUri(getImageUrl(data.coverImageUrl)!)}
                  accessibilityLabel="عرض صورة الغلاف"
                >
                  <Image
                    source={{ uri: getImageUrl(data.coverImageUrl)! }}
                    style={{ width: "100%", height: 208 }}
                    contentFit="cover"
                    transition={200}
                  />
                </Pressable>
              ) : (
                <Image
                  source={require("../../../../assets/images/icon.png")}
                  style={{ width: "100%", height: 208 }}
                  contentFit="cover"
                  transition={200}
                />
              )}

              <View className="absolute top-3 left-3">
                <Button
                  variant="ghost"
                  size="sm"
                  isIconOnly
                  onPress={onToggleFavorite}
                  className={
                    data.isFavorite
                      ? "bg-danger/10 rounded-full"
                      : "bg-black/30 rounded-full"
                  }
                >
                  <Ionicons
                    name={data.isFavorite ? "heart" : "heart-outline"}
                    size={22}
                    color={data.isFavorite ? dangerColor : "#fff"}
                  />
                </Button>
              </View>
            </View>

            {/* ── Profile strip ─────────────────────────────── */}
            <View className="px-4 -mt-9">
              <View className="items-end">
                <Pressable
                  onPress={() =>
                    data.profileImageUrl
                      ? setPreviewUri(getImageUrl(data.profileImageUrl)!)
                      : setPreviewUri(null)
                  }
                  accessibilityLabel="عرض الصورة الشخصية"
                >
                  <Avatar size="lg" className="border-2 border-background">
                    {data.profileImageUrl ? (
                      <Avatar.Image
                        source={{ uri: getImageUrl(data.profileImageUrl)! }}
                      />
                    ) : (
                      <Avatar.Image
                        source={require("../../../../assets/images/icon.png")}
                      />
                    )}
                  </Avatar>
                </Pressable>
              </View>

              <View className="flex-row-reverse items-start justify-between pt-2">
                <View className="flex-1 items-end gap-0.5">
                  <Typography.Heading
                    type="h4"
                    weight="bold"
                    className="text-right"
                  >
                    {data.name}{" "}
                  </Typography.Heading>
                  <View>{headerExtra}</View>

                  <View className="flex-row-reverse items-center gap-1 mt-0.5">
                    <Ionicons
                      name="location-outline"
                      size={13}
                      color={mutedColor}
                    />
                    <Typography.Paragraph type="body-xs" color="muted">
                      {data.city}، {data.governorate}
                    </Typography.Paragraph>
                  </View>
                </View>

                <View className="items-center gap-0.5 pt-1">
                  <View className="flex-row-reverse items-center gap-1">
                    <Ionicons name="star" size={14} color="#f59e0b" />
                    <Typography.Paragraph
                      weight="bold"
                      className="text-amber-500"
                    >
                      {data.averageRating > 0
                        ? data.averageRating.toFixed(1)
                        : "—"}
                    </Typography.Paragraph>
                  </View>
                  <Typography.Paragraph type="body-xs" color="muted">
                    {data.totalRatings} تقييم
                  </Typography.Paragraph>
                </View>
              </View>
            </View>

            <Separator className="mx-4 mt-3" />

            {/* ── Body ──────────────────────────────────────── */}
            <View className="px-4 gap-6 pt-4">
              {/* Doctor-specific extras (visit price etc.) */}
              {extraSections && (
                <View className="flex-row-reverse flex-wrap gap-2">
                  {extraSections}
                </View>
              )}

              {/* Description */}
              {data.description && (
                <SectionBlock title="نبذة">
                  <Typography.Paragraph
                    color="muted"
                    className="text-right leading-7"
                  >
                    {data.description}
                  </Typography.Paragraph>
                </SectionBlock>
              )}

              {/* Services */}
              {data.services.length > 0 && (
                <SectionBlock title="الخدمات">
                  <View className="flex-row-reverse flex-wrap gap-2">
                    {data.services.map((s, i) => (
                      <Chip key={i} size="sm" variant="soft" color="default">
                        <Chip.Label>{s.name}</Chip.Label>
                      </Chip>
                    ))}
                  </View>
                </SectionBlock>
              )}

              {/* Locations & branches — main first, then additional */}
              {allBranches.length > 0 && (
                <SectionBlock
                  title={
                    data.branches.length > 0
                      ? `المواقع والفروع (${allBranches.length})`
                      : "الموقع والتواصل"
                  }
                >
                  <View className="gap-4">
                    {allBranches.map((branch) => (
                      <View key={branch.id} className="gap-2">
                        {/* Only show branch name if there are multiple locations */}
                        {data.branches.length > 0 && (
                          <Typography.Paragraph
                            weight="semibold"
                            className="text-right"
                          >
                            {branch.isMain ? "الفرع الرئيسي" : branch.name}
                          </Typography.Paragraph>
                        )}
                        <LocationCard
                          branch={branch}
                          accentColor={accentColor}
                          mutedColor={mutedColor}
                        />
                      </View>
                    ))}
                  </View>
                </SectionBlock>
              )}

              {/* Reviews */}
              {(data.testimonials.length > 0 || data.totalRatings > 0) && (
                <SectionBlock title={`التقييمات (${data.totalRatings})`}>
                  {data.testimonials.length > 0 && (
                    <Surface
                      variant="secondary"
                      className="rounded-2xl overflow-hidden"
                    >
                      {data.testimonials.map((t, i) => (
                        <View key={t.id}>
                          <ReviewCard review={t} />
                          {i < data.testimonials.length - 1 && (
                            <Separator className="mx-4" />
                          )}
                        </View>
                      ))}
                    </Surface>
                  )}
                  {data.totalRatings > 3 && (
                    <Pressable
                      className="flex-row-reverse items-center justify-center gap-1.5 py-1"
                      onPress={() =>
                        router.push({
                          pathname: "/(app)/reviews/[businessId]",
                          params: { businessId: data.id, name: data.name },
                        } as any)
                      }
                    >
                      <Ionicons
                        name="chevron-forward-outline"
                        size={14}
                        color={accentColor}
                      />
                      <Typography.Paragraph
                        type="body-sm"
                        className="text-accent"
                      >
                        عرض الكل ({data.totalRatings})
                      </Typography.Paragraph>
                    </Pressable>
                  )}
                </SectionBlock>
              )}

              {!data.hasUserReviewed && (
                <Button
                  variant="secondary"
                  className="w-full"
                  onPress={() => setReviewFormVisible(true)}
                >
                  <Ionicons name="star-outline" size={18} color={mutedColor} />
                  <Button.Label>أضف تقييمك</Button.Label>
                </Button>
              )}
            </View>
          </>
        )}

        <ReviewForm
          visible={reviewFormVisible}
          onClose={() => setReviewFormVisible(false)}
          onSubmit={handleSubmitReview}
        />
      </ScreenWrapper>

      {/* ── Image preview ── */}
      <ImagePreviewModal
        uri={previewUri}
        isOpen={!!previewUri}
        onClose={() => setPreviewUri(null)}
        alt={data?.name}
      />
    </View>
  );
}
