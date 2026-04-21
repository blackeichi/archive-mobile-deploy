import { CustomScrollViewHandle } from "@/components/common/CustomScrollView";
import { bookmarkStorage } from "@/lib/bookmark-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

export const useBookmark = ({
  loading,
  postId,
}: {
  loading: boolean;
  postId: number;
}) => {
  const scrollRef = useRef<CustomScrollViewHandle>(null);
  const currentScrollY = useRef(0);
  const [hasBookmark, setHasBookmark] = useState(false);
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState(false);

  useEffect(() => {
    if (loading) return;
    let cancelled = false;
    bookmarkStorage.getPosition(postId).then((y) => {
      if (cancelled || y === null) return;
      setHasBookmark(true);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y, animated: true });
        setBookmarkModalVisible(true);
      }, 300);
    });
    return () => {
      cancelled = true;
    };
  }, [loading, postId]);

  const handleSaveBookmark = useCallback(async () => {
    await bookmarkStorage.setPosition(postId, currentScrollY.current);
    setHasBookmark(true);
  }, [postId]);

  const handleRemoveBookmark = useCallback(async () => {
    await bookmarkStorage.remove(postId);
    setHasBookmark(false);
    setBookmarkModalVisible(false);
  }, [postId]);

  const handleBookmarkPress = useCallback(() => {
    if (hasBookmark) {
      Alert.alert(
        "책갈피",
        "책갈피를 삭제하시겠습니까?",
        [
          { text: "취소", style: "cancel" },
          { text: "삭제", onPress: handleRemoveBookmark },
        ],
        { cancelable: true },
      );
    } else {
      handleSaveBookmark();
    }
  }, [hasBookmark, handleSaveBookmark, handleRemoveBookmark]);

  return {
    handleBookmarkPress,
    hasBookmark,
    scrollRef,
    currentScrollY,
    bookmarkModalVisible,
    setBookmarkModalVisible,
    handleRemoveBookmark,
  };
};
