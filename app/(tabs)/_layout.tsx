import { useAppTheme } from "@/providers/ThemeProvider";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import Octicons from "@expo/vector-icons/Octicons";
import { Redirect, Tabs } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function TabsLayout() {
  const { user, loading } = useAuth();
  const { theme } = useAppTheme();

  if (loading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color, size, focused }) => (
            <Octicons
              name={focused ? "home" : "home-fill"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="postsByCategory/[id]"
        options={{
          title: "포스트",
          tabBarIcon: ({ color, size, focused }) => (
            <Entypo
              name={focused ? "text-document" : "text-document-inverted"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "설정",
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
