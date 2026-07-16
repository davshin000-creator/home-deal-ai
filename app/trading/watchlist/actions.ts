"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const ALLOWED_ASSET_TYPES = new Set([
  "crypto",
  "stock",
  "etf",
  "index",
]);

const ALLOWED_RISK_LEVELS = new Set([
  "",
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);

function normalizeSymbol(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

function normalizeAssetType(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "crypto")
    .trim()
    .toLowerCase();

  return ALLOWED_ASSET_TYPES.has(normalized)
    ? normalized
    : "crypto";
}

function normalizeThreshold(value: FormDataEntryValue | null) {
  const parsed = Number.parseInt(String(value ?? "80"), 10);

  if (Number.isNaN(parsed)) {
    return 80;
  }

  return Math.max(0, Math.min(100, parsed));
}

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login?next=/trading/watchlist");
  }

  return {
    supabase,
    user: data.user,
  };
}

export async function addWatchlistItem(formData: FormData) {
  const { supabase, user } = await requireUser();

  const symbol = normalizeSymbol(formData.get("symbol"));
  const assetType = normalizeAssetType(formData.get("asset_type"));
  const displayName = String(
    formData.get("display_name") ?? "",
  ).trim();
  const opportunityThreshold = normalizeThreshold(
    formData.get("opportunity_threshold"),
  );

  if (!symbol || symbol.length > 20) {
    redirect(
      "/trading/watchlist?error=invalid-symbol",
    );
  }

  const { error } = await supabase
    .from("trading_watchlist")
    .insert({
      user_id: user.id,
      symbol,
      asset_type: assetType,
      display_name: displayName || null,
      opportunity_threshold: opportunityThreshold,
      alert_enabled: false,
      risk_threshold: null,
    });

  if (error) {
    if (error.code === "23505") {
      redirect(
        "/trading/watchlist?error=already-added",
      );
    }

    console.error("watchlist_insert_error", error);

    redirect(
      "/trading/watchlist?error=unable-to-add",
    );
  }

  revalidatePath("/trading/watchlist");
  redirect("/trading/watchlist?success=added");
}

export async function deleteWatchlistItem(formData: FormData) {
  const { supabase, user } = await requireUser();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirect(
      "/trading/watchlist?error=invalid-item",
    );
  }

  const { error } = await supabase
    .from("trading_watchlist")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("watchlist_delete_error", error);

    redirect(
      "/trading/watchlist?error=unable-to-delete",
    );
  }

  revalidatePath("/trading/watchlist");
  redirect("/trading/watchlist?success=deleted");
}

export async function updateWatchlistSettings(
  formData: FormData,
) {
  const { supabase, user } = await requireUser();

  const id = String(formData.get("id") ?? "").trim();
  const alertEnabled =
    String(formData.get("alert_enabled") ?? "") === "on";
  const opportunityThreshold = normalizeThreshold(
    formData.get("opportunity_threshold"),
  );

  const rawRisk = String(
    formData.get("risk_threshold") ?? "",
  )
    .trim()
    .toUpperCase();

  const riskThreshold = ALLOWED_RISK_LEVELS.has(rawRisk)
    ? rawRisk || null
    : null;

  if (!id) {
    redirect(
      "/trading/watchlist?error=invalid-item",
    );
  }

  const { error } = await supabase
    .from("trading_watchlist")
    .update({
      alert_enabled: alertEnabled,
      opportunity_threshold: opportunityThreshold,
      risk_threshold: riskThreshold,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("watchlist_update_error", error);

    redirect(
      "/trading/watchlist?error=unable-to-update",
    );
  }

  revalidatePath("/trading/watchlist");
  redirect("/trading/watchlist?success=updated");
}
