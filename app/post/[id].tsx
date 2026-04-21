import MarkdownViewer from "@/components/MarkdownViewer";
import { MarkdownViewerSkeleton } from "@/components/MarkdownViewer/MarkdownViewerSkeleton";
import TopContents from "@/components/post/TopContents";
import type { PostDetail } from "@/constants/types";
import {
  useDeleteHighlights,
  useGetHighlights,
  useSaveHighlights,
} from "@/hooks/useHighlights";
import { usePost } from "@/hooks/usePost";
import { useAppTheme } from "@/providers/ThemeProvider";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
  const { isChanged, setIsChanged, confirmSave } = useSaveHighlights(
    postId,
    highLights,
  );

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!isChanged) return;

      e.preventDefault();

      Alert.alert(
        "😮 저장하지 않은 변경사항",
        "저장하지 않은 하이라이트는 삭제됩니다. 계속할까요?",
        [
          { text: "취소", style: "cancel" },
          {
            text: "확인",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          },
        ],
        { cancelable: true },
      );
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, isChanged]);

  const hasHighlights = Object.keys(highLights).length > 0;
  const { confirmDelete } = useDeleteHighlights(postId, () => {
    setHighLights({});
    setIsChanged(false);
  });

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
              <Feather name="save" size={20} color={theme.colors.text} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.page}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
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
        </ScrollView>
      </View>
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
  });
}
