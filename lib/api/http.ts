import 'server-only'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export type Links = {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export type Meta = {
  current_page: number
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
}

export type PaginatedResponse<T> = {
  data: T[]
  links: Links
  meta: Meta
}

export class HttpError extends Error {
  status: number
  bodyText?: string
  constructor(status: number, message?: string, bodyText?: string) {
    super(message || `HTTP ${status}`)
    this.status = status
    this.bodyText = bodyText
  }
}

export function toURL(path: string, params?: Record<string, string | number | undefined | null>) {
  const url = new URL(path, API_BASE_URL)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && String(v).length > 0) url.searchParams.set(k, String(v))
    }
  }
  return url
}

type NextOptions = { next?: { revalidate?: number | false; tags?: string[] } }

export async function apiFetch<T>(
  input: string | URL,
  init?: RequestInit & NextOptions,
): Promise<T> {
  const url = typeof input === 'string' ? input : input.toString()
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => undefined)
    throw new HttpError(res.status, `Request failed: ${res.status} ${res.statusText}`, text)
  }
  return res.json() as Promise<T>
}
