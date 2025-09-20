import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Paths that should not be processed by the middleware
const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const { pathname, searchParams } = nextUrl;

  // Skip static files and Next internals
  if (PUBLIC_FILE.test(pathname) || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Detect simple auth state via client-managed cookie
  const isAuthed = cookies.get("diuacm_auth")?.value === "1";

  // If visiting /login while authenticated, redirect to the desired destination
  if (pathname === "/login" && isAuthed) {
    const redirect = searchParams.get("redirect") || "/";
    const url = req.nextUrl.clone();
    url.pathname = redirect;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Guard certain authenticated-only pages: redirect to /login with ?redirect=...
  const protectedPaths = ["/profile/edit"];
  if (protectedPaths.includes(pathname) && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname + (nextUrl.search || ""));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/profile/:path*",
    // add more app routes if needed
  ],
};
