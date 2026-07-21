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

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/forgot-password") ||
    request.nextUrl.pathname.startsWith("/update-password");
    
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if (!user && isDashboardRoute) {
    // No user, trying to access dashboard -> redirect to login
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user) {
    // User is logged in, check role from profiles table
    // Fetch profile role since role is not automatically in standard user metadata
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "student";
    
    // Redirect logged-in users away from auth pages to their dashboard
    if (isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = `/dashboard/${role}`;
      return NextResponse.redirect(url);
    }
    
    // Enforce RBAC for dashboard routes
    if (isDashboardRoute) {
      const pathSegments = request.nextUrl.pathname.split('/');
      const requestedRole = pathSegments[2]; // /dashboard/[role]
      
      // If trying to access /dashboard directly, redirect to correct role dashboard
      if (!requestedRole) {
        const url = request.nextUrl.clone();
        url.pathname = `/dashboard/${role}`;
        return NextResponse.redirect(url);
      }
      
      // If trying to access another role's dashboard, redirect to own dashboard
      if (requestedRole !== role) {
        const url = request.nextUrl.clone();
        url.pathname = `/dashboard/${role}`;
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
