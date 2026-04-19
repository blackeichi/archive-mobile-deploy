import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃할까요?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          try {
            setIsSubmitting(true);
            await signOut();
            router.replace("/(auth)/login");
          } catch (error) {
            console.error("[SettingsScreen] signOut error:", error);
            Alert.alert("오류", "로그아웃 중 문제가 발생했습니다.");
          } finally {
            setIsSubmitting(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1, padding: 24, gap: 24 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: "700" }}>설정</Text>
          <Text style={{ color: "#6b7280" }}>
            앱 설정과 계정 정보를 확인할 수 있어요.
          </Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 16,
            padding: 16,
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 14, color: "#6b7280" }}>로그인 계정</Text>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            {user?.email ?? "이메일 정보 없음"}
          </Text>
        </View>

        <Pressable
          onPress={handleLogout}
          disabled={isSubmitting}
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            paddingVertical: 16,
            backgroundColor: isSubmitting ? "#fca5a5" : "#ef4444",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
            {isSubmitting ? "로그아웃 중..." : "로그아웃"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
