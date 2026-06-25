import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

function avg(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export async function GET(request: Request) {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: "Missing Supabase service variables." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id." }, { status: 400 });
    }

    const [
      profileRes,
      savedDealsRes,
      reportsRes,
      coachPlansRes,
      watchlistRes,
      weeklyReportsRes,
    ] = await Promise.all([
      supabase.from("user_profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("saved_deals").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("ai_reports").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("coach_plans").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("watchlist_items").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("weekly_portfolio_reports").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]);

    const savedDeals = savedDealsRes.data || [];
    const reports = reportsRes.data || [];
    const coachPlans = coachPlansRes.data || [];
    const watchlist = watchlistRes.data || [];
    const weeklyReports = weeklyReportsRes.data || [];

    const avgDealScore = avg(savedDeals.map((deal) => Number(deal.deal_score || 0)));

    const recentActivity = [
      ...reports.slice(0, 2).map((report) => ({
        title: "AI Report generated",
        description: report.property_address || "Investment report",
        href: `/report/${report.id}`,
      })),
      ...coachPlans.slice(0, 2).map((plan) => ({
        title: "AI Coach plan created",
        description: `${plan.risk_level || "Medium"} risk · ${plan.time_horizon || "5-10 years"}`,
        href: "/coach",
      })),
      ...savedDeals.slice(0, 2).map((deal) => ({
        title: "Property saved",
        description: deal.address || "Saved property",
        href: "/portfolio",
      })),
    ].slice(0, 5);

    const strongestMarket =
      savedDeals[0]?.address?.split(",").slice(-2).join(",").trim() || "Dallas";

    const aiBrief =
      savedDeals.length > 0
        ? `Your portfolio has ${savedDeals.length} saved ${savedDeals.length === 1 ? "property" : "properties"} with an average deal score of ${avgDealScore}/100. Consider comparing your strongest saved deals and reviewing your next AI report.`
        : `Start by analyzing one property or searching deals in ${strongestMarket}. Nestrova will build a personalized dashboard as you save properties and create reports.`;

    return NextResponse.json({
      user_name: profileRes.data?.name || "there",
      portfolio_count: savedDeals.length,
      avg_deal_score: avgDealScore,
      saved_deals: savedDeals.length,
      ai_reports: reports.length,
      coach_plans: coachPlans.length,
      watchlist_count: watchlist.length,
      weekly_reports: weeklyReports.length,
      ai_brief: aiBrief,
      recent_activity: recentActivity,
    });
  } catch (error) {
    console.error("dashboard route error:", error);
    return NextResponse.json(
      { error: "Unexpected dashboard server error." },
      { status: 500 }
    );
  }
}
