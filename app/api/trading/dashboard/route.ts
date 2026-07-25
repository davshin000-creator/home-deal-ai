import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type DashboardOpportunity = {
  symbol: string;
  name: string;
  assetType: "stock" | "crypto";
  score: number;
  conviction: number;
  signal: "Strong Buy" | "Buy" | "Hold" | "Reduce";
  risk: "Low" | "Medium" | "High";
  reason: string;
};

export async function GET() {
  const opportunities: DashboardOpportunity[] = [
    {
      symbol: "NVDA",
      name: "NVIDIA",
      assetType: "stock",
      score: 94,
      conviction: 91,
      signal: "Strong Buy",
      risk: "Medium",
      reason:
        "AI infrastructure demand, strong momentum, and positive institutional positioning.",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      assetType: "crypto",
      score: 89,
      conviction: 84,
      signal: "Buy",
      risk: "High",
      reason:
        "Improving trend structure, strong liquidity, and sustained market participation.",
    },
    {
      symbol: "MSFT",
      name: "Microsoft",
      assetType: "stock",
      score: 87,
      conviction: 82,
      signal: "Buy",
      risk: "Low",
      reason:
        "Durable cloud growth, AI monetization potential, and resilient fundamentals.",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      assetType: "crypto",
      score: 83,
      conviction: 77,
      signal: "Buy",
      risk: "High",
      reason:
        "Positive network activity and improving relative momentum.",
    },
  ];

  return NextResponse.json(
    {
      generatedAt: new Date().toISOString(),

      market: {
        regime: "Constructive",
        sentiment: "Bullish",
        confidence: 82,
        risk: "Medium",
        volatility: "Moderate",
        liquidity: "High",
      },

      executiveBrief: {
        title: "Risk appetite remains constructive.",
        summary:
          "Technology leadership remains intact while crypto momentum continues to improve. The broader environment supports selective risk-taking, but concentration and volatility should still be managed carefully.",
        primaryAction:
          "Favor high-conviction opportunities while keeping position sizes disciplined.",
        primaryRisk:
          "A sharp volatility expansion could weaken current momentum signals.",
      },

      council: [
        {
          name: "Macro AI",
          signal: "Neutral",
          confidence: 71,
        },
        {
          name: "Momentum AI",
          signal: "Bullish",
          confidence: 89,
        },
        {
          name: "Pattern AI",
          signal: "Bullish",
          confidence: 84,
        },
        {
          name: "Risk AI",
          signal: "Neutral",
          confidence: 74,
        },
        {
          name: "Liquidity AI",
          signal: "Bullish",
          confidence: 86,
        },
      ],

      opportunities,

      portfolio: {
        score: 78,
        risk: "Medium",
        diversification: 72,
        concentrationRisk: "Moderate",
        recommendation:
          "Reduce excessive technology concentration and maintain a cash buffer.",
        actions: [
          "Limit any single position to a disciplined portfolio weight.",
          "Balance high-growth exposure with lower-volatility assets.",
          "Review crypto allocation after major volatility changes.",
        ],
      },

      dailyBrief: {
        headline: "Momentum remains positive, but selectivity matters.",
        summary:
          "The strongest signals remain concentrated in AI-related equities and major crypto assets. Avoid chasing weaker secondary names without confirmation.",
        highlights: [
          "Technology continues to lead relative strength.",
          "Crypto liquidity and trend conditions are improving.",
          "Volatility remains manageable but should be monitored.",
        ],
        watchItems: [
          "Changes in market breadth",
          "Sudden volatility expansion",
          "Weakening institutional momentum",
        ],
      },

      system: {
        status: "Operational",
        mode: "Public Intelligence",
        autoTrading: false,
        brokerageConnected: false,
        dataClassification: "Read-only",
      },
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}