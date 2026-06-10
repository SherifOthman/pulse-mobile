import { Ionicons } from "@expo/vector-icons";
import { Card, Chip, PressableFeedback, Typography, useThemeColor } from "heroui-native";
import { Image } from "expo-image";
import { View, StyleSheet } from "react-native";
import type { NewsArticle } from "../news-api";
import { formatNewsDate } from "../format-date";

type Props = {
  article: NewsArticle;
  onPress?: () => void;
  className?: string;
};

export function NewsCardHorizontal({ article, onPress, className }: Props) {
  const [mutedColor] = useThemeColor(["muted"]);

  return (
    <PressableFeedback onPress={onPress} animation={false}>
      <PressableFeedback.Scale>
        <Card className={`w-72 ${className ?? ""}`}>
          {article.imageUrl ? (
            <Image
              source={{ uri: article.imageUrl }}
              style={styles.image}
              contentFit="cover"
              transition={200}
              placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
            />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="newspaper-outline" size={28} color={mutedColor} />
            </View>
          )}

          <Card.Body className="gap-1.5 p-3">
            <Chip size="sm" variant="soft" color="accent" className="self-end">
              <Chip.Label>{article.category}</Chip.Label>
            </Chip>
            <Typography.Paragraph
              weight="bold"
              className="text-right"
              numberOfLines={2}
            >
              {article.title}
            </Typography.Paragraph>
            <View className="flex-row-reverse items-center gap-1">
              <Ionicons name="time-outline" size={12} color={mutedColor} />
              <Typography.Paragraph type="body-xs" color="muted">
                {formatNewsDate(article.publishedAt)}
              </Typography.Paragraph>
            </View>
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
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholder: {
    width: "100%",
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.04)",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});
