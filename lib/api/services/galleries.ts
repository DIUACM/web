import 'server-only'
import { apiFetch, PaginatedResponse, toURL } from '@/lib/api/http'

export type GalleryListItem = {
  title: string
  slug: string
  cover_image: string
  media_count: number
}

export type GalleryDetail = {
  title: string
  slug: string
  description: string | null
  media: { url: string }[]
}

export async function getGalleries(params: { page?: number }) {
  const url = toURL('/api/galleries', { page: params.page })
  return apiFetch<PaginatedResponse<GalleryListItem>>(url, {
    next: { revalidate: 600, tags: ['galleries', params.page ? `galleries:page:${params.page}` : 'galleries:page:1'] },
  })
}

export async function getGallery(slug: string) {
  const url = toURL(`/api/galleries/${slug}`)
  return apiFetch<{ data: GalleryDetail }>(url, { next: { revalidate: 600, tags: ['galleries', `galleries:slug:${slug}`] } })
}
