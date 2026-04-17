import Entypo from "@expo/vector-icons/Entypo";
import Octicons from "@expo/vector-icons/Octicons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
      {/* <Tabs.Screen name="" options={{ title: "설정" }} /> */}
    </Tabs>
  );
}
