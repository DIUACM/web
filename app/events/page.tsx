import { CustomPagination } from "@/components/custom-pagination";
import { EventCard, EventListItem } from "@/components/events/event-card";
import { EventsFilters } from "@/components/events/events-filters";

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

type PaginatedResponse<T> = {
  data: T[];
  links: Links;
  meta: Meta;
};

const DEFAULT_BASE_URL = "http://localhost:8000";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;

async function fetchEvents(params: {
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

  const res = await fetch(url.toString(), { 
    cache: "no-store",
    headers: {
      "Accept": "application/json"
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.status}`);
  }
  return res.json();
}

type SearchParams = {
  search?: string;
  type?: string;
  participation_scope?: string;
  page?: string;
};

type RawSearchParams = Record<string, string | string[] | undefined> & SearchParams;

export default async function EventsPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const sp = await searchParams;
  const get = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
  const page = Number(get(sp.page) || 1);
  const { data, meta } = await fetchEvents({
    search: get(sp.search),
    type: get(sp.type),
    participation_scope: get(sp.participation_scope),
    page,
  });

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1">Join contests, classes, and more.</p>
      </div>

      <div className="mb-6">
        <EventsFilters />
      </div>

      <div className="space-y-4">
        {data.length === 0 && (
          <p className="text-slate-500">No events found.</p>
        )}
        {data.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <CustomPagination currentPage={meta.current_page} totalPages={meta.last_page} />
      </div>
    </section>
  );
}
