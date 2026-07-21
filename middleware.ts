import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/session";

// Session lookups hit the database (real per-user sessions, not a stateless
// token), which needs Node's runtime — the local dev DB is a file-based
// SQLite that Edge can't touch anyway.
export const runtime = "nodejs";

export async function middleware(request: NextRequest) {
  const user = await getCurrentUser();
  if (user) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!login|register|api/admin/migrate-production|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|icon|apple-icon).*)",
  ],
};
