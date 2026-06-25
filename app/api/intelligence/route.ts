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

function scoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Strong";
  if (score >= 70) return "Good";
  if (score >= 60) return "Watch";
  return "Needs Work";
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

    const [profileRes, savedDealsRes, watchlistRes, reportsRes, coachRes] =
      await Promise.all([
        supabase.from("user_profiles").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("saved_deals").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("watchlist_items").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("ai_reports").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("coach_plans").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      ]);

    const savedDeals = savedDealsRes.data || [];
    const watchlist = watchlistRes.data || [];
    const reports = reportsRes.data || [];
    const coachPlans = coachRes.data || [];

    const avgDealScore = avg(savedDeals.map((deal) => Number(deal.deal_score || 0)));
    const avgYield =
      savedDeals.length > 0
        ? Number(
            (
              savedDeals.reduce((sum, deal) => sum + Number(deal.gross_rent_yield || 0), 0) /
              savedDeals.length
            ).toFixed(2)
          )
        : 0;

    const avgCashFlow = avg(savedDeals.map((deal) => Number(deal.estimated_monthly_cash_flow || 0)));
    const portfolioHealth = Math.max(
      50,
      Math.min(98, Math.round(avgDealScore * 0.55 + (avgYield * 8) + (avgCashFlow >= 0 ? 15 : 0)))
    );

    const opportunities = [
      {
        title: "Dallas Cash-Flow Duplex",
        market: "Dallas, TX",
        deal_score: 96,
        trust_score: 95,
        confidence: "High",
        cash_flow: 842,
        yield: 6.1,
        recommendation: "Review",
        why: [
          "Estimated rent yield is above target",
          "Market has strong rental demand",
          "Entry price is more accessible than coastal markets",
          "Good fit for cash-flow focused investors",
        ],
        risk: "Verify property tax, insurance, and repair assumptions before making an offer.",
      },
      {
        title: "Phoenix Single Family Rental",
        market: "Phoenix, AZ",
        deal_score: 93,
        trust_score: 91,
        confidence: "High",
        cash_flow: 515,
        yield: 5.4,
        recommendation: "Compare",
        why: [
          "Balanced cash flow and appreciation profile",
          "Large rental market with long-term demand",
          "Good candidate for buy-and-hold analysis",
        ],
        risk: "Market can be cyclical; check local inventory and insurance costs.",
      },
      {
        title: "Austin Growth Condo",
        market: "Austin, TX",
        deal_score: 89,
        trust_score: 88,
        confidence: "Medium",
        cash_flow: 190,
        yield: 4.2,
        recommendation: "Watch",
        why: [
          "Stronger appreciation potential",
          "Technology job base supports long-term demand",
          "Better for growth investors than pure cash flow",
        ],
        risk: "Cash flow is thinner; confirm HOA and vacancy assumptions.",
      },
    ];

    const marketRadar = [
      {
        market: "Dallas",
        opportunity_score: 95,
        demand: "Rising",
        inventory: "Tight",
        rent_trend: "Up",
        confidence: 96,
      },
      {
        market: "Phoenix",
        opportunity_score: 91,
        demand: "Stable",
        inventory: "Balanced",
        rent_trend: "Up",
        confidence: 91,
      },
      {
        market: "Austin",
        opportunity_score: 88,
        demand: "Recovering",
        inventory: "Elevated",
        rent_trend: "Mixed",
        confidence: 86,
      },
    ];

    const nextBestAction =
      savedDeals.length === 0
        ? {
            title: "Analyze your first property",
            description:
              "Start with one address or use Deal Finder to create your first intelligence baseline.",
            href: "/",
            cta: "Analyze Property",
          }
        : reports.length === 0
        ? {
            title: "Generate your first AI Report",
            description:
              "You have saved deals. Turn the strongest one into a professional investment report.",
            href: "/",
            cta: "Generate Report",
          }
        : {
            title: "Compare your top opportunities",
            description:
              "Use Compare to choose which saved property deserves your next offer strategy.",
            href: "/compare",
            cta: "Compare Deals",
          };

    const dailyBrief =
      savedDeals.length > 0
        ? `Your portfolio health is ${portfolioHealth}/100. Average saved-deal score is ${avgDealScore}/100 with an average yield of ${avgYield}%.`
        : "Nestrova found starter opportunities in Dallas, Phoenix, and Austin. Start by analyzing or saving one deal to personalize your intelligence feed.";

    const timeline = [
      {
        title: "Today's Intelligence",
        description: dailyBrief,
        type: "brief",
      },
      ...reports.slice(0, 2).map((report) => ({
        title: "AI Report Created",
        description: report.property_address || "Investment report",
        type: "report",
      })),
      ...coachPlans.slice(0, 2).map((plan) => ({
        title: "AI Coach Plan",
        description: `${plan.risk_level || "Medium"} risk · ${plan.time_horizon || "5-10 years"}`,
        type: "coach",
      })),
      ...watchlist.slice(0, 2).map((item) => ({
        title: "Watchlist Item",
        description: item.address,
        type: "watchlist",
      })),
    ].slice(0, 6);

    const payload = {
      user_name: profileRes.data?.name || "there",
      intelligence_score: portfolioHealth,
      intelligence_label: scoreLabel(portfolioHealth),
      daily_brief: dailyBrief,
      opportunities,
      market_radar: marketRadar,
      portfolio_intelligence: {
        health_score: portfolioHealth,
        label: scoreLabel(portfolioHealth),
        saved_deals: savedDeals.length,
        avg_deal_score: avgDealScore,
        avg_yield: avgYield,
        avg_cash_flow: avgCashFlow,
        diversification: savedDeals.length >= 3 ? "Strong" : "Developing",
        risk: avgCashFlow >= 0 ? "Moderate-Low" : "Moderate",
        growth: avgDealScore >= 85 ? "Strong" : "Developing",
      },
      next_best_action: nextBestAction,
      timeline,
      powered_by: "Nestrova Intelligence",
    };

    await supabase.from("intelligence_snapshots").insert({
      user_id: userId,
      intelligence_score: portfolioHealth,
      daily_brief: dailyBrief,
      payload,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json(payload);
  } catch (error) {
    console.error("intelligence route error:", error);
    return NextResponse.json(
      { error: "Unexpected Nestrova Intelligence server error." },
      { status: 500 }
    );
  }
}
