import { useAppTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import { rememberedEmailStorage } from "../../lib/auth-storage";

export default function LoginScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingRememberedEmail, setLoadingRememberedEmail] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadRememberedEmail = async () => {
      try {
        const rememberedEmail = await rememberedEmailStorage.getEmail();

        if (mounted && rememberedEmail) {
          setEmail(rememberedEmail);
        }
      } finally {
        if (mounted) {
          setLoadingRememberedEmail(false);
        }
      }
    };

    loadRememberedEmail();

    return () => {
      mounted = false;
    };
  }, []);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0 && !submitting;
  }, [email, password, submitting]);

  const { user, signIn } = useAuth();

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  const onSubmit = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    setErrorMessage("");

    try {
      const normalizedEmail = email.trim().toLowerCase();

      await signIn({
        email: normalizedEmail,
        password,
      });

      await rememberedEmailStorage.setEmail(normalizedEmail);
      router.replace("/(tabs)");
    } catch (err: any) {
      setErrorMessage(err?.message || "로그인에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.badge}>
            <Ionicons
              name="sparkles-outline"
              size={16}
              color={theme.colors.badgeText}
            />
            <Text style={styles.badgeText}>아카이브 모바일</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>로그인</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>이메일</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={theme.colors.textSecondary}
                />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  placeholderTextColor={theme.colors.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="username"
                  autoComplete="email"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>비밀번호</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={theme.colors.textSecondary}
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="비밀번호를 입력하세요"
                  placeholderTextColor={theme.colors.textMuted}
                  secureTextEntry={!showPassword}
                  textContentType="password"
                  autoComplete="password"
                  style={styles.input}
                  onSubmitEditing={onSubmit}
                />
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={8}
                  style={styles.trailingIconButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={theme.colors.textSecondary}
                  />
                </Pressable>
              </View>
            </View>

            {errorMessage ? (
              <View style={styles.errorBox}>
                <Ionicons
                  name="alert-circle"
                  size={16}
                  color={theme.colors.dangerText}
                />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <Pressable
              style={[
                styles.submitButton,
                !canSubmit && styles.submitButtonDisabled,
              ]}
              onPress={onSubmit}
              disabled={!canSubmit}
            >
              {submitting || loadingRememberedEmail ? (
                <ActivityIndicator color={theme.colors.primaryContrast} />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>로그인</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={theme.colors.primaryContrast}
                  />
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>["theme"]) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: 32,
      gap: 12,
    },
    badge: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: theme.colors.badge,
    },
    badgeText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.badgeText,
    },
    card: {
      borderRadius: 18,
      padding: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 18,
      shadowColor: theme.colors.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 3,
    },
    cardHeader: {
      gap: 6,
    },
    cardTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: theme.colors.text,
    },
    formGroup: {
      gap: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    inputWrapper: {
      minHeight: 56,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      borderWidth: 1,
      borderColor: theme.colors.borderStrong,
      borderRadius: 16,
      paddingHorizontal: 14,
      backgroundColor: theme.colors.surface,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: theme.colors.text,
    },
    trailingIconButton: {
      alignItems: "center",
      justifyContent: "center",
    },
    errorBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: 14,
      backgroundColor: theme.colors.dangerSoft,
      borderWidth: 1,
      borderColor: theme.colors.danger,
    },
    errorText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 20,
      color: theme.colors.dangerText,
    },
    submitButton: {
      minHeight: 54,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    submitButtonText: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.primaryContrast,
    },
  });
}
