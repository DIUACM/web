"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function ProgrammersSearch({ initialSearch }: { initialSearch: string }) {
  const [value, setValue] = useState(initialSearch);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Debounce value
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), 400);
    return () => clearTimeout(t);
  }, [value]);

  const updateQuery = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (q) {
        params.set("search", q);
        params.set("page", "1");
      } else {
        params.delete("search");
        params.set("page", "1");
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    if (debounced !== initialSearch) {
      updateQuery(debounced);
    }
  }, [debounced, initialSearch, updateQuery]);

  const clearable = useMemo(() => value.length > 0, [value]);

  return (
    <div className="relative max-w-xl">
      <Input
        placeholder="Search by name or username..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pr-10"
      />
      {clearable && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Clear"
          onClick={() => setValue("")}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-500"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
