export type EventListItem = {
  id: number;
  title: string;
  starting_at: string;
  ending_at: string;
  participation_scope: string;
  event_type: string;
  attendance_count?: number;
};

export type EventDetail = {
  id: number;
  title: string;
  description?: string;
  type: string;
  status: string;
  starting_at: string;
  ending_at: string;
  participation_scope: string;
  event_link?: string;
  open_for_attendance?: boolean;
  user_stats?: any[];
  attendees?: any[];
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

const DEFAULT_BASE_URL = "http://localhost:8000";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;

export async function fetchEvents(params: {
  search?: string;
  type?: string;
  participation_scope?: string;
  page?: number;
}): Promise<PaginatedResponse<EventListItem>> {
  const url = new URL("/api/events", API_BASE_URL);
  if (params.search) url.searchParams.set("search", params.search);
  if (params.type) url.searchParams.set("type", params.type);
  if (params.participation_scope)
    url.searchParams.set("participation_scope", params.participation_scope);
  if (params.page) url.searchParams.set("page", String(params.page));

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.status}`);
  }
  return res.json();
}

export async function fetchEvent(id: number | string): Promise<{ data: EventDetail }> {
  const url = new URL(`/api/events/${id}`, API_BASE_URL);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (res.status === 404) {
    throw new Error("NOT_FOUND");
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch event: ${res.status}`);
  }
  return res.json();
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatDateRange(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  const dateFmt = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const timeFmt = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (sameDay) {
    return `${dateFmt.format(start)} • ${timeFmt.format(start)} - ${timeFmt.format(end)}`;
  }
  return `${dateFmt.format(start)} ${timeFmt.format(start)} - ${dateFmt.format(end)} ${dateFmt.format(end)}`;
}

export function humanizeType(v?: string) {
  switch (v) {
    case "contest":
      return "Contest";
    case "class":
      return "Class";
    case "other":
      return "Other";
    default:
      return v || "";
  }
}

export function humanizeScope(v?: string) {
  switch (v) {
    case "open_for_all":
      return "Open for All";
    case "only_girls":
      return "Only Girls";
    case "junior_programmers":
      return "Junior Programmers";
    case "selected_persons":
      return "Selected Persons";
    default:
      return v || "";
  }
}

export function humanizeStatus(v?: string) {
  switch (v) {
    case "published":
      return "Published";
    case "draft":
      return "Draft";
    case "archived":
      return "Archived";
    default:
      return v || "";
  }
}

export function formatTime(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
