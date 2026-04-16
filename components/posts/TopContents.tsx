import { PostItem } from "@/constants/types";
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

function getVisibilityLabel(visibility?: PostItem["visibility"]) {
  switch (visibility) {
    case "public":
      return "공개";
    case "private":
      return "비공개";
    default:
      return "";
  }
}

const TopContents = ({ post }: { post: PostItem }) => {
  const visibilityLabel = getVisibilityLabel(post.visibility);
  const createdAt = formatDate(post.created_at);
  const updatedAt = formatDate(post.updated_at);
  return (
    <>
      <View style={styles.header}>
        {!!visibilityLabel && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{visibilityLabel}</Text>
          </View>
        )}

        <Text style={styles.title}>{post.title}</Text>

        {(createdAt || updatedAt) && (
          <View style={styles.metaRow}>
            {!!createdAt && (
              <Text style={styles.metaText}>작성 {createdAt}</Text>
            )}
            {!!updatedAt && updatedAt !== createdAt && (
              <Text style={styles.metaText}>수정 {updatedAt}</Text>
            )}
          </View>
        )}
      </View>

      {!!post.summary?.trim() && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>요약</Text>
          <Text style={styles.summaryText}>{post.summary.trim()}</Text>
        </View>
      )}
    </>
  );
};
export default memo(TopContents);

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4338CA",
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  metaText: {
    fontSize: 13,
    color: "#6B7280",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#374151",
  },
  bodyCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
  },
});
