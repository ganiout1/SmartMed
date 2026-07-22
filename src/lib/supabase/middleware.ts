import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
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
  function redirectWithCookies(pathname: string) {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
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
    if (isAuthRoute) {
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

  return supabaseResponse;
}

