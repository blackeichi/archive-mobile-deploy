import { useCategoryPosts } from "@/hooks/useCategoryPosts";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function CategoryPostsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const categoryId = Number(params.id);

  const { posts, loading, error } = useCategoryPosts(categoryId);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16 }}
      style={{ paddingTop: 12 }}
    >
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 16 }}>
        포스트 목록
      </Text>

      {posts.length === 0 ? (
        <Text>이 카테고리에는 아직 포스트가 없습니다.</Text>
      ) : (
        posts.map((post) => (
          <Pressable
            key={post.id}
            onPress={() =>
              router.push({
                pathname: "/post/[id]",
                params: { id: String(post.id) },
              })
            }
            style={{
              marginBottom: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              {post.title}
            </Text>
            <Text style={{ marginTop: 6, color: "#6b7280" }}>
              {post.visibility === "private" ? "private" : "public"}
            </Text>
            {post.summary ? (
              <Text style={{ marginTop: 8 }} numberOfLines={3}>
                {post.summary}
              </Text>
            ) : null}
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}
