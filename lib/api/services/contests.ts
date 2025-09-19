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

export async function getContests(params: { page?: number }) {
  const url = toURL('/api/contests', { page: params.page })
  return apiFetch<PaginatedResponse<ContestListItem>>(url, {
    next: { revalidate: 300, tags: ['contests', params.page ? `contests:page:${params.page}` : 'contests:page:1'] },
  })
}
