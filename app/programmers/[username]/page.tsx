import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, GraduationCap, MapPin, Target, Trophy, Users } from "lucide-react";
import { CopyButton } from "@/components/programmers/copy-button";
import { getProgrammer } from "@/lib/api/services/programmers";

// Types sourced from services

// Fetching handled via service with caching/tags

function formatContestDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

type Params = { username: string };

export async function generateStaticParams() {
  return [];
}
export const revalidate = 7200;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { username } = await params;
  try {
    const { data } = await getProgrammer(username);
    return {
      title: `${data.name} - Programmer Profile | DIU ACM`,
      description: `View ${data.name}'s programming profile, contest participations, and achievements at DIU ACM`,
    };
  } catch {
    return {
      title: "Programmer Not Found | DIU ACM",
      description: "The programmer profile you're looking for could not be found.",
    };
  }
}

export default async function ProgrammerDetailsPage({ params }: { params: Promise<Params> }) {
  const { username } = await params;
  let data;
  try {
    ({ data } = await getProgrammer(username));
  } catch (e: unknown) {
    if (typeof e === "object" && e && (e as { message?: string }).message === "NOT_FOUND") return notFound();
    throw e;
  }

  const initials = data.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const getRatingColor = (rating: number | null) => {
    if (!rating || rating === -1) return "bg-gray-500";
    if (rating >= 2400) return "bg-red-500";
    if (rating >= 2100) return "bg-orange-500";
    if (rating >= 1900) return "bg-purple-500";
    if (rating >= 1600) return "bg-blue-500";
    if (rating >= 1400) return "bg-cyan-500";
    if (rating >= 1200) return "bg-green-500";
    return "bg-gray-500";
  };

  const getRatingTitle = (rating: number | null) => {
    if (!rating || rating === -1) return "Unrated";
    if (rating >= 2400) return "International Grandmaster";
    if (rating >= 2300) return "Grandmaster";
    if (rating >= 2100) return "International Master";
    if (rating >= 1900) return "Candidate Master";
    if (rating >= 1600) return "Expert";
    if (rating >= 1400) return "Specialist";
    if (rating >= 1200) return "Pupil";
    return "Newbie";
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar className="w-24 h-24 sm:w-32 sm:h-32 ring-2 ring-slate-200 dark:ring-slate-700 shrink-0">
            <AvatarImage src={data.profile_picture || ""} alt={data.name} />
            <AvatarFallback className="text-xl sm:text-2xl font-semibold bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-slate-900 dark:text-white">{data.name}</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-3">@{data.username}</p>

            {typeof data.max_cf_rating === "number" && data.max_cf_rating > -1 && (
              <div className="mb-4">
                <Badge className={`${getRatingColor(data.max_cf_rating)} text-white text-sm px-3 py-1`}>
                  <Trophy className="w-4 h-4 mr-1" />
                  {data.max_cf_rating} • {getRatingTitle(data.max_cf_rating)}
                </Badge>
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300 mb-4 justify-center sm:justify-start">
              {data.student_id && (
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>{data.student_id}</span>
                </div>
              )}
              {data.department && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{data.department}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {data.codeforces_handle && (
                <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-1 text-sm">
                  <a
                    href={`https://codeforces.com/profile/${data.codeforces_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    CF: {data.codeforces_handle}
                  </a>
                  <CopyButton text={data.codeforces_handle} platform="Codeforces" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" />
                </div>
              )}

              {data.atcoder_handle && (
                <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 rounded-lg px-3 py-1 text-sm">
                  <a
                    href={`https://atcoder.jp/users/${data.atcoder_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    AC: {data.atcoder_handle}
                  </a>
                  <CopyButton text={data.atcoder_handle} platform="AtCoder" className="text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300" />
                </div>
              )}

              {data.vjudge_handle && (
                <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-1 text-sm">
                  <a
                    href={`https://vjudge.net/user/${data.vjudge_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    VJ: {data.vjudge_handle}
                  </a>
                  <CopyButton text={data.vjudge_handle} platform="VJudge" className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {Array.isArray(data.tracker_performance) && data.tracker_performance.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
            <Target className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
            Tracker Performance ({data.tracker_performance.length})
          </h2>

          <div className="space-y-6">
            {data.tracker_performance.map((tracker) => (
              <Card key={tracker.slug} className="transition-shadow hover:shadow-md">
                <CardContent>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium">{tracker.title}</h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tracker.ranklists.map((rankList) => (
                      <Link
                        key={rankList.keyword}
                        href={`/trackers/${tracker.slug}?keyword=${encodeURIComponent(rankList.keyword)}`}
                        className="block p-4 rounded-lg border transition-colors bg-muted/30 hover:bg-muted/50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{rankList.keyword}</h4>
                          <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                            #{rankList.user_position}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>Total Users</span>
                            </div>
                            <span className="font-medium text-foreground">{rankList.total_users}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Events</span>
                            </div>
                            <span className="font-medium text-foreground">{rankList.events_count}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Trophy className="w-4 h-4 text-amber-500" />
                              <span>Score</span>
                            </div>
                            <span className="font-medium text-amber-600 dark:text-amber-400">{rankList.user_score}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(data.contests) && data.contests.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Contest Participations ({data.contests.length})
          </h2>

          <div className="space-y-4">
            {data.contests.map((c) => (
              <Card key={c.id}>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{c.name}</h3>
                      {c.date && (
                        <p className="text-sm text-muted-foreground">{formatContestDate(c.date)}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                        {c.team_name}
                      </Badge>
                      {c.rank && (
                        <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
                          Rank #{c.rank}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-foreground/80 mb-3">Team Members ({c.members.length})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {c.members.map((m) => (
                        <Link key={m.username} href={`/programmers/${m.username}`} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <Avatar className="w-8 h-8 shrink-0">
                            <AvatarImage src={m.profile_picture || ""} alt={m.name} />
                            <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                              {m.name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate hover:text-blue-600 dark:hover:text-blue-400">
                              {m.name}
                            </p>
                            {m.student_id && (
                              <p className="text-xs text-muted-foreground">{m.student_id}</p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>

                    {c.solve_count !== null && (
                      <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">{c.solve_count} problems solved</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <Button asChild variant="ghost" className="px-2">
          <Link href="/programmers">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
      </div>
    </div>
  );
}
