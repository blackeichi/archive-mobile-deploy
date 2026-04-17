import { useCallback, useEffect, useState } from "react";
import type { CategoryNode } from "../constants/types";
import { apiRequest } from "../lib/api";

export function useCategories() {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest<CategoryNode[]>("/categories/tree");
      setCategories(response);
    } catch (err: any) {
      setError(err.message || "카테고리를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}
