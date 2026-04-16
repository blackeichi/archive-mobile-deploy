import { router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useCategories } from "../../hooks/useCategories";

export default function CategoriesTabScreen() {
  const { categories, loading, error } = useCategories();

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
        카테고리
      </Text>

      {categories.map((root) => (
        <View
          key={root.id}
          style={{
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/categories/[id]",
                params: { id: String(root.id) },
              })
            }
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>{root.name}</Text>
            {root.is_guest_room ? (
              <Text style={{ marginTop: 4, color: "#6b7280" }}>게스트룸</Text>
            ) : null}
          </Pressable>

          {root.children?.length ? (
            <View style={{ marginTop: 12, gap: 8 }}>
              {root.children.map((child) => (
                <Pressable
                  key={child.id}
                  onPress={() =>
                    router.push({
                      pathname: "/categories/[id]",
                      params: { id: String(child.id) },
                    })
                  }
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <Text>{child.name}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}
