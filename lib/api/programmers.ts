import { API_BASE_URL } from "./events";

export type ProgrammerListItem = {
  name: string;
  username: string;
  student_id: string | null;
  department: string | null;
  profile_picture: string;
  max_cf_rating: number | null;
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

export type ContestMember = {
  name: string;
  username: string;
  student_id: string | null;
  department: string | null;
  profile_picture: string;
};

export type ProgrammerContest = {
  id: number;
  name: string;
  date: string; // ISO
  team_name: string;
  rank: number | null;
  solve_count: number | null;
  members: ContestMember[];
};

export type TrackerRanklistPerformance = {
  keyword: string;
  total_users: number;
  events_count: number;
  user_score: number;
  user_position: number;
};

export type TrackerPerformance = {
  title: string;
  slug: string;
  ranklists: TrackerRanklistPerformance[];
};

export type ProgrammerDetail = {
  name: string;
  username: string;
  student_id: string | null;
  department: string | null;
  profile_picture: string;
  max_cf_rating: number | null;
  codeforces_handle: string | null;
  atcoder_handle: string | null;
  vjudge_handle: string | null;
  contests: ProgrammerContest[];
  tracker_performance: TrackerPerformance[];
};

export async function fetchProgrammers(params: { search?: string; page?: number }): Promise<PaginatedResponse<ProgrammerListItem>> {
  const url = new URL("/api/programmers", API_BASE_URL);
  if (params.search) url.searchParams.set("search", params.search);
  if (params.page) url.searchParams.set("page", String(params.page));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch programmers: ${res.status}`);
  return res.json();
}

export async function fetchProgrammer(username: string): Promise<{ data: ProgrammerDetail }> {
  const url = new URL(`/api/programmers/${username}`, API_BASE_URL);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (!res.ok) throw new Error(`Failed to fetch programmer: ${res.status}`);
  return res.json();
}

export function formatContestDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
