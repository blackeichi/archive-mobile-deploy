import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "홈" }} />
      <Tabs.Screen name="categories" options={{ title: "카테고리" }} />
      <Tabs.Screen name="categories/[id]" options={{ href: null }} />
      <Tabs.Screen name="posts/[id]" options={{ href: null }} />
    </Tabs>
  );
}
