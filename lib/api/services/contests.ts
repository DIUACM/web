import 'server-only'
import { apiFetch, PaginatedResponse, toURL } from '@/lib/api/http'

export type ContestListItem = {
  id: number
  name: string
  contest_type: string
  location: string | null
  date: string | null
  best_rank: number | null
}

export type ContestTeamMember = {
  name: string
  username: string
  student_id: string | null
  department: string | null
  profile_picture: string
}

export type ContestTeam = {
  id: number
  name: string
  rank: number | null
  solve_count: number | null
  members: ContestTeamMember[]
}

export type ContestDetail = {
  id: number
  name: string
  contest_type: string
  location: string | null
  date: string | null
  description: string | null
  standings_url: string | null
  gallery: { title: string; slug: string; cover_image: string } | null
  teams: ContestTeam[]
}

export async function getContests(params: { page?: number }) {
  const url = toURL('/api/contests', { page: params.page })
  return apiFetch<PaginatedResponse<ContestListItem>>(url, {
    next: { revalidate: 300, tags: ['contests', params.page ? `contests:page:${params.page}` : 'contests:page:1'] },
  })
}

export async function getContest(id: number | string) {
  const url = toURL(`/api/contests/${id}`)
  return apiFetch<{ data: ContestDetail }>(url, { 
    next: { revalidate: 300, tags: ['contests', `contests:id:${id}`] } 
  })
}
