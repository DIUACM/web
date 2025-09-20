"use client";

import { ApiError } from "@/lib/utils";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export function toURL(
  path: string,
  params?: Record<string, string | number | undefined | null>
) {
  const url = new URL(path, API_BASE_URL);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && String(v).length > 0)
        url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

type NextOptions = { next?: { revalidate?: number | false; tags?: string[] } };

export async function apiFetchClient<T>(
  input: string,
  init?: RequestInit & NextOptions
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    let errorBody: unknown = undefined;
    try {
      errorBody = await res.json();
    } catch {
      // ignore
    }
    const message =
      (errorBody as ApiError)?.message || `${res.status} ${res.statusText}` || "Request failed";
    const err = new Error(message) as Error & { status?: number; body?: unknown };
    err.status = res.status;
    err.body = errorBody;
    throw err;
  }
  return res.json() as Promise<T>;
}
