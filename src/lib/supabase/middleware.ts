import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

export async function updateSession(request: NextRequest) {
  // --- Rate Limiting ---
  const ip = getClientIp(request.headers);
  const pathname = request.nextUrl.pathname;

  // Determine which rate limit config to use based on the path
  let rateLimitConfig: { interval: number; maxRequests: number } = RATE_LIMITS.general;
  let rateLimitKey = `general:${ip}`;

  if (pathname.startsWith("/login")) {
    rateLimitConfig = RATE_LIMITS.login;
    rateLimitKey = `login:${ip}`;
  } else if (pathname.startsWith("/register")) {
    rateLimitConfig = RATE_LIMITS.signup;
    rateLimitKey = `signup:${ip}`;
  } else if (pathname.startsWith("/forgot-password")) {
    rateLimitConfig = RATE_LIMITS.forgotPassword;
    rateLimitKey = `forgot:${ip}`;
  } else if (pathname.startsWith("/auth/callback")) {
    rateLimitConfig = RATE_LIMITS.authCallback;
    rateLimitKey = `callback:${ip}`;
  }

  const rateLimitResult = rateLimit(rateLimitKey, rateLimitConfig);

  if (!rateLimitResult.success) {
    return new NextResponse(
      JSON.stringify({
        error: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(
            Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
          ),
          "X-RateLimit-Limit": String(rateLimitResult.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rateLimitResult.resetTime),
        },
      }
    );
  }

  // --- Supabase Session ---
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set({ name, value, ...options })
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Helper: create a redirect that preserves session cookies
  function redirectWithCookies(redirectPathname: string) {
    const url = request.nextUrl.clone();
    url.pathname = redirectPathname;
    const redirectResponse = NextResponse.redirect(url);
    // Copy all cookies from supabaseResponse (which has refreshed session tokens)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register") ||
    request.nextUrl.pathname.startsWith("/forgot-password") ||
    request.nextUrl.pathname.startsWith("/update-password");
    
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if (!user && isDashboardRoute) {
    return redirectWithCookies("/login");
  }

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_banned")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "student";
    
    // Redirect banned users to banned page
    const isBannedRoute = request.nextUrl.pathname.startsWith("/banned");
    
    if (profile?.is_banned && !isBannedRoute) {
      return redirectWithCookies("/banned");
    }
    
    if (!profile?.is_banned && isBannedRoute) {
      return redirectWithCookies(`/dashboard/${role}`);
    }

    // Redirect logged-in users away from auth pages to their dashboard
    // BUT allow /update-password so the password reset flow works
    if (isAuthRoute && !request.nextUrl.pathname.startsWith("/update-password")) {
      return redirectWithCookies(`/dashboard/${role}`);
    }
    
    // Enforce RBAC for dashboard routes
    if (isDashboardRoute) {
      const pathSegments = request.nextUrl.pathname.split('/');
      const requestedRole = pathSegments[2]; // /dashboard/[role]
      
      if (!requestedRole) {
        return redirectWithCookies(`/dashboard/${role}`);
      }
      
      if (requestedRole !== role) {
        return redirectWithCookies(`/dashboard/${role}`);
      }
    }
  }

  // Add rate limit headers to successful responses
  supabaseResponse.headers.set("X-RateLimit-Limit", String(rateLimitResult.limit));
  supabaseResponse.headers.set("X-RateLimit-Remaining", String(rateLimitResult.remaining));
  supabaseResponse.headers.set("X-RateLimit-Reset", String(rateLimitResult.resetTime));

  return supabaseResponse;
}
