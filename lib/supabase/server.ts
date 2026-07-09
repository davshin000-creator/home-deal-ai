import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {}
        },
      },
    }
  );
}

export function createSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase admin env vars.");
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getCurrentUserProfile() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) return { user: null, profile: null, isPro: false };

  const admin = createSupabaseAdminClient();

  const { data: existing } = await admin
    .from("profiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  let profile = existing;

  if (!profile) {
    const { data: inserted, error } = await admin
      .from("profiles")
      .insert({
  id: user.id,
  auth_user_id: user.id,
  email: user.email,
  is_pro: false,
  plan: "free",
  subscription_status: "free",
  updated_at: new Date().toISOString(),
})
      .select("*")
      .single();

    if (error) throw error;
    profile = inserted;
  }

  const isPro =
    Boolean(profile?.is_pro) ||
    profile?.plan === "pro" ||
    profile?.subscription_status === "active";

  return { user, profile, isPro };
}
