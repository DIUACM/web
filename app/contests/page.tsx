import { CustomPagination } from "@/components/custom-pagination";
import { Trophy } from "lucide-react";
import { ContestCard } from "@/components/contests/contest-card";
import { getContests } from "@/lib/api/services/contests";

// Data fetching is handled via service with caching/tags

type RawSearchParams = Record<string, string | string[] | undefined> & {
  page?: string;
};

export default async function ContestsPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const sp = await searchParams;
  const get = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
  const page = Number(get(sp.page) || 1);

  const { data, meta } = await getContests({ page });

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Contests</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1">Explore our contest history and results.</p>
      </div>

      {data.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
            <Trophy className="h-8 w-8 text-slate-500 dark:text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No contests found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">There are no contests published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((c) => (
            <ContestCard key={c.id} item={c} />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <CustomPagination currentPage={meta.current_page} totalPages={meta.last_page} />
      </div>
    </section>
  );
}
