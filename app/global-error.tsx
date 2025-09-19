"use client"

import { ThemeProvider } from "next-themes"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased flex min-h-screen items-center justify-center">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="mx-auto max-w-xl text-center px-6 py-16">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">App crashed unexpectedly</h1>
            <p className="mt-3 text-muted-foreground">An unrecoverable error occurred. You can try to recover or go home.</p>
            <p className="mt-2 text-sm text-muted-foreground">Please let the admin know that you saw this error page and share what you were trying to do. This website is maintained by a solo developer, so your cooperation is appreciated.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button onClick={() => reset()}>Recover</Button>
              <Button asChild variant="outline">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
            {error?.digest && (
              <p className="mt-4 text-xs text-muted-foreground">Error digest: {error.digest}</p>
            )}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
