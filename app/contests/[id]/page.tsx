import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, LinkIcon, MapPin, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchContest, humanizeContestType } from "@/lib/api/contests";
import { fetchGallery } from "@/lib/api/galleries";
import { Separator } from "@/components/ui/separator";

type Params = { id: string };

export default async function ContestDetailsPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  let data;
  let galleryMedia: { url: string }[] | null = null;
  try {
    ({ data } = await fetchContest(id));
    if (data.gallery?.slug) {
      try {
        const { data: g } = await fetchGallery(data.gallery.slug);
        galleryMedia = g.media || [];
      } catch {
        galleryMedia = null;
      }
    }
  } catch (e: unknown) {
    if (typeof e === "object" && e && (e as { message?: string }).message === "NOT_FOUND") return notFound();
    throw e;
  }

  const formatDateOnly = (iso?: string | null) => {
    if (!iso) return "TBD";
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d);
  };

  const stats = (() => {
    const teamCount = data.teams?.length || 0;
    const bestRank = data.teams.reduce((min, t) => (t.rank != null ? Math.min(min, t.rank) : min), Infinity);
    const bestRankVal = Number.isFinite(bestRank) ? bestRank : null;
    return { teamCount, bestRank: bestRankVal };
  })();

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4 flex items-center gap-3">
        <Button asChild variant="ghost" className="px-2">
          <Link href="/contests">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden mb-6">
        <div className="relative">
      
          <div className="px-6 pb-6  relative">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                    {humanizeContestType(data.contest_type)}
                  </Badge>
                  {data.location && (
                    <Badge variant="outline" className="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      {data.location}
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{data.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center"><Calendar className="w-4 h-4 mr-1" />{formatDateOnly(data.date)}</span>
                  {data.gallery && (
                    <Link href={`/galleries/${data.gallery.slug}`} className="inline-flex items-center hover:underline text-cyan-600 dark:text-cyan-300">
                      Gallery: {data.gallery.title}
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {data.gallery?.slug && (
                  <Button asChild variant="secondary">
                    <Link href={`/galleries/${data.gallery.slug}`}>Open Gallery</Link>
                  </Button>
                )}
                {data.standings_url && (
                  <Button asChild>
                    <Link href={data.standings_url} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="w-4 h-4 mr-1" /> View Standings
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <CardContent>
          {data.description && (
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p>{data.description}</p>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border p-4 bg-muted/30">
              <div className="text-sm text-muted-foreground">Teams</div>
              <div className="mt-1 flex items-center gap-2">
                <Users className="w-4 h-4 text-foreground/80" />
                <div className="text-xl font-semibold">{stats.teamCount}</div>
              </div>
            </div>
            <div className="rounded-lg border p-4 bg-muted/30">
              <div className="text-sm text-muted-foreground">Best Rank</div>
              <div className="mt-1 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <div className="text-xl font-semibold">{stats.bestRank ?? "N/A"}</div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-500" /> Teams & Results
            </h2>
            {data.teams.length === 0 ? (
              <p className="text-slate-500">No teams recorded.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.teams.map((team) => (
                  <Card key={team.id} className="transition-shadow hover:shadow-md">
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-foreground">{team.name}</h3>
                        <div className="flex items-center gap-2">
                          {team.rank != null && (
                            <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">Rank #{team.rank}</Badge>
                          )}
                          {team.solve_count != null && (
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">{team.solve_count} solves</Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {team.members.map((m) => {
                          const fallback = m.name?.charAt(0) || "?";
                          return (
                            <Link key={`${team.id}-${m.username}`} href={`/programmers/${m.username}`} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                              <Avatar className="w-9 h-9">
                                <AvatarImage src={m.profile_picture || ""} alt={m.name} />
                                <AvatarFallback className="text-xs">{fallback}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="font-medium truncate hover:text-blue-600 dark:hover:text-blue-400">{m.name}</div>
                                <div className="text-xs text-muted-foreground truncate">@{m.username}{m.department ? ` • ${m.department}` : ""}</div>
                                {m.student_id && (
                                  <div className="text-[11px] text-muted-foreground truncate">ID: {m.student_id}</div>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {galleryMedia && galleryMedia.length > 0 && (
              <div className="mt-10">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Photos</h3>
                  {data.gallery?.slug && (
                    <Link href={`/galleries/${data.gallery.slug}`} className="text-sm text-blue-600 hover:underline">
                      View all
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {galleryMedia.slice(0, 6).map((m, i) => (
                    <Link key={i} href={data.gallery?.slug ? `/galleries/${data.gallery.slug}` : "#"} className="group block">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted/30">
                        <Image
                          src={m.url}
                          alt={`Photo ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-2">
        <Button asChild variant="ghost" className="px-2">
          <Link href="/contests">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
      </div>
    </section>
  );
}
