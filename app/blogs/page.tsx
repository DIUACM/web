import { CustomPagination } from "@/components/custom-pagination";
import { BlogCard, BlogPostListItem } from "@/components/blogs/blog-card";
import { getBlogPosts } from "@/lib/api/services/blogs";
import { BookOpen } from "lucide-react";

// Data fetching is handled server-side via service with caching/tags

type SearchParams = {
  page?: string;
};

type RawSearchParams = Record<string, string | string[] | undefined> & SearchParams;

export default async function BlogsPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const sp = await searchParams;
  const get = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
  const page = Number(get(sp.page) || 1);
  const { data, meta } = await getBlogPosts({ page });

  return (
    <section className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
          Our {""}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
            Blog
          </span>
        </h1>
        <div className="mx-auto w-20 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6" />
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Read the latest articles, tutorials, and news from DIU ACM
        </p>
      </div>

      {/* Grid or Empty State */}
      {data.length > 0 ? (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-8 md:p-16 text-center transition-all duration-300">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
            <BookOpen className="h-8 w-8 text-slate-500 dark:text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No articles found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            There are no blog posts published yet. Check back soon!
          </p>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <CustomPagination currentPage={meta.current_page} totalPages={meta.last_page} />
      </div>
    </section>
  );
}
