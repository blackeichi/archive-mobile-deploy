import { useCallback, useEffect, useState } from "react";
import type { PostItem } from "../constants/types";
import { apiRequest } from "../lib/api";

export function usePost(postId: number) {
  const [post, setPost] = useState<PostItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest<any>(`/posts/${postId}`);
      const data = response.data ?? response;
      setPost(data);
    } catch (err: any) {
      setError(err.message || "포스트를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return {
    post,
    loading,
    error,
    refetch: fetchPost,
  };
}
