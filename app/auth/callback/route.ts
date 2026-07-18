import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");

  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/dashboard";

  const canonicalOrigin =
    process.env.NODE_ENV === "production"
      ? "https://nestrovaai.com"
      : requestUrl.origin;

  let redirectResponse = NextResponse.redirect(
    new URL(safeNext, canonicalOrigin)
  );

  if (!code) {
    const loginUrl = new URL("/login", canonicalOrigin);
    loginUrl.searchParams.set("error", "missing_oauth_code");

    return NextResponse.redirect(loginUrl);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("oauth_callback_env_error", {
      hasSupabaseUrl: Boolean(supabaseUrl),
      hasSupabaseAnonKey: Boolean(supabaseAnonKey),
    });

    const loginUrl = new URL("/login", canonicalOrigin);
    loginUrl.searchParams.set("error", "auth_configuration_error");

    return NextResponse.redirect(loginUrl);
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          const cookieHeader = request.headers.get("cookie");

          if (!cookieHeader) {
            return [];
          }

          return cookieHeader
            .split(";")
            .map((cookie) => {
              const separatorIndex = cookie.indexOf("=");

              if (separatorIndex === -1) {
                return {
                  name: cookie.trim(),
                  value: "",
                };
              }

              return {
                name: cookie.slice(0, separatorIndex).trim(),
                value: decodeURIComponent(
                  cookie.slice(separatorIndex + 1).trim()
                ),
              };
            });
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            redirectResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("oauth_callback_exchange_error", {
      name: error.name,
      message: error.message,
      status: error.status,
    });

    const loginUrl = new URL("/login", canonicalOrigin);
    loginUrl.searchParams.set("error", "oauth_callback_failed");

    return NextResponse.redirect(loginUrl);
  }

  if (!data.session || !data.user) {
    console.error("oauth_callback_session_missing", {
      hasSession: Boolean(data.session),
      hasUser: Boolean(data.user),
    });

    const loginUrl = new URL("/login", canonicalOrigin);
    loginUrl.searchParams.set("error", "session_creation_failed");

    return NextResponse.redirect(loginUrl);
  }

  console.log("oauth_callback_success", {
    userId: data.user.id,
    redirectTo: safeNext,
  });

  return redirectResponse;
}