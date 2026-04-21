import type { ThemePreference } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useAppTheme } from "@/providers/ThemeProvider";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const themeOptions: { key: ThemePreference; label: string }[] = [
  { key: "system", label: "시스템" },
  { key: "light", label: "라이트" },
  { key: "dark", label: "다크" },
];

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { theme, preference, resolvedTheme, setPreference } = useAppTheme();
  const styles = createStyles(theme);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          try {
            setIsSubmitting(true);
            await signOut();
            router.replace("/(auth)/login");
          } catch (error) {
            Alert.alert("오류", "로그아웃 중 문제가 발생했습니다.");
          } finally {
            setIsSubmitting(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>설정</Text>
          <Text style={styles.description}>
            앱 설정과 계정 정보를 확인할 수 있어요.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>로그인 계정</Text>
          <Text style={styles.cardValue}>
            {user?.email ?? "이메일 정보 없음"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>화면 모드</Text>
          <Text style={styles.subDescription}>
            현재 적용: {resolvedTheme === "dark" ? "다크" : "라이트"}
          </Text>

          <View style={styles.optionRow}>
            {themeOptions.map((option) => {
              const selected = preference === option.key;

              return (
                <Pressable
                  key={option.key}
                  onPress={() => setPreference(option.key)}
                  style={[
                    styles.optionChip,
                    selected && styles.optionChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      selected && styles.optionChipTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          onPress={handleLogout}
          disabled={isSubmitting}
          style={[
            styles.logoutButton,
            isSubmitting && styles.logoutButtonDisabled,
          ]}
        >
          <Text style={styles.logoutButtonText}>
            {isSubmitting ? "로그아웃 중..." : "로그아웃"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>["theme"]) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      padding: 24,
      gap: 24,
    },
    header: {
      gap: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.colors.text,
    },
    description: {
      color: theme.colors.textSecondary,
    },
    subDescription: {
      color: theme.colors.textSecondary,
      fontSize: 13,
    },
    card: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 16,
      gap: 10,
      backgroundColor: theme.colors.surface,
    },
    cardLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    cardValue: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
    optionRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 4,
    },
    optionChip: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.surfaceSecondary,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    optionChipSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    optionChipText: {
      color: theme.colors.text,
      fontWeight: "600",
    },
    optionChipTextSelected: {
      color: theme.colors.primaryContrast,
    },
    logoutButton: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      paddingVertical: 16,
      backgroundColor: theme.colors.danger,
    },
    logoutButtonDisabled: {
      opacity: 0.7,
    },
    logoutButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });
}
