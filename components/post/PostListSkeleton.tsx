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

export function PostListSkeleton() {
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
        {/* 포스트 카드 1 */}
        <View style={styles.postCard}>
          <SkeletonBlock width="70%" height={18} marginBottom={8} />
          <SkeletonBlock width="25%" height={14} marginBottom={10} />
          <SkeletonBlock width="100%" marginBottom={6} />
          <SkeletonBlock width="95%" marginBottom={6} />
          <SkeletonBlock width="60%" marginBottom={0} />
        </View>

        {/* 포스트 카드 2 */}
        <View style={styles.postCard}>
          <SkeletonBlock width="65%" height={18} marginBottom={8} />
          <SkeletonBlock width="25%" height={14} marginBottom={10} />
          <SkeletonBlock width="100%" marginBottom={6} />
          <SkeletonBlock width="88%" marginBottom={6} />
          <SkeletonBlock width="75%" marginBottom={0} />
        </View>

        {/* 포스트 카드 3 */}
        <View style={styles.postCard}>
          <SkeletonBlock width="75%" height={18} marginBottom={8} />
          <SkeletonBlock width="25%" height={14} marginBottom={10} />
          <SkeletonBlock width="100%" marginBottom={6} />
          <SkeletonBlock width="92%" marginBottom={6} />
          <SkeletonBlock width="55%" marginBottom={0} />
        </View>
        {/* 포스트 카드 4 */}
        <View style={styles.postCard}>
          <SkeletonBlock width="75%" height={18} marginBottom={8} />
          <SkeletonBlock width="25%" height={14} marginBottom={10} />
          <SkeletonBlock width="100%" marginBottom={6} />
          <SkeletonBlock width="92%" marginBottom={6} />
          <SkeletonBlock width="55%" marginBottom={0} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 12,
  },
  block: {
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
  },
  postCard: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
  },
});
