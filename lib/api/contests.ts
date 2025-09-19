import { API_BASE_URL } from "./events";

export type ContestListItem = {
  id: number;
  name: string;
  contest_type: string;
  location: string | null;
  date: string | null;
  best_rank: number | null;
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

export type ContestTeamMember = {
  name: string;
  username: string;
  student_id: string | null;
  department: string | null;
  profile_picture: string;
};

export type ContestTeam = {
  id: number;
  name: string;
  rank: number | null;
  solve_count: number | null;
  members: ContestTeamMember[];
};

export type ContestDetail = {
  id: number;
  name: string;
  contest_type: string;
  location: string | null;
  date: string | null;
  description: string | null;
  standings_url: string | null;
  gallery: { title: string; slug: string; cover_image: string } | null;
  teams: ContestTeam[];
};

export async function fetchContests(params: { page?: number }): Promise<PaginatedResponse<ContestListItem>> {
  const url = new URL("/api/contests", API_BASE_URL);
  if (params.page) url.searchParams.set("page", String(params.page));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch contests: ${res.status}`);
  return res.json();
}

export async function fetchContest(id: number | string): Promise<{ data: ContestDetail }> {
  const url = new URL(`/api/contests/${id}`, API_BASE_URL);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (!res.ok) throw new Error(`Failed to fetch contest: ${res.status}`);
  return res.json();
}

export function humanizeContestType(v?: string) {
  switch (v) {
    case "icpc_regional":
      return "ICPC Regional";
    case "icpc_asia_west":
      return "ICPC Asia West";
    case "iupc":
      return "IUPC";
    case "other":
      return "Other";
    default:
      return v || "";
  }
}

export function formatContestDate(iso?: string | null) {
  if (!iso) return "TBD";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
