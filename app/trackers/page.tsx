import { TrackerCard, TrackerListItem } from "@/components/trackers/tracker-card";
import { CustomPagination } from "@/components/custom-pagination";

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

async function fetchTrackers(params: { page?: number }): Promise<PaginatedResponse<TrackerListItem>> {
  const url = new URL("/api/trackers", API_BASE_URL);
  if (params.page) url.searchParams.set("page", String(params.page));
  const res = await fetch(url.toString(), { 
    cache: "no-store",
    headers: {
      "Accept": "application/json"
    }
  });
  if (!res.ok) throw new Error(`Failed to fetch trackers: ${res.status}`);
  return res.json();
}

type RawSearchParams = Record<string, string | string[] | undefined> & {
  page?: string;
};

export default async function TrackersPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const sp = await searchParams;
  const get = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
  const page = Number(get(sp.page) || 1);

  const { data, meta } = await fetchTrackers({ page });

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Trackers</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1">Explore performance trackers and rank lists.</p>
      </div>

      <div className="space-y-4">
        {data.length === 0 && <p className="text-slate-500">No trackers found.</p>}
        {data.map((t) => (
          <TrackerCard key={t.slug} tracker={t} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <CustomPagination currentPage={meta.current_page} totalPages={meta.last_page} />
      </div>
    </section>
  );
}
