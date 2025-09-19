import { CustomPagination } from "@/components/custom-pagination";
import { EventCard, EventListItem } from "@/components/events/event-card";
import { EventsFilters } from "@/components/events/events-filters";
import { getEvents } from "@/lib/api/services/events";

// Data fetched via service with caching/tags

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
  const { data, meta } = await getEvents({
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
