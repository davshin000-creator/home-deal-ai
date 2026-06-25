import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

async function countTable(supabase: any, table: string, filter?: { column: string; value: any }) {
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) query = query.eq(filter.column, filter.value);
  const { count } = await query;
  return count || 0;
}

async function recentRows(supabase: any, table: string, limit = 5) {
  const { data } = await supabase.from(table).select("*").order("created_at", { ascending: false }).limit(limit);
  return data || [];
}

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Missing Supabase service variables." }, { status: 500 });
    }

    const [
      users,
      proUsers,
      waitlist,
      feedback,
      savedDeals,
      aiReports,
      coachPlans,
      watchlist,
      weeklyReports,
      recentFeedback,
      recentUsers,
      recentReports,
      recentCoachPlans,
    ] = await Promise.all([
      countTable(supabase, "user_profiles"),
      countTable(supabase, "user_profiles", { column: "is_pro", value: true }),
      countTable(supabase, "waitlist"),
      countTable(supabase, "beta_feedback"),
      countTable(supabase, "saved_deals"),
      countTable(supabase, "ai_reports"),
      countTable(supabase, "coach_plans"),
      countTable(supabase, "watchlist_items"),
      countTable(supabase, "weekly_portfolio_reports"),
      recentRows(supabase, "beta_feedback"),
      recentRows(supabase, "user_profiles"),
      recentRows(supabase, "ai_reports"),
      recentRows(supabase, "coach_plans"),
    ]);

    return NextResponse.json({
      users,
      proUsers,
      waitlist,
      feedback,
      savedDeals,
      aiReports,
      coachPlans,
      watchlist,
      weeklyReports,
      recentFeedback,
      recentUsers,
      recentReports,
      recentCoachPlans,
    });
  } catch (error) {
    console.error("admin route error:", error);
    return NextResponse.json({ error: "Unexpected admin server error." }, { status: 500 });
  }
}
