import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchBlogPost, formatPublishedAt } from "@/lib/api/blogs";
import { Separator } from "@/components/ui/separator";

type Params = { slug: string };

export default async function BlogDetailsPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  let data;
  try {
    ({ data } = await fetchBlogPost(slug));
  } catch (e: any) {
    if (e?.message === "NOT_FOUND") return notFound();
    throw e;
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4 flex items-center gap-3">
        <Button asChild variant="ghost" className="px-2">
          <Link href="/blogs">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {data.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {formatPublishedAt(data.published_at)}
            </div>
            {data.author && (
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                {data.author}
              </div>
            )}
            {data.is_featured && (
              <span className="rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-0.5 text-xs">
                Featured
              </span>
            )}
          </div>

          {data.featured_image && (
            <Card className="my-6 border-slate-200/70 dark:border-slate-800 overflow-hidden">
              <div className="relative w-full aspect-[16/9]">
                <Image src={data.featured_image} alt={data.title} fill className="object-cover" />
              </div>
              <CardContent className="hidden" />
            </Card>
          )}

          <Separator className="my-6" />

          <article className="prose prose-slate dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
          </article>
        </div>
      </div>
    </section>
  );
}
