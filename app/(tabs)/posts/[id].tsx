import MarkdownViewer from "@/components/MarkdownViewer";
import { PostItem } from "@/constants/types";
import { usePost } from "@/hooks/usePost";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

export default function PostDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const postId = Number(params.id);

  const { post, loading, error } = usePost(postId);
  const highlightMap = useMemo(
    () => ({
      "h1-0": "#FEF3C7",
      "p-0": "#DBEAFE",
      "p-2": "#FCE7F3",
      "li-1": "#DCFCE7",
    }),
    [],
  );
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="small" />
          <Text style={styles.stateText}>포스트를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <Text style={styles.errorTitle}>문제가 발생했어요</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <Text style={styles.errorTitle}>포스트가 없어요</Text>
          <Text style={styles.errorText}>
            삭제되었거나 불러올 수 없는 글입니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const visibilityLabel = getVisibilityLabel(post.visibility);
  const createdAt = formatDate(post.created_at);
  const updatedAt = formatDate(post.updated_at);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
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

        <View style={styles.bodyCard}>
          <MarkdownViewer
            content={post.content_md || ""}
            highlightMap={highlightMap}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
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
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#F9FAFB",
  },
  stateText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B7280",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
    textAlign: "center",
  },
});
