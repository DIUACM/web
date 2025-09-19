import { API_BASE_URL } from "./events";

export type GalleryListItem = {
  title: string;
  slug: string;
  cover_image: string;
  media_count: number;
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

export type GalleryDetail = {
  title: string;
  slug: string;
  description: string | null;
  media: { url: string }[];
};

export async function fetchGalleries(params: { page?: number }): Promise<PaginatedResponse<GalleryListItem>> {
  const url = new URL("/api/galleries", API_BASE_URL);
  if (params.page) url.searchParams.set("page", String(params.page));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch galleries: ${res.status}`);
  return res.json();
}

export async function fetchGallery(slug: string): Promise<{ data: GalleryDetail }> {
  const url = new URL(`/api/galleries/${slug}`, API_BASE_URL);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (!res.ok) throw new Error(`Failed to fetch gallery: ${res.status}`);
  return res.json();
}
