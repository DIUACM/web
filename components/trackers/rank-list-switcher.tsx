"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function RankListSwitcher({ keywords }: { keywords: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("keyword") || keywords[0] || "";

  const onValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete("keyword");
    else params.set("keyword", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  if (!keywords.length) return null;

  return (
    <Tabs value={current} onValueChange={onValueChange} className="w-full overflow-x-auto">
      <TabsList>
        {keywords.map((k) => (
          <TabsTrigger key={k} value={k} className="whitespace-nowrap">
            {k}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
