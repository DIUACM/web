import { CustomPagination } from "@/components/custom-pagination";
import { ProgrammerCard, ProgrammerListItem } from "@/components/programmers/programmer-card";
import { ProgrammersSearch } from "./components/search";

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

async function fetchProgrammers(params: { search?: string; page?: number }): Promise<PaginatedResponse<ProgrammerListItem>> {
  const url = new URL("/api/programmers", API_BASE_URL);
  if (params.search) url.searchParams.set("search", params.search);
  if (params.page) url.searchParams.set("page", String(params.page));
  const res = await fetch(url.toString(), { 
    cache: "no-store",
    headers: {
      "Accept": "application/json"
    }
  });
  if (!res.ok) throw new Error(`Failed to fetch programmers: ${res.status}`);
  return res.json();
}

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
