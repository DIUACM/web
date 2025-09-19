import 'server-only'
import { apiFetch, PaginatedResponse, toURL } from '@/lib/api/http'

export type TrackerListItem = {
  title: string
  slug: string
  description: string
}

export type TrackerEvent = {
  id: number
  title: string
  starting_at: string
  strict_attendance?: boolean
}

export type TrackerUserEventStats = {
  event_id: number
  solve_count: number
  upsolve_count: number
  participation: boolean
}

export type TrackerUser = {
  name: string
  username: string
  student_id: string
  department: string
  profile_picture: string
  score: number
  event_stats: Record<string, TrackerUserEventStats | null>
}

export type TrackerDetail = {
  title: string
  slug: string
  description: string
  rank_lists: { keyword: string }[]
  selected_rank_list: {
    keyword: string
    consider_strict_attendance: boolean
    events: TrackerEvent[]
    users: TrackerUser[]
  }
}

export async function getTrackers(params: { page?: number }) {
  const url = toURL('/api/trackers', { page: params.page })
  return apiFetch<PaginatedResponse<TrackerListItem>>(url, {
    next: { revalidate: 300, tags: ['trackers', params.page ? `trackers:page:${params.page}` : 'trackers:page:1'] },
  })
}

export async function getTracker(slug: string, keyword?: string) {
  const url = toURL(`/api/trackers/${slug}`, { keyword })
  const tags = ['trackers', `trackers:slug:${slug}`]
  if (keyword) tags.push(`trackers:keyword:${keyword}`)
  return apiFetch<{ data: TrackerDetail }>(url, { next: { revalidate: 300, tags } })
}
