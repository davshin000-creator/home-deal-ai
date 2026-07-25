import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get("symbol") || "NVDA").toUpperCase();

  return NextResponse.json({
    symbol,
    aiScore: 92,
    recommendation: "Strong Buy",
    bullProbability: 78,
    risk: "Medium",

    priceTargets: {
      bull: 205,
      base: 193,
      bear: 175
    },

    council: [
      { name: "Macro AI", signal: "Bullish" },
      { name: "Momentum AI", signal: "Bullish" },
      { name: "Pattern AI", signal: "Bullish" },
      { name: "Risk AI", signal: "Neutral" },
      { name: "Value AI", signal: "Bullish" }
    ],

    reasons: [
      "Strong earnings momentum",
      "Institutional accumulation",
      "Positive technical trend"
    ]
  });
}
