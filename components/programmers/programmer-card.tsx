import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { ProgrammerListItem } from "@/lib/api/programmers";

function getCfRankClass(rating: number | null | undefined) {
  if (rating == null) return "text-slate-500";
  if (rating >= 2900) return "text-[#AA00AA]"; // Legendary Grandmaster
  if (rating >= 2600) return "text-red-600"; // Grandmaster
  if (rating >= 2400) return "text-red-500"; // International Grandmaster
  if (rating >= 2300) return "text-orange-500"; // International Master
  if (rating >= 2100) return "text-orange-400"; // Master
  if (rating >= 1900) return "text-yellow-500"; // Candidate Master
  if (rating >= 1600) return "text-blue-500"; // Expert
  if (rating >= 1400) return "text-cyan-600"; // Specialist
  if (rating >= 1200) return "text-green-600"; // Pupil
  return "text-slate-600"; // Newbie
}

export function ProgrammerCard({ user }: { user: ProgrammerListItem }) {
  return (
    <Link href={`/programmers/${user.username}`} className="block">
      <Card className="group overflow-hidden border-slate-200/70 dark:border-slate-800 hover:border-blue-300/60 dark:hover:border-blue-600/50 transition-colors">
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-1 ring-slate-200 dark:ring-slate-800">
              <AvatarImage src={user.profile_picture} alt={user.name || user.username} />
              <AvatarFallback className="text-sm">
                {(user.name || user.username)?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {user.name}
                  </h3>
                  <div className="mt-0.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-mono text-slate-500 truncate">@{user.username}</span>
                    {user.department && <span className="truncate">• {user.department}</span>}
                    {user.student_id && <span className="truncate">• {user.student_id}</span>}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                <span className="text-slate-700 dark:text-slate-300">Max CF rating:</span>
                <span className={`font-medium ${getCfRankClass(user.max_cf_rating)}`}>
                  {user.max_cf_rating ?? "N/A"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
