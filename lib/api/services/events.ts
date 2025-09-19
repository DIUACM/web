import 'server-only'
import { apiFetch, PaginatedResponse, toURL } from '@/lib/api/http'

export type EventListItem = {
  id: number
  title: string
  starting_at: string
  ending_at: string
  participation_scope: string
  event_type: string
  attendance_count?: number
}

export type EventDetail = {
  id: number
  title: string
  description?: string
  type: string
  status: string
  starting_at: string
  ending_at: string
  participation_scope: string
  event_link?: string
  open_for_attendance?: boolean
  user_stats?: {
    name: string
    username: string
    student_id: string
    department: string
    profile_picture: string
    solve_count: number
    upsolve_count: number
    participation: boolean
  }[]
  attendees?: {
    name: string
    username: string
    student_id: string
    department: string
    profile_picture: string
    attendance_time: string
  }[]
}

export async function getEvents(params: { search?: string; type?: string; participation_scope?: string; page?: number }) {
  const url = toURL('/api/events', {
    search: params.search,
    type: params.type,
    participation_scope: params.participation_scope,
    page: params.page,
  })
  const tags = ['events']
  if (params.page) tags.push(`events:page:${params.page}`)
  if (params.type) tags.push(`events:type:${params.type}`)
  if (params.participation_scope) tags.push(`events:scope:${params.participation_scope}`)
  if (params.search) tags.push(`events:search:${params.search}`)
  return apiFetch<PaginatedResponse<EventListItem>>(url, { next: { revalidate: 300, tags } })
}

export async function getEvent(id: number | string) {
  const url = toURL(`/api/events/${id}`)
  return apiFetch<{ data: EventDetail }>(url, { next: { revalidate: 300, tags: ['events', `events:id:${id}`] } })
}
