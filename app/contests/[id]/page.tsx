import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, LinkIcon, MapPin, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchContest, formatContestDate, humanizeContestType } from "@/lib/api/contests";
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
      } catch (_) {
        galleryMedia = null;
      }
    }
  } catch (e: any) {
    if (e?.message === "NOT_FOUND") return notFound();
    throw e;
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4 flex items-center gap-3">
        <Button asChild variant="ghost" className="px-2">
          <Link href="/contests">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {data.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300 mb-6">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {formatContestDate(data.date)}
            </div>
            {data.location && (
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                {data.location}
              </div>
            )}
            <span className="rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 text-xs">
              {humanizeContestType(data.contest_type)}
            </span>
            {data.standings_url && (
              <Link href={data.standings_url} target="_blank" className="inline-flex items-center text-blue-600 hover:underline">
                <LinkIcon className="mr-1 h-4 w-4" /> Standings
              </Link>
            )}
            {data.gallery && (
              <Link href={`/galleries/${data.gallery.slug}`} className="inline-flex items-center text-cyan-600 hover:underline">
                Gallery: {data.gallery.title}
              </Link>
            )}
          </div>

          {data.description && (
            <Card className="mb-6">
              <CardContent className="p-5">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p>{data.description}</p>
                </div>
              </CardContent>
            </Card>
          )}

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
                  <Card key={team.id} className="overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{team.name}</h3>
                          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            {team.rank != null && <span className="mr-3">Rank: {team.rank}</span>}
                            {team.solve_count != null && <span>Solves: {team.solve_count}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {team.members.map((m, idx) => (
                          <div key={`${team.id}-${m.username}-${idx}`} className="flex items-center gap-3 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                            {m.profile_picture && (
                              <div className="relative h-10 w-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                                <Image src={m.profile_picture} alt={m.name} fill className="object-cover" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-medium text-slate-900 dark:text-white truncate">{m.name}</div>
                              <div className="text-xs text-slate-500 truncate">@{m.username}{m.department ? ` • ${m.department}` : ""}</div>
                              {m.student_id && (
                                <div className="text-xs text-slate-500 truncate">ID: {m.student_id}</div>
                              )}
                            </div>
                          </div>
                        ))}
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
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
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
        </div>
      </div>
    </section>
  );
}
