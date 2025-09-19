"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useCallback, useEffect, useState } from "react";
import { Filter, Tag, X, Search as SearchIcon, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const EVENT_TYPES = [
  { id: "contest", name: "Contest", icon: "🏆" },
  { id: "class", name: "Class", icon: "📚" },
  { id: "other", name: "Other", icon: "📋" },
];

const ATTENDANCE_SCOPES = [
  { id: "open_for_all", name: "Open for All", icon: "👥" },
  { id: "only_girls", name: "Only Girls", icon: "👩" },
  { id: "junior_programmers", name: "Junior Programmers", icon: "🌱" },
  { id: "selected_persons", name: "Selected Persons", icon: "✨" },
];

export function EventsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");

  const hasActiveFilters = !!(
    searchParams.get("type") ||
    searchParams.get("participation_scope") ||
    searchParams.get("search")
  );

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      if (value === null) params.delete(name);
      else params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = createQueryString("search", searchQuery || null);
    router.push(`${pathname}?${qs}`);
  };

  const handleSelectChange = (name: "type" | "participation_scope", value: string | null) => {
    const qs = createQueryString(name, value);
    router.push(`${pathname}?${qs}`);
  };

  useEffect(() => {
    const s = searchParams.get("search");
    setSearchQuery(s || "");
  }, [searchParams]);

  const clearAllFilters = () => {
    router.push(pathname);
    setSearchQuery("");
  };

  return (
    <div>
      <Card className="border-slate-200 dark:border-slate-700 mb-4">
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:flex-1">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 w-full"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <SearchIcon className="h-4 w-4" />
                  </button>
                </form>
              </div>

              <div className="flex flex-wrap gap-2">
                <Select
                  value={searchParams.get("type") || "all"}
                  onValueChange={(value) => handleSelectChange("type", value === "all" ? null : value)}
                >
                  <SelectTrigger className="w-[160px] md:w-[180px]">
                    <div className="flex items-center overflow-hidden">
                      <Tag className="mr-2 h-4 w-4 flex-shrink-0 text-slate-500" />
                      <SelectValue className="truncate" placeholder="Event Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    <SelectItem value="all">All Event Types</SelectItem>
                    {EVENT_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id} className="truncate">
                        <span className="flex items-center max-w-full">
                          <span className="mr-1">{type.icon}</span>
                          <span className="truncate">{type.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={searchParams.get("participation_scope") || "all"}
                  onValueChange={(value) => handleSelectChange("participation_scope", value === "all" ? null : value)}
                >
                  <SelectTrigger className="w-[160px] md:w-[180px]">
                    <div className="flex items-center overflow-hidden">
                      <Users className="mr-2 h-4 w-4 flex-shrink-0 text-slate-500" />
                      <SelectValue className="truncate" placeholder="Scope" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    <SelectItem value="all">All Scopes</SelectItem>
                    {ATTENDANCE_SCOPES.map((scope) => (
                      <SelectItem key={scope.id} value={scope.id} className="truncate">
                        <span className="flex items-center max-w-full">
                          <span className="mr-1">{scope.icon}</span>
                          <span className="truncate">{scope.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center mr-1">
                <Filter className="mr-1 h-3 w-3" />
                Filters:
              </span>

              {searchParams.get("search") && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {`"${searchParams.get("search")}"`}
                </Badge>
              )}

              {searchParams.get("type") && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {EVENT_TYPES.find((c) => c.id === searchParams.get("type"))?.name || "Unknown"}
                </Badge>
              )}

              {searchParams.get("participation_scope") && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
                  {ATTENDANCE_SCOPES.find((s) => s.id === searchParams.get("participation_scope"))?.name || "Unknown"}
                </Badge>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-7 text-xs py-1 px-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              title="Clear all filters"
            >
              <X className="mr-1 h-3 w-3" />
              Clear all
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
