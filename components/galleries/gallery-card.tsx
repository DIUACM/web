"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Images } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { GalleryListItem } from "@/lib/api/galleries";

export function GalleryCard({ item }: { item: GalleryListItem }) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Link href={`/galleries/${item.slug}`} className="block group">
      <Card className="overflow-hidden py-0 gap-0 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
        <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
          <AspectRatio ratio={16 / 9} className="bg-slate-200 dark:bg-slate-700">
            {item.cover_image ? (
              <>
                <div
                  className={`absolute inset-0 bg-slate-200 dark:bg-slate-700 transition-opacity duration-300 ${isLoading ? "opacity-100" : "opacity-0"}`}
                />
                <Image
                  src={item.cover_image}
                  alt={item.title}
                  fill
                  className={`object-cover transition-all duration-500 group-hover:scale-105 ${isLoading ? "opacity-0 scale-110" : "opacity-100 scale-100"}`}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  onLoad={() => setIsLoading(false)}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                <Images className="h-12 w-12 text-slate-400" />
              </div>
            )}
          </AspectRatio>

          <div className="absolute bottom-3 right-3 bg-black/75 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5 font-medium z-10">
            <Images className="h-3.5 w-3.5" />
            <span>
              {item.media_count === 1 ? "1 photo" : `${item.media_count} photos`}
            </span>
          </div>

          {item.media_count > 1 && (
            <div className="absolute top-3 right-3 flex gap-1.5 z-10">
              {Array.from({ length: Math.min(3, item.media_count - 1) }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/80 border border-black/20 shadow-sm" aria-hidden="true" />
              ))}
            </div>
          )}
        </div>

        <CardContent className="p-4 ">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {item.title}
          </h3>
        </CardContent>

        <CardFooter className="px-4 py-0 pb-4 pt-0 flex items-center justify-end text-xs text-slate-500 dark:text-slate-400">
          <Badge variant="outline" className="font-normal">
            {item.media_count === 1 ? "1 photo" : `${item.media_count} photos`}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
