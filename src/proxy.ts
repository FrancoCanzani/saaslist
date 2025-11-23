import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

// Proxy function (formerly Middleware in Next.js < 16)
// This runs before a request is completed and can modify the response
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

// Configure which paths the proxy should run on
// Excludes static files, API routes, and metadata files (OG images, icons, etc.)
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots\\.txt|sitemap\\.xml|opengraph-image|twitter-image|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
