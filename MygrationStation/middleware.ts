import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "@/i18n/routing";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

/**
 * next-intl handles locale detection from:
 * 1. URL prefix (/es, /zh, etc.)
 * 2. NEXT_LOCALE cookie (set when user picks a language)
 * 3. Accept-Language header
 * 4. Falls back to defaultLocale ("en")
 */
const intlMiddleware = createMiddleware(routing);

/** Routes that require authentication */
const PROTECTED_ROUTE_SEGMENTS = [
  "(dashboard)",
  "dashboard",
  "formation",
  "ein",
  "documents",
  "compliance",
  "banking",
  "settings",
  "admin",
  "onboarding",
];

/** Routes that should redirect to dashboard if already authenticated */
const AUTH_ROUTE_SEGMENTS = ["login", "signup"];

function isProtectedRoute(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  // Remove locale prefix
  const pathWithoutLocale = segments.slice(1);
  return pathWithoutLocale.some((segment) =>
    PROTECTED_ROUTE_SEGMENTS.includes(segment)
  );
}

function isAuthRoute(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  const pathWithoutLocale = segments.slice(1);
  return pathWithoutLocale.some((segment) =>
    AUTH_ROUTE_SEGMENTS.includes(segment)
  );
}

function extractLocale(pathname: string): Locale {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (firstSegment && (locales as ReadonlyArray<string>).includes(firstSegment)) {
    return firstSegment as Locale;
  }
  return defaultLocale;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  // Step 1: Run next-intl middleware to handle locale routing
  const intlResponse = intlMiddleware(request);

  // Demo mode: set to true to bypass auth entirely
  const DEMO_ACTIVE = false;
  if (DEMO_ACTIVE) {
    const locale = extractLocale(pathname);
    if (isAuthRoute(pathname)) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
    return intlResponse;
  }

  // Step 2: Check authentication for protected routes
  // We need to create a Supabase client using the request/response cookies
  const locale = extractLocale(
    intlResponse.headers.get("x-middleware-rewrite") ?? pathname
  );

  // Determine the actual resolved path (after intl redirect/rewrite)
  const resolvedPath =
    intlResponse.headers.get("x-middleware-rewrite") ??
    intlResponse.headers.get("location") ??
    pathname;

  const needsAuthCheck = isProtectedRoute(resolvedPath) || isAuthRoute(resolvedPath);

  if (!needsAuthCheck) {
    return intlResponse;
  }

  // Create Supabase client for auth check
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected route but not authenticated → redirect to login
  if (isProtectedRoute(resolvedPath) && !user) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth route but already authenticated → redirect to dashboard
  if (isAuthRoute(resolvedPath) && user) {
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // For protected routes that passed auth, merge cookies from Supabase into the intl response
  if (user) {
    for (const cookie of supabaseResponse.cookies.getAll()) {
      intlResponse.cookies.set(cookie.name, cookie.value);
    }
  }

  return intlResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - API routes
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/).*)",
  ],
};
