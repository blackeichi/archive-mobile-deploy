import { PostDetail } from "@/constants/types";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function getVisibilityLabel(visibility?: PostDetail["visibility"]) {
  switch (visibility) {
    case "public":
      return "공개";
    case "private":
      return "비공개";
    default:
      return "";
  }
}

const TopContents = ({ post }: { post: Partial<PostDetail> }) => {
  const visibilityLabel = getVisibilityLabel(post.visibility);
  const createdAt = formatDate(post.created_at);
  return (
    <>
      <View style={styles.header}>
        {post.category_name && (
          <Text style={styles.categoryName}>{post.category_name}</Text>
        )}
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.metaRow}>
          {!!visibilityLabel && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{visibilityLabel}</Text>
            </View>
          )}
          {!!createdAt && <Text style={styles.metaText}>작성 {createdAt}</Text>}
        </View>
      </View>
    </>
  );
};
export default memo(TopContents);

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4338CA",
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  metaText: {
    fontSize: 13,
    color: "darkgray",
  },
  categoryName: {
    fontSize: 12,
    color: "darkgray",
    fontWeight: "700",
  },
  bodyCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
  },
});
