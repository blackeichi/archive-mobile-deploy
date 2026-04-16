import { HighlightMap } from "@/constants/types";
import { apiRequest } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

export function useGetHighlights(postId: number) {
  const [highLights, setHighLights] = useState<HighlightMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHighLights = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest<any>(`/highlight/${postId}`);
      const data = response.data ?? response;
      setHighLights(data.highlights);
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
    loading,
    error,
  };
}
