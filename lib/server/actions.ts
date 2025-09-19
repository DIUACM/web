"use server"

import { revalidateTag } from 'next/cache'

export async function revalidateBlogs() {
  revalidateTag('blogs')
}

export async function revalidateBlog(slug: string) {
  revalidateTag(`blogs:slug:${slug}`)
}

export async function revalidateContests() {
  revalidateTag('contests')
}

export async function revalidateContestsPage(page = 1) {
  revalidateTag(`contests:page:${page}`)
}

export async function revalidateProgrammers() {
  revalidateTag('programmers')
}

export async function revalidateProgrammersPage(page = 1) {
  revalidateTag(`programmers:page:${page}`)
}

export async function revalidateProgrammer(username: string) {
  revalidateTag(`programmers:username:${username}`)
}

export async function revalidateTrackers() {
  revalidateTag('trackers')
}

export async function revalidateTracker(slug: string) {
  revalidateTag(`trackers:slug:${slug}`)
}

export async function revalidateGalleries() {
  revalidateTag('galleries')
}

export async function revalidateGallery(slug: string) {
  revalidateTag(`galleries:slug:${slug}`)
}

export async function revalidateEvents() {
  revalidateTag('events')
}

export async function revalidateEvent(id: string | number) {
  revalidateTag(`events:id:${id}`)
}
