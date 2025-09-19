import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Images } from "lucide-react";
import { GalleryGrid } from "@/components/galleries/gallery-grid";

// Types sourced from services

import { getGallery } from "@/lib/api/services/galleries";
import { HttpError } from "@/lib/api/http";

type Params = { slug: string };

export default async function GalleryDetailsPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  let data;
  try {
    ({ data } = await getGallery(slug));
  } catch (e: unknown) {
    if (e instanceof HttpError && e.status === 404) return notFound();
    throw e;
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" className="px-2">
          <Link href="/galleries">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
      </div>

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">{data.title}</span>
        </h1>
        <div className="mx-auto w-20 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6" />
        {data.description && (
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-4">{data.description}</p>
        )}
        <div className="text-sm text-slate-500 dark:text-slate-400">
          <p className="flex items-center justify-center">
            <Images className="h-4 w-4 mr-1" />
            {data.media.length} {data.media.length === 1 ? "photo" : "photos"} in this gallery
          </p>
        </div>
      </div>

      {(!data.media || data.media.length === 0) ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-8 md:p-16 text-center transition-all duration-300">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
            <Images className="h-8 w-8 text-slate-500 dark:text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No images in this gallery</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">This gallery does not contain any images yet.</p>
        </div>
      ) : (
        <GalleryGrid media={data.media} title={data.title} />
      )}
    </section>
  );
}
