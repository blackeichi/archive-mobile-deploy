import { useAppTheme } from "@/providers/ThemeProvider";
import React, { ReactNode, useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type CustomScrollViewProps = ScrollViewProps & {
  children: ReactNode;
  trackTop?: number;
  trackBottom?: number;
  trackRight?: number;
  trackWidth?: number;
  minThumbHeight?: number;
  hideIndicatorWhenShort?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function CustomScrollView({
  children,
  style,
  contentContainerStyle,
  trackTop = 12,
  trackBottom = 12,
  trackRight = 6,
  trackWidth = 4,
  minThumbHeight = 36,
  hideIndicatorWhenShort = true,
  containerStyle,
  onScroll,
  onContentSizeChange,
  ...scrollViewProps
}: CustomScrollViewProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const [containerHeight, setContainerHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(1);
  const [scrollY, setScrollY] = useState(0);

  const handleContainerLayout = (e: LayoutChangeEvent) => {
    setContainerHeight(e.nativeEvent.layout.height);
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollY(e.nativeEvent.contentOffset.y);
    onScroll?.(e);
  };

  const handleContentSizeChange = (width: number, height: number) => {
    setContentHeight(height);
    onContentSizeChange?.(width, height);
  };

  const indicator = useMemo(() => {
    const scrollable = contentHeight > containerHeight + 8;
    const shouldShow = hideIndicatorWhenShort ? scrollable : true;

    const visibleRatio =
      contentHeight > 0 ? containerHeight / contentHeight : 1;

    const thumbHeight = Math.max(
      containerHeight * visibleRatio,
      minThumbHeight,
    );
    const maxThumbTop = Math.max(containerHeight - thumbHeight, 0);
    const maxScrollY = Math.max(contentHeight - containerHeight, 1);
    const thumbTop = (scrollY / maxScrollY) * maxThumbTop;

    return {
      shouldShow,
      thumbHeight,
      thumbTop: Number.isFinite(thumbTop) ? thumbTop : 0,
    };
  }, [
    containerHeight,
    contentHeight,
    scrollY,
    minThumbHeight,
    hideIndicatorWhenShort,
  ]);

  return (
    <View
      style={[styles.wrapper, containerStyle]}
      onLayout={handleContainerLayout}
    >
      <ScrollView
        {...scrollViewProps}
        style={style}
        contentContainerStyle={contentContainerStyle}
        onScroll={handleScroll}
        onContentSizeChange={handleContentSizeChange}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      {indicator.shouldShow && (
        <View
          pointerEvents="none"
          style={[
            styles.scrollTrack,
            {
              top: trackTop,
              bottom: trackBottom,
              right: trackRight,
              width: trackWidth,
            },
          ]}
        >
          <View
            style={[
              styles.scrollThumb,
              {
                height: indicator.thumbHeight,
                transform: [{ translateY: indicator.thumbTop }],
              },
            ]}
          />
        </View>
      )}
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>["theme"]) {
  return StyleSheet.create({
    wrapper: {
      flex: 1,
      position: "relative",
    },
    scrollTrack: {
      position: "absolute",
      borderRadius: 999,
      overflow: "hidden",
      backgroundColor:
        theme.mode === "dark"
          ? "rgba(255,255,255,0.10)"
          : "rgba(17,24,39,0.08)",
    },
    scrollThumb: {
      width: "100%",
      borderRadius: 999,
      backgroundColor:
        theme.mode === "dark"
          ? "rgba(255,255,255,0.72)"
          : "rgba(17,24,39,0.45)",
    },
  });
}
