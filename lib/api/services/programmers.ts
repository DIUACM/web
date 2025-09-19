import 'server-only'
import { apiFetch, PaginatedResponse, toURL } from '@/lib/api/http'

export type ProgrammerListItem = {
  name: string
  username: string
  student_id: string | null
  department: string | null
  profile_picture: string
  max_cf_rating: number | null
}

export type ContestMember = {
  name: string
  username: string
  student_id: string | null
  department: string | null
  profile_picture: string
}

export type ProgrammerContest = {
  id: number
  name: string
  date: string
  team_name: string
  rank: number | null
  solve_count: number | null
  members: ContestMember[]
}

export type TrackerRanklistPerformance = {
  keyword: string
  total_users: number
  events_count: number
  user_score: number
  user_position: number
}

export type ProgrammerDetail = {
  name: string
  username: string
  student_id: string | null
  department: string | null
  profile_picture: string
  max_cf_rating: number | null
  codeforces_handle: string | null
  atcoder_handle: string | null
  vjudge_handle: string | null
  contests: ProgrammerContest[]
  tracker_performance: { title: string; slug: string; ranklists: TrackerRanklistPerformance[] }[]
}

export async function getProgrammers(params: { search?: string; page?: number }) {
  const url = toURL('/api/programmers', { search: params.search, page: params.page })
  const tags = ['programmers']
  if (params.page) tags.push(`programmers:page:${params.page}`)
  if (params.search) tags.push(`programmers:search:${params.search}`)
  return apiFetch<PaginatedResponse<ProgrammerListItem>>(url, { next: { revalidate: 300, tags } })
}

export async function getProgrammer(username: string) {
  const url = toURL(`/api/programmers/${username}`)
  return apiFetch<{ data: ProgrammerDetail }>(url, { next: { revalidate: 3600, tags: ['programmers', `programmers:username:${username}`] } })
}
