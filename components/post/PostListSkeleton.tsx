import { useAppTheme } from "@/providers/ThemeProvider";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

function SkeletonBlock({
  width,
  height = 14,
  marginBottom = 8,
  styles,
}: {
  width: `${number}%` | number;
  height?: number;
  marginBottom?: number;
  styles: ReturnType<typeof createStyles>;
}) {
  return <View style={[styles.block, { width, height, marginBottom }]} />;
}

export function PostListSkeleton() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity }}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.postCard}>
            <View style={styles.thumbnail} />
            <View style={styles.body}>
              <SkeletonBlock
                styles={styles}
                width="25%"
                height={14}
                marginBottom={10}
              />
              <SkeletonBlock
                styles={styles}
                width="70%"
                height={20}
                marginBottom={10}
              />
              <SkeletonBlock styles={styles} width="100%" marginBottom={6} />
              <SkeletonBlock styles={styles} width="92%" marginBottom={6} />
              <SkeletonBlock styles={styles} width="60%" marginBottom={0} />
            </View>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>["theme"]) {
  return StyleSheet.create({
    container: {
      paddingTop: 12,
    },
    block: {
      backgroundColor: theme.colors.border,
      borderRadius: 6,
    },
    postCard: {
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: theme.colors.surface,
    },
    thumbnail: {
      width: "100%",
      height: 180,
      backgroundColor: theme.colors.surfaceSecondary,
    },
    body: {
      padding: 16,
    },
  });
}
