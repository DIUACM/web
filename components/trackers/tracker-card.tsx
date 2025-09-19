import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ListOrdered } from "lucide-react";

export type TrackerListItem = {
  title: string;
  slug: string;
  description: string;
};

export function TrackerCard({ tracker }: { tracker: TrackerListItem }) {
  return (
    <Link href={`/trackers/${tracker.slug}`} className="block">
      <Card className="group overflow-hidden border-slate-200/70 dark:border-slate-800 hover:border-blue-300/60 dark:hover:border-blue-600/50 transition-colors">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 truncate flex items-center gap-2">
                <ListOrdered className="h-5 w-5 text-blue-500" /> {tracker.title}
              </h3>
              {tracker.description && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                  {tracker.description}
                </p>
              )}
            </div>
            <ArrowRight className="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
