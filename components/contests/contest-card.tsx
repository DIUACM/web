import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, MapPin, Medal } from "lucide-react";
import { ContestListItem, formatContestDate, humanizeContestType } from "@/lib/api/contests";

export function ContestCard({ item }: { item: ContestListItem }) {
  return (
    <Link href={`/contests/${item.id}`} className="block">
      <Card className="group overflow-hidden border-slate-200/70 dark:border-slate-800 hover:border-blue-300/60 dark:hover:border-blue-600/50 transition-colors">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 truncate">
                {item.name}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  {formatContestDate(item.date)}
                </span>
                {item.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-cyan-500" />
                    {item.location}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {humanizeContestType(item.contest_type)}
                </Badge>
                {typeof item.best_rank === "number" && (
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1">
                    <Medal className="h-3.5 w-3.5" /> Best Rank: {item.best_rank}
                  </Badge>
                )}
              </div>
            </div>

            <ArrowRight className="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
