import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// ─── Route lists — update these as your app grows ───────────────────────────

/** Accessible by anyone, no session required */
const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"];

/** Prefixes that must never be intercepted (NextAuth API routes) */
const BYPASS_PREFIXES = ["/api/auth"];

/** Always redirect logged-in users away from these (auth pages) */
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

/** Redirect destination when unauthenticated user hits a protected route */
const LOGIN_PAGE = "/sign-in";

/** Redirect destination after a successful login */
const DEFAULT_AFTER_LOGIN = "/dashboard";

// ────────────────────────────────────────────────────────────────────────────

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  if (BYPASS_PREFIXES.some((p) => nextUrl.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthPage = AUTH_ROUTES.includes(nextUrl.pathname);

  // Logged-in user trying to visit sign-in / sign-up → send to dashboard
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL(DEFAULT_AFTER_LOGIN, nextUrl));
  }

  // Unauthenticated user trying to visit a protected route → send to sign-in
  if (!isLoggedIn && !isPublic) {
    const loginUrl = new URL(LOGIN_PAGE, nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|favicon.ico|api/auth|.*\\..*).*)" ],
};
