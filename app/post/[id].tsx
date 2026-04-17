import MarkdownViewer from "@/components/MarkdownViewer";
import TopContents from "@/components/post/TopContents";
import { useGetHighlights, useSaveHighlights } from "@/hooks/useHighlights";
import { usePost } from "@/hooks/usePost";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const postId = Number(params.id);

  const { post, loading, error } = usePost(postId);
  const { highLights, setHighLights } = useGetHighlights(postId);
  const { isChanged, setIsChanged, confirmSave } = useSaveHighlights(
    postId,
    highLights,
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>←</Text>
      </Pressable>
      <View style={styles.page}>
        {isChanged && (
          <Pressable style={styles.saveButton} onPress={confirmSave}>
            <Text style={styles.saveButtonText}>저장</Text>
          </Pressable>
        )}

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <TopContents post={post} />
          <View style={styles.bodyCard}>
            <MarkdownViewer
              content={post.content_md || ""}
              highlightMap={highLights}
              setHighLights={setHighLights}
              setIsChanged={setIsChanged}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: 12,
  },
  page: {
    flex: 1,
    position: "relative",
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
  bodyCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
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
  backButton: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: "600",
  },
  saveButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1000,
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
