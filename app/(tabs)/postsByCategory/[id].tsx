import { PostListSkeleton } from "@/components/post/PostListSkeleton";
import type { CategoryNode, PostSummary } from "@/constants/types";
import { useCategories } from "@/hooks/useCategories";
import { useCategoryPosts } from "@/hooks/useCategoryPosts";
import { useAppTheme } from "@/providers/ThemeProvider";
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

function PostCard({
  post,
  theme,
}: {
  post: PostSummary;
  theme: ReturnType<typeof useAppTheme>["theme"];
}) {
  const styles = createStyles(theme);
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
          <Ionicons
            name="image-outline"
            size={28}
            color={theme.colors.textMuted}
          />
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
        ) : null}

        <View style={styles.cardFooter}>
          <View style={styles.authorRow}>
            <Ionicons
              name="person-circle-outline"
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.authorText}>{post.author_name}</Text>
          </View>

          <View style={styles.readMoreRow}>
            <Text style={styles.readMoreText}>읽어보기</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.text}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function CategoryPostsScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

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
        )}

        {postsLoading ? (
          <PostListSkeleton />
        ) : posts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons
              name="document-text-outline"
              size={28}
              color={theme.colors.textMuted}
            />
            <Text style={styles.emptyTitle}>아직 포스트가 없어요</Text>
            <Text style={styles.emptyDescription}>
              선택한 카테고리에는 아직 등록된 포스트가 없습니다.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} theme={theme} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>["theme"]) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 32,
    },
    headerBlock: {
      marginBottom: 20,
      gap: 6,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.colors.text,
    },
    headerDescription: {
      fontSize: 14,
      lineHeight: 22,
      color: theme.colors.textSecondary,
    },
    categoryList: {
      gap: 10,
      paddingRight: 8,
      marginBottom: 20,
    },
    categoryChip: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    categoryChipSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryChipText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text,
    },
    categoryChipTextSelected: {
      color: theme.colors.primaryContrast,
    },
    list: {
      gap: 16,
    },
    card: {
      overflow: "hidden",
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: theme.colors.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 3,
    },
    thumbnail: {
      width: "100%",
      height: 150,
      backgroundColor: theme.colors.surfaceSecondary,
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
      backgroundColor: theme.colors.surfaceSecondary,
    },
    metaBadgeText: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.text,
    },
    dateText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    cardTitle: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: "700",
      color: theme.colors.text,
    },
    cardSummary: {
      fontSize: 14,
      lineHeight: 22,
      color: theme.colors.textSecondary,
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
      color: theme.colors.textSecondary,
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
      color: theme.colors.text,
    },
    emptyCard: {
      borderRadius: 18,
      paddingVertical: 36,
      paddingHorizontal: 20,
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text,
    },
    emptyDescription: {
      fontSize: 14,
      lineHeight: 22,
      textAlign: "center",
      color: theme.colors.textSecondary,
    },
    centerBox: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
      backgroundColor: theme.colors.background,
    },
    errorTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 8,
    },
    errorText: {
      fontSize: 14,
      lineHeight: 22,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
  });
}
