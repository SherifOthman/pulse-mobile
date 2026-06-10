import { Ionicons } from "@expo/vector-icons";
import { Card, Chip, PressableFeedback, Separator, Surface, Typography, useThemeColor } from "heroui-native";
import { Image } from "expo-image";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import type { NewsArticle } from "../news-api";
import { formatNewsDate } from "../format-date";

type Props = {
  article: NewsArticle;
  onPress?: () => void;
  className?: string;
};

export function NewsCard({ article, onPress, className }: Props) {
  const [mutedColor] = useThemeColor(["muted"]);
  const [imageFailed, setImageFailed] = useState(false);

  const showImage = article.imageUrl && !imageFailed;

  return (
    <PressableFeedback onPress={onPress} animation={false}>
      <PressableFeedback.Scale>
        <Card className={className}>
          {showImage ? (
            <Image
              source={{ uri: article.imageUrl! }}
              style={styles.image}
              contentFit="cover"
              transition={200}
              onError={() => setImageFailed(true)}
              placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
            />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="newspaper-outline" size={36} color={mutedColor} />
            </View>
          )}

          <Card.Body className="gap-2.5 p-4">
            {/* Category row */}
            <Surface variant="transparent" className="flex-row-reverse items-center justify-between">
              <Chip size="sm" variant="soft" color="accent">
                <Chip.Label>{article.category}</Chip.Label>
              </Chip>
              {article.isFeatured && (
                <Chip size="sm" variant="soft" color="warning">
                  <Ionicons name="star" size={11} color="#d97706" />
                  <Chip.Label>مميز</Chip.Label>
                </Chip>
              )}
            </Surface>

            <Typography.Heading
              type="h5"
              weight="bold"
              className="text-right leading-6"
              numberOfLines={2}
            >
              {article.title}
            </Typography.Heading>

            <Typography.Paragraph
              type="body-sm"
              color="muted"
              className="text-right"
              numberOfLines={3}
            >
              {article.summary}
            </Typography.Paragraph>

            <Separator />

            {/* Footer */}
            <Surface variant="transparent" className="flex-row-reverse items-center justify-between pt-1">
              <Surface variant="transparent" className="flex-row-reverse items-center gap-1">
                <Ionicons name="time-outline" size={13} color={mutedColor} />
                <Typography.Paragraph type="body-xs" color="muted">
                  {formatNewsDate(article.publishedAt)}
                </Typography.Paragraph>
              </Surface>
              {article.author ? (
                <Surface variant="transparent" className="flex-row-reverse items-center gap-1">
                  <Ionicons name="person-outline" size={13} color={mutedColor} />
                  <Typography.Paragraph type="body-xs" color="muted" numberOfLines={1} className="max-w-32">
                    {article.author}
                  </Typography.Paragraph>
                </Surface>
              ) : null}
            </Surface>
          </Card.Body>
        </Card>
      </PressableFeedback.Scale>
      <PressableFeedback.Ripple />
    </PressableFeedback>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 185,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  placeholder: {
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.04)",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
});
