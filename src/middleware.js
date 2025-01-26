import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const supabase = await createClient();
  // Update the session first
  const sessionResponse = await updateSession(request);

  // Clone the URL for manipulation
  const url = request.nextUrl.clone();

  // Paths that unauthenticated users are allowed to visit
  const publicPaths = ["/auth/login", "/auth/signup", "/auth/forgot-password"];

  // If the path is public, skip authentication logic
  if (publicPaths.some((path) => url.pathname.startsWith(path))) {
    return sessionResponse || NextResponse.next();
  }

  // Authentication logic
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = user;

  // Redirect unauthenticated users to /auth/login
  if (!isAuthenticated) {
    const loginPath = "/auth/login";

    // Avoid infinite redirect loop by skipping if already on /auth/login
    if (url.pathname !== loginPath) {
      url.pathname = loginPath;
      return NextResponse.redirect(url);
    }
  }

  // Proceed with the normal request
  return sessionResponse || NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:png|jpg|jpeg|gif|webp|svg)).*)",
  ],
};
