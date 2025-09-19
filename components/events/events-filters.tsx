"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCallback, useState, useEffect } from "react";

export function EventsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const type = searchParams.get("type") || "";
  const scope = searchParams.get("participation_scope") || "";

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null || v === "") params.delete(k);
        else params.set(k, v);
      });
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateParams({ search });
          }}
        />
      </div>
      <Select
        value={type}
        onValueChange={(v) => updateParams({ type: v === "all" ? "" : v })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="contest">Contest</SelectItem>
          <SelectItem value="class">Class</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={scope}
        onValueChange={(v) =>
          updateParams({ participation_scope: v === "all" ? "" : v })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Participation Scope" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Scopes</SelectItem>
          <SelectItem value="open_for_all">Open for All</SelectItem>
          <SelectItem value="only_girls">Only Girls</SelectItem>
          <SelectItem value="junior_programmers">Junior Programmers</SelectItem>
          <SelectItem value="selected_persons">Selected Persons</SelectItem>
        </SelectContent>
      </Select>

      {/* hidden submit trigger on mobile */}
      <button
        className="hidden"
        onClick={() => updateParams({ search })}
        aria-hidden
      />
    </div>
  );
}
