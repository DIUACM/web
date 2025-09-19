import 'server-only'
import { apiFetch, PaginatedResponse, toURL } from '@/lib/api/http'

export type BlogPostListItem = {
  title: string
  slug: string
  excerpt: string
  published_at: string
  featured_image?: string | null
  author?: string | null
}

export type BlogPostDetail = {
  title: string
  slug: string
  content: string
  published_at: string
  is_featured: boolean
  author: string
  featured_image: string
}

export async function getBlogPosts(params: { page?: number }) {
  const url = toURL('/api/blog-posts', { page: params.page })
  return apiFetch<PaginatedResponse<BlogPostListItem>>(url, {
    next: { revalidate: 300, tags: ['blogs', params.page ? `blogs:page:${params.page}` : 'blogs:page:1'] },
  })
}

export async function getBlogPost(slug: string) {
  const url = toURL(`/api/blog-posts/${slug}`)
  return apiFetch<{ data: BlogPostDetail }>(url, {
    next: { revalidate: 300, tags: ['blogs', `blogs:slug:${slug}`] },
  })
}
