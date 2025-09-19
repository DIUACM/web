import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDateRange, humanizeScope, humanizeType } from "@/components/events/event-card";

type EventUserStats = {
  name: string;
  username: string;
  student_id: string;
  department: string;
  profile_picture: string;
  solve_count: number;
  upsolve_count: number;
  participation: boolean;
};

type EventAttendee = {
  name: string;
  username: string;
  student_id: string;
  department: string;
  profile_picture: string;
  attendance_time: string;
};

type EventDetail = {
  id: number;
  title: string;
  description?: string;
  type: string;
  status: string;
  starting_at: string;
  ending_at: string;
  participation_scope: string;
  event_link?: string;
  open_for_attendance?: boolean;
  user_stats?: EventUserStats[];
  attendees?: EventAttendee[];
};

const DEFAULT_BASE_URL = "http://localhost:8000";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;

async function fetchEvent(id: number | string): Promise<{ data: EventDetail }> {
  const url = new URL(`/api/events/${id}`, API_BASE_URL);
  const res = await fetch(url.toString(), { 
    cache: "no-store",
    headers: {
      "Accept": "application/json"
    }
  });
  if (res.status === 404) {
    throw new Error("NOT_FOUND");
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch event: ${res.status}`);
  }
  return res.json();
}

function humanizeStatus(v?: string) {
  switch (v) {
    case "published":
      return "Published";
    case "draft":
      return "Draft";
    case "archived":
      return "Archived";
    default:
      return v || "";
  }
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

type Params = { id: string };

export default async function EventDetailsPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  let data;
  try {
    ({ data } = await fetchEvent(id));
  } catch (e: unknown) {
    if (typeof e === "object" && e && (e as { message?: string }).message === "NOT_FOUND") return notFound();
    throw e;
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" className="px-2">
          <Link href="/events">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{data.title}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            {formatDateRange(data.starting_at, data.ending_at)}
          </span>
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {humanizeType(data.type)}
          </Badge>
          <Badge variant="outline" className="border-slate-300 dark:border-slate-700">
            {humanizeScope(data.participation_scope)}
          </Badge>
          <Badge variant="outline" className="border-slate-300 dark:border-slate-700">
            {humanizeStatus(data.status)}
          </Badge>
        </div>
      </div>

      {data.event_link && (
        <div className="mb-6">
          <Button asChild variant="outline">
            <a href={data.event_link} target="_blank" rel="noopener noreferrer">
              Open Event Link <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>
      )}

      <Card className="border-slate-200/70 dark:border-slate-800">
        <CardContent className="p-5 sm:p-6">
          {data.description ? (
            <div className="prose dark:prose-invert max-w-none">
              <p>{data.description}</p>
            </div>
          ) : (
            <p className="text-slate-500">No description provided.</p>
          )}
        </CardContent>
      </Card>

      {((Array.isArray(data.user_stats) && data.user_stats.length > 0) ||
        (Array.isArray(data.attendees) && data.attendees.length > 0)) && (
        <div className="mt-8">
          <Tabs
            defaultValue={
              Array.isArray(data.user_stats) && data.user_stats.length > 0
                ? "stats"
                : "attendees"
            }
          >
            <TabsList>
              {Array.isArray(data.user_stats) && data.user_stats.length > 0 && (
                <TabsTrigger value="stats">
                  User Stats ({data.user_stats.length})
                </TabsTrigger>
              )}
              {Array.isArray(data.attendees) && data.attendees.length > 0 && (
                <TabsTrigger value="attendees">
                  Attendees ({data.attendees.length})
                </TabsTrigger>
              )}
            </TabsList>

            {Array.isArray(data.user_stats) && data.user_stats.length > 0 && (
              <TabsContent value="stats" className="mt-4">
                <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-2 sm:p-3 shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Solved</TableHead>
                        <TableHead className="text-right">Upsolved</TableHead>
                        <TableHead>Participation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.user_stats.map((u, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={u.profile_picture} alt={u.name} />
                                <AvatarFallback>{u.name?.[0] || "?"}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="font-medium truncate">{u.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-300">{u.username}</TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-300">{u.student_id}</TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-300">{u.department}</TableCell>
                          <TableCell className="text-right">{u.solve_count}</TableCell>
                          <TableCell className="text-right">{u.upsolve_count}</TableCell>
                          <TableCell>{u.participation ? "Yes" : "No"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            )}

            {Array.isArray(data.attendees) && data.attendees.length > 0 && (
              <TabsContent value="attendees" className="mt-4">
                <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-2 sm:p-3 shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Attendance Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.attendees.map((u, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={u.profile_picture} alt={u.name} />
                                <AvatarFallback>{u.name?.[0] || "?"}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="font-medium truncate">{u.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-300">{u.username}</TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-300">{u.student_id}</TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-300">{u.department}</TableCell>
                          <TableCell>{formatTime(u.attendance_time)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      )}
    </section>
  );
}
