import { useCallback, useEffect, useState } from "react";
import type { PostItem } from "../constants/types";
import { apiRequest } from "../lib/api";

export function useCategoryPosts(categoryId: number) {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest<any>(`/posts/category/${categoryId}`);
      const data = response.data ?? response;
      setPosts(data);
    } catch (err: any) {
      setError(err.message || "포스트를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
  };
}
