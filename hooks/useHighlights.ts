import { HighlightItem, HighlightMap } from "@/constants/types";
import { apiRequest } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export function useGetHighlights(postId: number) {
  const [highLights, setHighLights] = useState<HighlightMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHighLights = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest<HighlightItem>(`/highlight/${postId}`);
      setHighLights(response.highlights);
    } catch (err: any) {
      setError(err.message || "하이라이트를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchHighLights();
  }, [fetchHighLights]);

  return {
    highLights,
    setHighLights,
    loading,
    error,
  };
}

export function useSaveHighlights(postId: number, highLights: HighlightMap) {
  const [loading, setLoading] = useState(true);
  const saveHighlights = useCallback(
    async (highLights: HighlightMap) => {
      setLoading(true);
      try {
        await apiRequest<any>(`/highlight/${postId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            highlights: highLights,
          }),
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.";
      } finally {
        setLoading(false);
      }
    },
    [postId],
  );

  const [isChanged, setIsChanged] = useState(false);
  const confirmSave = useCallback(() => {
    if (!isChanged || !saveHighlights) return;

    Alert.alert(
      "하이라이트 저장",
      "현재 하이라이트 내용을 저장할까요?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "확인",
          onPress: async () => {
            try {
              await saveHighlights(highLights);
              setIsChanged(false);
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "저장 중 오류가 발생했습니다.";
            }
          },
        },
      ],
      { cancelable: true },
    );
  }, [isChanged, saveHighlights, highLights]);

  return {
    isChanged,
    setIsChanged,
    confirmSave,
  };
}

export function useDeleteHighlights(postId: number, onSuccess: () => void) {
  const [loading, setLoading] = useState(false);

  const confirmDelete = useCallback(() => {
    Alert.alert(
      "하이라이트 삭제",
      "모든 하이라이트를 삭제할까요?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await apiRequest<any>(`/highlight/${postId}`, {
                method: "DELETE",
              });
              onSuccess();
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "삭제 중 오류가 발생했습니다.";
              Alert.alert("오류", message);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  }, [postId, onSuccess]);

  return { confirmDelete, loading };
}
