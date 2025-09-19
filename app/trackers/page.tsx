import { TrackerCard } from "@/components/trackers/tracker-card";
import { CustomPagination } from "@/components/custom-pagination";
import { getTrackers } from "@/lib/api/services/trackers";

// Data fetched via service with caching/tags

type RawSearchParams = Record<string, string | string[] | undefined> & {
  page?: string;
};

export default async function TrackersPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const sp = await searchParams;
  const get = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
  const page = Number(get(sp.page) || 1);

  const { data, meta } = await getTrackers({ page });

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
