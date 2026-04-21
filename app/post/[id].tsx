import CustomScrollView from "@/components/common/CustomScrollView";
import MarkdownViewer from "@/components/MarkdownViewer";
import { MarkdownViewerSkeleton } from "@/components/MarkdownViewer/MarkdownViewerSkeleton";
import TopContents from "@/components/post/TopContents";
import type { PostDetail } from "@/constants/types";
import { useBookmark } from "@/hooks/useBookmark";
import {
  useDeleteHighlights,
  useGetHighlights,
  useSaveHighlights,
} from "@/hooks/useHighlights";
import { usePost } from "@/hooks/usePost";
import { useAppTheme } from "@/providers/ThemeProvider";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostDetailScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    title?: string;
    visibility?: string;
    created_at?: string;
  }>();
  const postId = Number(params.id);

  const previewPost: Partial<PostDetail> = {
    title: params.title,
    visibility: params.visibility as PostDetail["visibility"] | undefined,
    created_at: params.created_at,
  };

  const { post, loading, error } = usePost(postId);

  const { highLights, setHighLights } = useGetHighlights(postId);

  const {
    isChanged,
    setIsChanged,
    confirmSave,
    loading: saveLoading,
  } = useSaveHighlights(postId, highLights);

  const { confirmDelete } = useDeleteHighlights(postId, () => {
    setHighLights({});
    setIsChanged(false);
  });

  const {
    handleBookmarkPress,
    hasBookmark,
    scrollRef,
    currentScrollY,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    handleRemoveBookmark,
  } = useBookmark({ loading, postId });

  const hasHighlights = Object.keys(highLights).length > 0;

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <Text style={styles.errorTitle}>😢 문제가 발생했어요</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!loading && !post) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <Text style={styles.errorTitle}>🚧 포스트가 없어요</Text>
          <Text style={styles.errorText}>
            삭제되었거나 불러올 수 없는 글입니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.actionRow}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>

        <View style={styles.actionButtons}>
          {!loading && hasHighlights && (
            <Pressable style={styles.iconButton} onPress={confirmDelete}>
              <MaterialIcons
                name="delete-sweep"
                size={22}
                color={theme.colors.text}
              />
            </Pressable>
          )}
          {!loading && isChanged && (
            <Pressable style={styles.iconButton} onPress={confirmSave}>
              {saveLoading ? (
                <Feather name="loader" size={20} color={theme.colors.text} />
              ) : (
                <Feather name="save" size={20} color={theme.colors.text} />
              )}
            </Pressable>
          )}
          {!loading && (
            <Pressable style={styles.iconButton} onPress={handleBookmarkPress}>
              {hasBookmark ? (
                <FontAwesome
                  name="bookmark"
                  size={18}
                  color={theme.colors.text}
                />
              ) : (
                <FontAwesome
                  name="bookmark-o"
                  size={18}
                  color={theme.colors.text}
                />
              )}
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.page}>
        <CustomScrollView
          ref={scrollRef}
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          trackTop={54}
          trackBottom={12}
          trackRight={6}
          trackWidth={4}
          onScroll={(e) => {
            currentScrollY.current = e.nativeEvent.contentOffset.y;
          }}
        >
          <TopContents post={loading ? previewPost : post!} />
          {loading ? (
            <MarkdownViewerSkeleton />
          ) : (
            <MarkdownViewer
              content={post!.content_md || ""}
              highlightMap={highLights}
              setHighLights={setHighLights}
              setIsChanged={setIsChanged}
            />
          )}
        </CustomScrollView>
      </View>

      <Modal
        transparent
        visible={bookmarkModalVisible}
        animationType="fade"
        onRequestClose={() => setBookmarkModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setBookmarkModalVisible(false)}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>📌 책갈피</Text>
            <Text style={styles.modalMessage}>
              책갈피로 이동이 완료되었습니다.{"\n"}책갈피를 제거하시겠습니까?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setBookmarkModalVisible(false)}
              >
                <Text style={styles.modalButtonCancelText}>유지</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleRemoveBookmark}
              >
                <Text style={styles.modalButtonConfirmText}>제거</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>["theme"]) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      position: "relative",
      backgroundColor: theme.colors.background,
    },
    page: {
      flex: 1,
      paddingTop: 42,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 32,
      paddingRight: 22,
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
    centerBox: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
      backgroundColor: theme.colors.background,
    },
    backButtonText: {
      fontSize: 22,
      fontWeight: "600",
      color: theme.colors.text,
    },
    actionRow: {
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 1000,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingTop: 32,
      paddingBottom: 4,
    },
    actionButtons: {
      flexDirection: "row",
      gap: 10,
    },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surfaceSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.45)",
      alignItems: "center",
      justifyContent: "center",
    },
    modalBox: {
      width: 300,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 24,
      alignItems: "center",
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    modalTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 10,
    },
    modalMessage: {
      fontSize: 14,
      lineHeight: 22,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: "row",
      gap: 10,
    },
    modalButton: {
      flex: 1,
      height: 40,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    modalButtonCancel: {
      backgroundColor: theme.colors.surfaceSecondary,
    },
    modalButtonCancelText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    modalButtonConfirm: {
      backgroundColor: theme.colors.danger,
    },
    modalButtonConfirmText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#FFFFFF",
    },
  });
}
