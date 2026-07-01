import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { setCsrfCookie } from "@/lib/csrf";

const SUPABASE_ENV_ERROR =
  "Missing NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy EnvExample.txt to .env.local and add your Supabase project URL and anon key.";

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !isValidHttpUrl(supabaseUrl)) {
    return null;
  }

  return { supabaseUrl, supabaseAnonKey };
}

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseConfig = getSupabaseConfig();
  if (!supabaseConfig) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(SUPABASE_ENV_ERROR);
    }
    return supabaseResponse;
  }

  // Origin/Referer header validation for production
  if (ALLOWED_ORIGINS.length > 0) {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const isApiRequest = request.nextUrl.pathname.startsWith("/api/");

    if (isApiRequest && (origin || referer)) {
      const source = origin || referer;
      try {
        const parsed = new URL(source);
        if (!ALLOWED_ORIGINS.includes(parsed.origin) && !ALLOWED_ORIGINS.includes(parsed.host)) {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }
      } catch {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
    }
  }

  // A server client is created per-request so that session cookies can be
  // refreshed when the access token is close to expiry. The setAll callback
  // propagates the new cookies into both the outgoing request and response so
  // that server components and client components see consistent session state.
  const supabase = createServerClient(
    supabaseConfig.supabaseUrl,
    supabaseConfig.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              sameSite: "lax",
            }),
          );
        },
      },
    },
  );

  // Calling getUser() triggers a token refresh if the access token is expired.
  // This must not be removed — without it, sessions silently expire mid-browse.
  await supabase.auth.getUser();

  // Set CSRF token cookie on all responses if not already present
  if (!request.cookies.has("csrf-token")) {
    setCsrfCookie(supabaseResponse);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static file extensions.
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
