import { API_BASE_URL } from "./events";

export type BlogPostListItem = {
  title: string;
  slug: string;
  published_at: string;
  author: string;
  featured_image: string;
};

type Links = {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
};

type Meta = {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  links: Links;
  meta: Meta;
};

export type BlogPostDetail = {
  title: string;
  slug: string;
  content: string; // HTML
  published_at: string;
  is_featured: boolean;
  author: string;
  featured_image: string;
};

export async function fetchBlogPosts(params: { page?: number }): Promise<PaginatedResponse<BlogPostListItem>> {
  const url = new URL("/api/blog-posts", API_BASE_URL);
  if (params.page) url.searchParams.set("page", String(params.page));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch blog posts: ${res.status}`);
  return res.json();
}

export async function fetchBlogPost(slug: string): Promise<{ data: BlogPostDetail }> {
  const url = new URL(`/api/blog-posts/${slug}`, API_BASE_URL);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (!res.ok) throw new Error(`Failed to fetch blog post: ${res.status}`);
  return res.json();
}

export function formatPublishedAt(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(d);
}
