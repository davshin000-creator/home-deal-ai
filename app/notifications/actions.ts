"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login?next=/notifications");
  }

  return {
    supabase,
    user: data.user,
  };
}

export async function markAlertRead(formData: FormData) {
  const { supabase, user } = await requireUser();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirect("/notifications?error=invalid-alert");
  }

  const { error } = await supabase
    .from("trading_alerts")
    .update({
      is_read: true,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("notification_mark_read_error", error);
    redirect("/notifications?error=unable-to-update");
  }

  revalidatePath("/notifications");
  revalidatePath("/dashboard");
  redirect("/notifications?success=marked-read");
}

export async function markAllAlertsRead() {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("trading_alerts")
    .update({
      is_read: true,
    })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) {
    console.error("notification_mark_all_read_error", error);
    redirect("/notifications?error=unable-to-update");
  }

  revalidatePath("/notifications");
  revalidatePath("/dashboard");
  redirect("/notifications?success=all-read");
}

export async function deleteAlert(formData: FormData) {
  const { supabase, user } = await requireUser();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirect("/notifications?error=invalid-alert");
  }

  const { error } = await supabase
    .from("trading_alerts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("notification_delete_error", error);
    redirect("/notifications?error=unable-to-delete");
  }

  revalidatePath("/notifications");
  revalidatePath("/dashboard");
  redirect("/notifications?success=deleted");
}
