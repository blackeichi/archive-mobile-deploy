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

export interface PostItem {
  id: number;
  author_id: string;
  category_id: number;
  title: string;
  slug: string;
  content_md: string;
  summary?: string | null;
  thumbnail_url?: string | null;
  visibility: "public" | "private";
  created_at: string;
  updated_at: string;
  category_name: string;
}

export interface PostListItem {
  id: number;
  title: string;
  slug: string;
  author_id: string;
  summary?: string | null;
  category_id: number;
  created_at: string;
  visibility: "public" | "private";
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
