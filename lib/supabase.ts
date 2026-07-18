import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export const supabase =
  createSupabaseBrowserClient();

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}