import { useAppTheme } from "@/providers/ThemeProvider";
import { StyleSheet, Text, View } from "react-native";

export default function HomeTabScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Study Archive Mobile</Text>
      <Text style={styles.description}>공부 저장소 모바일 앱입니다.</Text>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>["theme"]) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "600",
      color: theme.colors.text,
    },
    description: {
      marginTop: 8,
      color: theme.colors.textSecondary,
    },
  });
}
