import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function avg(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function grade(score: number) {
  if (score >= 90) return "Excellent Portfolio";
  if (score >= 80) return "Strong Portfolio";
  if (score >= 70) return "Good Portfolio";
  if (score >= 60) return "Developing Portfolio";
  return "Needs Improvement";
}

export async function POST(request: Request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Missing Supabase service variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const userId = String(body.user_id || "");

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id." }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: deals, error } = await supabase
      .from("saved_deals")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: "Could not load saved deals." }, { status: 500 });
    }

    const savedDeals = deals || [];
    const scores = savedDeals.map((d) => Number(d.deal_score || 0));
    const yields = savedDeals.map((d) => Number(d.gross_rent_yield || 0));
    const cashFlows = savedDeals.map((d) => Number(d.estimated_monthly_cash_flow || 0));
    const markets = new Set(
      savedDeals.map((d) => String(d.address || "").split(",").slice(-2).join(",").trim())
    );

    const avgScore = Math.round(avg(scores));
    const avgYield = Number(avg(yields).toFixed(2));
    const avgCashFlow = Math.round(avg(cashFlows));
    const diversificationScore = Math.min(100, markets.size * 25);
    const cashFlowScore = avgCashFlow >= 0 ? 90 : Math.max(35, 70 + avgCashFlow / 100);
    const healthScore = Math.round(
      avgScore * 0.5 + diversificationScore * 0.2 + cashFlowScore * 0.3
    );

    let aiRecommendation = "Save more properties to get a stronger AI portfolio recommendation.";

    if (OPENAI_API_KEY && savedDeals.length > 0) {
      const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.35,
          messages: [
            {
              role: "system",
              content:
                "You are Nestrova AI Portfolio Health Advisor. Give practical portfolio observations. Do not provide legal, tax, lending, or personalized financial advice.",
            },
            {
              role: "user",
              content: `Analyze this real estate saved-deal portfolio. Provide strengths, risks, and next steps. Data: ${JSON.stringify({
                saved_count: savedDeals.length,
                avg_score: avgScore,
                avg_yield: avgYield,
                avg_cash_flow: avgCashFlow,
                market_count: markets.size,
                deals: savedDeals,
              })}`,
            },
          ],
        }),
      });

      if (openAiResponse.ok) {
        const data = await openAiResponse.json();
        aiRecommendation =
          data.choices?.[0]?.message?.content || aiRecommendation;
      }
    }

    await supabase.from("portfolio_health_snapshots").insert({
      user_id: userId,
      saved_count: savedDeals.length,
      health_score: healthScore,
      avg_score: avgScore,
      avg_yield: avgYield,
      avg_cash_flow: avgCashFlow,
      market_count: markets.size,
      ai_recommendation: aiRecommendation,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      saved_count: savedDeals.length,
      health_score: healthScore,
      grade: grade(healthScore),
      avg_score: avgScore,
      avg_yield: avgYield,
      avg_cash_flow: avgCashFlow,
      market_count: markets.size,
      ai_recommendation: aiRecommendation,
    });
  } catch (error) {
    console.error("portfolio-health error:", error);
    return NextResponse.json(
      { error: "Unexpected portfolio health server error." },
      { status: 500 }
    );
  }
}
