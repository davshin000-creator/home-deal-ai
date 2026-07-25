import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const assets = Array.isArray(body.assets)
      ? body.assets
      : [];

    const totalWeight = assets.reduce(
      (sum: number, asset: any) => sum + Number(asset.weight || 0),
      0
    );

    const technologyWeight = assets
      .filter((a: any) =>
        ["NVDA", "AAPL", "MSFT", "GOOGL", "META", "TSLA"].includes(
          String(a.symbol).toUpperCase()
        )
      )
      .reduce((sum: number, a: any) => sum + Number(a.weight || 0), 0);

    const cryptoWeight = assets
      .filter((a: any) =>
        ["BTC", "ETH", "SOL", "XRP", "DOGE"].includes(
          String(a.symbol).toUpperCase()
        )
      )
      .reduce((sum: number, a: any) => sum + Number(a.weight || 0), 0);

    return NextResponse.json({
      score: 87,
      risk: "Medium",
      diversification:
        assets.length >= 5 ? "Excellent" :
        assets.length >= 3 ? "Good" :
        "Low",

      technologyExposure:
        technologyWeight >= 40 ? "High" :
        technologyWeight >= 20 ? "Moderate" :
        "Low",

      cryptoExposure:
        cryptoWeight >= 40 ? "High" :
        cryptoWeight >= 20 ? "Moderate" :
        "Low",

      totalWeight,

      recommendation:
        "Portfolio is balanced but technology exposure is relatively high.",

      actions: [
        "Maintain current crypto allocation",
        "Reduce technology concentration",
        "Increase defensive exposure"
      ]
    });

  } catch {

    return NextResponse.json(
      {
        error: "Invalid request"
      },
      {
        status: 400
      }
    );

  }
}
