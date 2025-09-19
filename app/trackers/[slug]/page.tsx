import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, BarChart3, Info, Shield, TrendingUp, Users } from "lucide-react";

type TrackerEvent = {
  id: number;
  title: string;
  starting_at: string;
  strict_attendance?: boolean;
};

type TrackerUserEventStats = {
  event_id: number;
  solve_count: number;
  upsolve_count: number;
  participation: boolean;
};

type TrackerUser = {
  name: string;
  username: string;
  student_id: string;
  department: string;
  profile_picture: string;
  score: number;
  event_stats: Record<string, TrackerUserEventStats | null>;
};

type TrackerDetail = {
  title: string;
  slug: string;
  description: string;
  rank_lists: { keyword: string }[];
  selected_rank_list: {
    keyword: string;
    consider_strict_attendance: boolean;
    events: TrackerEvent[];
    users: TrackerUser[];
  };
};

import { getTracker } from "@/lib/api/services/trackers";

type Params = { slug: string };

type RawSearchParams = Record<string, string | string[] | undefined> & {
  keyword?: string;
};

export default async function TrackerDetailsPage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<RawSearchParams> }) {
  const { slug } = await params;
  const sp = await searchParams;
  const get = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
  const keyword = get(sp.keyword);

  let data;
  try {
    ({ data } = await getTracker(slug, keyword));
  } catch (e: unknown) {
    if (typeof e === "object" && e && (e as { message?: string }).message === "NOT_FOUND") return notFound();
    throw e;
  }

  const rank = data.selected_rank_list;

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" className="px-2">
          <Link href="/trackers">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{data.title}</h1>
        {data.description && (
          <p className="mt-2 text-slate-600 dark:text-slate-300">{data.description}</p>
        )}
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-4">
            {data.rank_lists?.length > 1 && (
              <div>
                <h3 className="mb-3 text-lg font-semibold">Available Rankings</h3>
                <div className="flex flex-wrap gap-2">
                  {data.rank_lists.map((rl) => {
                    const isActive = rl.keyword === rank.keyword;
                    const href = `?keyword=${encodeURIComponent(rl.keyword)}`;
                    return (
                      <Button
                        asChild
                        key={rl.keyword}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className={isActive ? "bg-blue-600 hover:bg-blue-700" : ""}
                      >
                        <Link href={href}>{rl.keyword}</Link>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="gap-1.5">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users:</span>
                {rank.users.length}
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Events:</span>
                {rank.events.length}
              </Badge>
              {rank.consider_strict_attendance && (
                <Badge
                  variant="outline"
                  className="gap-1.5 border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Strict Attendance</span>
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6 mt-6">
        <div className="mb-2 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          <h2 className="text-xl font-semibold">Rankings</h2>
        </div>

        {rank.users.length === 0 || rank.events.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 py-12 text-center dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mx-auto mb-4 h-16 w-16 text-slate-400 dark:text-slate-500">
              <BarChart3 className="h-full w-full" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-slate-700 dark:text-slate-300">No data available</h3>
            <p className="text-slate-600 dark:text-slate-400">This ranklist doesn’t have any data to display yet.</p>
          </div>
        ) : (
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
                      Rank
                    </th>
                    <th className="sticky left-16 z-10 bg-slate-50 px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Score
                    </th>
                    {rank.events.map((ev) => (
                      <th key={ev.id} className="min-w-48 px-4 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                        <div className="space-y-1">
                          <div className="block truncate text-xs font-semibold text-blue-600 dark:text-blue-400" title={ev.title}>
                            {ev.title.length > 30 ? `${ev.title.substring(0, 30)}...` : ev.title}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(ev.starting_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                            {rank.consider_strict_attendance && ev.strict_attendance && (
                              <Badge
                                variant="outline"
                                className="border-orange-200 bg-orange-50 text-xs text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                                title="Strict attendance enforced"
                              >
                                <Shield className="mr-1 h-3 w-3" /> SA
                              </Badge>
                            )}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
                  {rank.users.map((u, index) => (
                    <tr key={u.username} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="sticky left-0 z-10 bg-white px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700/50">
                        {index + 1}
                      </td>
                      <td className="sticky left-16 z-10 bg-white px-4 py-3 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/50">
                        <div className="flex items-center gap-3 group">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={u.profile_picture || ""} alt={u.name} />
                            <AvatarFallback className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                              {u.name?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {u.name?.length > 20 ? `${u.name.substring(0, 20)}...` : u.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                        {u.score.toFixed(1)}
                      </td>
                      {rank.events.map((ev) => (
                        <td key={ev.id}>
                          <StatCell stat={u.event_stats?.[String(ev.id)] ?? null} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-blue-200/50 bg-blue-50/50 p-4 dark:border-blue-800/50 dark:bg-blue-900/20">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div className="text-sm">
              <h4 className="mb-2 font-semibold">Scoring Information</h4>
              <div className="space-y-2 text-slate-600 dark:text-slate-400">
                <p>• Scores are calculated based on solve performance and upsolve counts</p>
                <p>• Rankings are sorted by total score in descending order</p>
                {rank.consider_strict_attendance && (
                  <p>• <span className="font-medium text-orange-600 dark:text-orange-400">Strict Attendance:</span> Events marked with &ldquo;SA&rdquo; require
                    attendance. Users without attendance will have their solves counted as upsolves only.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCell({ stat }: { stat: { solve_count: number; upsolve_count: number; participation: boolean } | null }) {
  if (stat === null) {
    return (
      <div className="px-4 py-3">
        <Badge variant="secondary" className="text-xs">
          No data
        </Badge>
      </div>
    );
  }
  const { solve_count, upsolve_count, participation } = stat;
  return (
    <div className="px-4 py-3">
      <div className="flex flex-wrap gap-2">
        {!participation ? (
          <Badge
            variant="outline"
            className="border-red-200 bg-red-50 text-xs text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
          >
            Absent
          </Badge>
        ) : (
          <>
            <Badge
              variant="outline"
              className="border-green-200 bg-green-50 text-xs text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
            >
              {solve_count} Solve{solve_count !== 1 ? "s" : ""}
            </Badge>
            {upsolve_count > 0 && (
              <Badge variant="secondary" className="text-xs">
                {upsolve_count} Upsolve{upsolve_count !== 1 ? "s" : ""}
              </Badge>
            )}
          </>
        )}
      </div>
    </div>
  );
}
