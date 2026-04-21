export interface CategoryNode {
  id: number;
  parent_id: number | null;
  type: "root" | "child";
  name: string;
  slug: string;
  description?: string | null;
  sort_order: number;
  is_guest_room: boolean;
  children?: CategoryNode[];
}

export type PostVisibility = "public" | "private";

export interface PostBase {
  id: number;
  title: string;
  slug: string;
  author_id: string;
  category_id: number;
  visibility: PostVisibility;
  created_at: string;
}

export interface PostDetail extends PostBase {
  content_md: string;
  summary?: string | null;
  thumbnail_url?: string | null;
  updated_at: string;
  category_name: string;
}

export interface PostSummary extends PostBase {
  summary?: string | null;
  thumbnail_url?: string | null;
  author_name: string;
  authorized: boolean;
}

export type HighlightMap = Record<string, string>;

export interface HighlightItem {
  user_id: string;
  post_id: number;
  highlights: HighlightMap;
  created_at?: string;
  updated_at?: string;
}
