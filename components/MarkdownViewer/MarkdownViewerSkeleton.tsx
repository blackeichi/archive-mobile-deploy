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

export function MarkdownViewerSkeleton() {
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
    <Animated.View style={{ opacity }}>
      <SkeletonBlock
        styles={styles}
        width="55%"
        height={20}
        marginBottom={14}
      />
      <SkeletonBlock styles={styles} width="100%" marginBottom={8} />
      <SkeletonBlock styles={styles} width="94%" marginBottom={8} />
      <SkeletonBlock styles={styles} width="88%" marginBottom={8} />
      <SkeletonBlock styles={styles} width="76%" marginBottom={24} />

      <SkeletonBlock
        styles={styles}
        width="45%"
        height={18}
        marginBottom={12}
      />
      <SkeletonBlock styles={styles} width="100%" marginBottom={8} />
      <SkeletonBlock styles={styles} width="91%" marginBottom={8} />
      <SkeletonBlock styles={styles} width="85%" marginBottom={8} />
      <SkeletonBlock styles={styles} width="70%" marginBottom={24} />

      <View style={styles.codeBlock}>
        <SkeletonBlock
          styles={styles}
          width="65%"
          height={13}
          marginBottom={10}
        />
        <SkeletonBlock
          styles={styles}
          width="48%"
          height={13}
          marginBottom={10}
        />
        <SkeletonBlock
          styles={styles}
          width="57%"
          height={13}
          marginBottom={0}
        />
      </View>

      <SkeletonBlock styles={styles} width="100%" marginBottom={8} />
      <SkeletonBlock styles={styles} width="89%" marginBottom={8} />
      <SkeletonBlock styles={styles} width="60%" marginBottom={24} />
    </Animated.View>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>["theme"]) {
  return StyleSheet.create({
    block: {
      backgroundColor: theme.colors.border,
      borderRadius: 6,
    },
    codeBlock: {
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
    },
  });
}
