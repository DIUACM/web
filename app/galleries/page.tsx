import { CustomPagination } from "@/components/custom-pagination";
import { GalleryCard, GalleryListItem } from "@/components/galleries/gallery-card";
import { Images } from "lucide-react";

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

async function fetchGalleries(params: { page?: number }): Promise<PaginatedResponse<GalleryListItem>> {
  const url = new URL("/api/galleries", API_BASE_URL);
  if (params.page) url.searchParams.set("page", String(params.page));
  const res = await fetch(url.toString(), { 
    cache: "no-store",
    headers: {
      "Accept": "application/json"
    }
  });
  if (!res.ok) throw new Error(`Failed to fetch galleries: ${res.status}`);
  return res.json();
}

type RawSearchParams = Record<string, string | string[] | undefined> & {
  page?: string;
};

export default async function GalleriesPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const sp = await searchParams;
  const get = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
  const page = Number(get(sp.page) || 1);

  const { data, meta } = await fetchGalleries({ page });

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
          Photo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">Galleries</span>
        </h1>
        <div className="mx-auto w-20 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6" />
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">Explore photos from DIU ACM events, contests, and activities</p>
      </div>

      {data.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-8 md:p-16 text-center transition-all duration-300">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
            <Images className="h-8 w-8 text-slate-500 dark:text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No galleries found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">There are no photo galleries published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
              <GalleryCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <CustomPagination currentPage={meta.current_page} totalPages={meta.last_page} />
      </div>
    </section>
  );
}
