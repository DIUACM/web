import { API_BASE_URL } from "./events";

export type TrackerListItem = {
  title: string;
  slug: string;
  description: string;
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

export type TrackerEvent = {
  id: number;
  title: string;
  starting_at: string;
  strict_attendance?: boolean;
};

export type TrackerUserEventStats = {
  event_id: number;
  solve_count: number;
  upsolve_count: number;
  participation: boolean;
};

export type TrackerUser = {
  name: string;
  username: string;
  student_id: string;
  department: string;
  profile_picture: string;
  score: number;
  event_stats: Record<string, TrackerUserEventStats | null>;
};

export type TrackerDetail = {
  title: string;
  slug: string;
  description: string;
  rank_lists: { keyword: string }[];
  selected_rank_list: {
    keyword: string;
    consider_strict_attendance: boolean;
    events: TrackerEvent[];
    users: TrackerUser[];
  };
};

export async function fetchTrackers(params: { page?: number }): Promise<PaginatedResponse<TrackerListItem>> {
  const url = new URL("/api/trackers", API_BASE_URL);
  if (params.page) url.searchParams.set("page", String(params.page));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch trackers: ${res.status}`);
  return res.json();
}

export async function fetchTracker(slug: string, keyword?: string): Promise<{ data: TrackerDetail }> {
  const url = new URL(`/api/trackers/${slug}`, API_BASE_URL);
  if (keyword) url.searchParams.set("keyword", keyword);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (!res.ok) throw new Error(`Failed to fetch tracker: ${res.status}`);
  return res.json();
}
