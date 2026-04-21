import { PostListSkeleton } from "@/components/post/PostListSkeleton";
import type { CategoryNode, PostSummary } from "@/constants/types";
import { useCategories } from "@/hooks/useCategories";
import { useCategoryPosts } from "@/hooks/useCategoryPosts";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatDate(dateString?: string) {
  if (!dateString) return "";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

function getVisibilityLabel(visibility?: string) {
  return visibility === "private" ? "비공개" : "공개";
}

function flattenCategories(categories: CategoryNode[]): CategoryNode[] {
  const result: CategoryNode[] = [];

  const traverse = (nodes: CategoryNode[]) => {
    for (const node of nodes) {
      result.push(node);
      if (node.children?.length) {
        traverse(node.children);
      }
    }
  };

  traverse(categories);
  return result;
}

function PostCard({ post }: { post: PostSummary }) {
  const visibilityLabel = getVisibilityLabel(post.visibility);

  const handlePress = () => {
    if (post.authorized) {
      router.push({
        pathname: "/post/[id]",
        params: {
          id: String(post.id),
          title: post.title,
          visibility: post.visibility,
          created_at: post.created_at,
        },
      });
      return;
    }

    Alert.alert("접근 권한 없음", "이 포스트에 접근할 권한이 없습니다.");
  };

  return (
    <Pressable onPress={handlePress} style={styles.card}>
      {post.thumbnail_url ? (
        <Image source={{ uri: post.thumbnail_url }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailFallback]}>
          <Ionicons name="image-outline" size={28} color="#9CA3AF" />
        </View>
      )}

      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <View style={styles.metaBadge}>
            <Text style={styles.metaBadgeText}>{visibilityLabel}</Text>
          </View>
          <Text style={styles.dateText}>{formatDate(post.created_at)}</Text>
        </View>

        <Text style={styles.cardTitle} numberOfLines={2}>
          {post.title}
        </Text>

        {post.summary ? (
          <Text style={styles.cardSummary} numberOfLines={2}>
            {post.summary}
          </Text>
        ) : (
          <Text style={styles.cardSummaryMuted}>
            요약이 아직 등록되지 않았어요.
          </Text>
        )}

        <View style={styles.cardFooter}>
          <View style={styles.authorRow}>
            <Ionicons name="person-circle-outline" size={16} color="#6B7280" />
            <Text style={styles.authorText}>{post.author_name}</Text>
          </View>

          <View style={styles.readMoreRow}>
            <Text style={styles.readMoreText}>읽어보기</Text>
            <Ionicons name="chevron-forward" size={16} color="#111827" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function CategoryPostsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const initialCategoryId = Number(params.id);

  const [selectedCategoryId, setSelectedCategoryId] =
    useState(initialCategoryId);

  useEffect(() => {
    setSelectedCategoryId(initialCategoryId);
  }, [initialCategoryId]);

  const {
    posts,
    loading: postsLoading,
    error: postsError,
  } = useCategoryPosts(selectedCategoryId);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const categoryList = useMemo(() => {
    return flattenCategories(categories);
  }, [categories]);

  const selectedCategory = useMemo(() => {
    return categoryList.find((category) => category.id === selectedCategoryId);
  }, [categoryList, selectedCategoryId]);

  if (postsError || categoriesError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <Text style={styles.errorTitle}>😢 문제가 발생했어요</Text>
          <Text style={styles.errorText}>{postsError || categoriesError}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBadge}>
          <Ionicons name="albums-outline" size={16} color="#111827" />
          <Text style={styles.headerBadgeText}>카테고리 포스트</Text>
        </View>

        <View style={styles.headerBlock}>
          <Text style={styles.headerTitle}>포스트 목록</Text>
          <Text style={styles.headerDescription}>
            {selectedCategory
              ? `${selectedCategory.name} 카테고리의 포스트를 보고 있어요.`
              : "카테고리를 선택해 포스트를 확인해보세요."}
          </Text>
        </View>

        {categoriesLoading ? (
          <PostListSkeleton />
        ) : (
          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>카테고리</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            >
              {categoryList.map((category) => {
                const isSelected = category.id === selectedCategoryId;

                return (
                  <Pressable
                    key={category.id}
                    onPress={() => setSelectedCategoryId(category.id)}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        isSelected && styles.categoryChipTextSelected,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        {postsLoading ? (
          <PostListSkeleton />
        ) : posts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="document-text-outline" size={28} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>아직 포스트가 없어요</Text>
            <Text style={styles.emptyDescription}>
              선택한 카테고리에는 아직 등록된 포스트가 없습니다.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    marginBottom: 14,
  },
  headerBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  headerBlock: {
    marginBottom: 20,
    gap: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  headerDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
  },
  categorySection: {
    marginBottom: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  categoryList: {
    gap: 10,
    paddingRight: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryChipSelected: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  categoryChipTextSelected: {
    color: "#FFFFFF",
  },
  list: {
    gap: 16,
  },
  card: {
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#111827",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  thumbnail: {
    width: "100%",
    height: 180,
    backgroundColor: "#E5E7EB",
  },
  thumbnailFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: 16,
    gap: 12,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  metaBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  metaBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  dateText: {
    fontSize: 12,
    color: "#6B7280",
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
    color: "#111827",
  },
  cardSummary: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4B5563",
  },
  cardSummaryMuted: {
    fontSize: 14,
    lineHeight: 22,
    color: "#9CA3AF",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  authorText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  readMoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  emptyCard: {
    borderRadius: 18,
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  emptyDescription: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    color: "#6B7280",
  },
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#F9FAFB",
  },
  errorTitle: {
    fontSize: 20,
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
