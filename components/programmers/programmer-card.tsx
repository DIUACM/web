import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Star } from "lucide-react";
import { ProgrammerListItem } from "@/lib/api/programmers";

export function ProgrammerCard({ user }: { user: ProgrammerListItem }) {
  return (
    <Link href={`/programmers/${user.username}`} className="block">
      <Card className="group overflow-hidden border-slate-200/70 dark:border-slate-800 hover:border-blue-300/60 dark:hover:border-blue-600/50 transition-colors">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.profile_picture} alt={user.name} />
              <AvatarFallback>{user.name?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {user.name}
                </h3>
                <ArrowRight className="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <span className="font-mono text-slate-500">@{user.username}</span>
                {user.department && <span>• {user.department}</span>}
                {user.student_id && <span>• {user.student_id}</span>}
              </div>
              <div className="mt-1 text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" />
                <span>Max CF rating: {user.max_cf_rating ?? "N/A"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
