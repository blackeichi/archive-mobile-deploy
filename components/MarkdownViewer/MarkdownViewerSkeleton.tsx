import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

function SkeletonBlock({
  width,
  height = 14,
  marginBottom = 8,
}: {
  width: `${number}%` | number;
  height?: number;
  marginBottom?: number;
}) {
  return <View style={[styles.block, { width, height, marginBottom }]} />;
}

export function MarkdownViewerSkeleton() {
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
      {/* 헤딩 */}
      <SkeletonBlock width="55%" height={20} marginBottom={14} />
      {/* 단락 */}
      <SkeletonBlock width="100%" marginBottom={8} />
      <SkeletonBlock width="94%" marginBottom={8} />
      <SkeletonBlock width="88%" marginBottom={8} />
      <SkeletonBlock width="76%" marginBottom={24} />

      {/* 헤딩 */}
      <SkeletonBlock width="45%" height={18} marginBottom={12} />
      {/* 단락 */}
      <SkeletonBlock width="100%" marginBottom={8} />
      <SkeletonBlock width="91%" marginBottom={8} />
      <SkeletonBlock width="85%" marginBottom={8} />
      <SkeletonBlock width="70%" marginBottom={24} />

      {/* 코드 블록 */}
      <View style={styles.codeBlock}>
        <SkeletonBlock width="65%" height={13} marginBottom={10} />
        <SkeletonBlock width="48%" height={13} marginBottom={10} />
        <SkeletonBlock width="57%" height={13} marginBottom={0} />
      </View>

      {/* 단락 */}
      <SkeletonBlock width="100%" marginBottom={8} />
      <SkeletonBlock width="89%" marginBottom={8} />
      <SkeletonBlock width="60%" marginBottom={24} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
  },
  codeBlock: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
});
