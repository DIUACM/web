import { CustomPagination } from "@/components/custom-pagination";
import { ProgrammerCard } from "@/components/programmers/programmer-card";
import { fetchProgrammers } from "@/lib/api/programmers";

type SearchParams = {
  search?: string;
  page?: string;
};

type RawSearchParams = Record<string, string | string[] | undefined> & SearchParams;

export default async function ProgrammersPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const sp = await searchParams;
  const get = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
  const page = Number(get(sp.page) || 1);
  const { data, meta } = await fetchProgrammers({
    search: get(sp.search),
    page,
  });

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Programmers</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1">DIU ACM programmers ranked by Codeforces rating.</p>
      </div>

      <div className="space-y-4">
        {data.length === 0 && (
          <p className="text-slate-500">No programmers found.</p>
        )}
        {data.map((u) => (
          <ProgrammerCard key={u.username} user={u} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <CustomPagination currentPage={meta.current_page} totalPages={meta.last_page} />
      </div>
    </section>
  );
}
