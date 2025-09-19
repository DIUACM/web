import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-1 min-h-[60vh] items-center justify-center px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">404 — Page Not Found</h1>
        <p className="mt-3 text-muted-foreground">Sorry, we couldn’t find the page you’re looking for.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/blogs">Browse Blogs</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
