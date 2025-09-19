"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type MediaItem = { url: string; title?: string | null };

export function GalleryGrid({ media, title }: { media: MediaItem[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;
  const safeIndex = index ?? 0;

  const next = useCallback(() => setIndex((i) => (i === null ? 0 : (i + 1) % media.length)), [media.length]);
  const prev = useCallback(() => setIndex((i) => (i === null ? 0 : (i - 1 + media.length) % media.length)), [media.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev]);

  const current = useMemo(() => (open ? media[safeIndex] : null), [open, media, safeIndex]);

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
        {media.map((m, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className="mb-4 w-full text-left break-inside-avoid"
          >
            <div className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
              <Image
                src={m.url}
                alt={m.title || `${title} - Image ${i + 1}`}
                width={0}
                height={0}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="w-full h-auto object-cover"
                priority={i < 6}
              />
            </div>
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={(o) => !o && setIndex(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Lightbox</DialogDescription>
          </DialogHeader>
          {current && (
            <div className="relative bg-black">
              <Image
                src={current.url}
                alt={current.title || title}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto object-contain max-h-[80vh] bg-black"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <Button variant="secondary" size="icon" className="bg-black/40 hover:bg-black/60 text-white" onClick={prev} aria-label="Previous image">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="secondary" size="icon" className="bg-black/40 hover:bg-black/60 text-white" onClick={next} aria-label="Next image">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white"
                onClick={() => setIndex(null)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
