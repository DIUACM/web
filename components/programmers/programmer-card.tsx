import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export type ProgrammerListItem = {
  name: string;
  username: string;
  student_id: string | null;
  department: string | null;
  profile_picture: string;
  max_cf_rating: number | null;
};

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

function getCfRankName(rating: number | null | undefined) {
  if (rating == null) return "Unrated";
  if (rating >= 2900) return "Legendary Grandmaster";
  if (rating >= 2600) return "Grandmaster";
  if (rating >= 2400) return "International Grandmaster";
  if (rating >= 2300) return "International Master";
  if (rating >= 2100) return "Master";
  if (rating >= 1900) return "Candidate Master";
  if (rating >= 1600) return "Expert";
  if (rating >= 1400) return "Specialist";
  if (rating >= 1200) return "Pupil";
  return "Newbie";
}

export function ProgrammerCard({ user }: { user: ProgrammerListItem }) {
  return (
    <Link href={`/programmers/${user.username}`} className="block group">
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600">
        <CardContent className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10 ring-1 ring-slate-200 dark:ring-slate-700">
              <AvatarImage src={user.profile_picture} alt={user.name || user.username} />
              <AvatarFallback className="text-sm font-medium">
                {(user.name || user.username)?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {user.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                @{user.username}
              </p>
            </div>
          </div>

          {(user.department || user.student_id) && (
            <div className="space-y-1 mb-3 text-xs text-slate-600 dark:text-slate-400">
              {user.department && <div>{user.department}</div>}
              {user.student_id && <div>ID: {user.student_id}</div>}
            </div>
          )}

          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-1">
                  CF Rating
                </div>
                <div className={`text-lg font-bold ${getCfRankClass(user.max_cf_rating)}`}>
                  {user.max_cf_rating ?? "N/A"}
                </div>
              </div>
              {user.max_cf_rating && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  {getCfRankName(user.max_cf_rating)}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
