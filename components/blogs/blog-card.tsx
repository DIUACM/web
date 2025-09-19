"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BlogPostListItem, formatPublishedAt } from "@/lib/api/blogs";

export function BlogCard({ post }: { post: BlogPostListItem }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link href={`/blogs/${post.slug}`} className="block group">
      <Card className="overflow-hidden py-0 gap-0 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
        <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
          <AspectRatio ratio={16 / 9} className="bg-slate-200 dark:bg-slate-700">
            <div
              className={cn(
                "absolute inset-0 bg-slate-200 dark:bg-slate-700 transition-opacity duration-300",
                isLoading ? "opacity-100" : "opacity-0"
              )}
            />
            <Image
              src={post.featured_image || "/diuacm.jpeg"}
              alt={post.title}
              fill
              className={cn(
                "object-cover transition-all duration-500 group-hover:scale-105",
                isLoading ? "opacity-0 scale-110" : "opacity-100 scale-100"
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onLoadingComplete={() => setIsLoading(false)}
              priority={false}
            />
          </AspectRatio>
        </div>

        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h3>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatPublishedAt(post.published_at)}</span>
          </div>
          {post.author && (
            <Badge variant="outline" className="font-normal">
              <User className="h-3 w-3 mr-1" />
              {post.author}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
