import { CustomPagination } from "@/components/custom-pagination";
import { ProgrammerCard } from "@/components/programmers/programmer-card";
import { ProgrammersSearch } from "./components/search";
import { getProgrammers } from "@/lib/api/services/programmers";

// Data fetched via server service with caching/tags

type SearchParams = {
  search?: string;
  page?: string;
};

type RawSearchParams = Record<string, string | string[] | undefined> & SearchParams;

export default async function ProgrammersPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const sp = await searchParams;
  const get = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
  const page = Number(get(sp.page) || 1);
  const { data, meta } = await getProgrammers({
    search: get(sp.search),
    page,
  });

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Programmers</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1">DIU ACM programmers ranked by Codeforces rating.</p>
      </div>

      <div className="mt-6">
        <ProgrammersSearch initialSearch={get(sp.search) || ""} />
      </div>

      {data.length === 0 ? (
        <div className="mt-6">
          <p className="text-slate-500">No programmers found.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((u) => (
            <ProgrammerCard key={u.username} user={u} />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <CustomPagination currentPage={meta.current_page} totalPages={meta.last_page} />
      </div>
    </section>
  );
}
