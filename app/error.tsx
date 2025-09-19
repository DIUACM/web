"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-1 min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Something went wrong</h1>
  <p className="mt-3 text-muted-foreground">We couldn’t load this page right now. You can retry or head back home.</p>
  <p className="mt-2 text-sm text-muted-foreground">Please let the admin know that you saw this error page and share what you were trying to do. This website is maintained by a solo developer, so your cooperation is appreciated.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={() => reset()}>Try again</Button>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
        {error?.digest && (
          <p className="mt-4 text-xs text-muted-foreground">Error digest: {error.digest}</p>
        )}
      </div>
    </div>
  )
}
