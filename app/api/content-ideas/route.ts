import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const address = String(body.address || "this property");
  const price = Number(body.listing_price || 0);
  const score = Number(body.deal_score || body.overall_score || 0);
  const status = String(body.status || "AI analyzed");
  const priceText = price ? `$${Math.round(price).toLocaleString()}` : "this price";

  return NextResponse.json({
    ideas: [
      {
        platform: "TikTok / Reels / Shorts",
        title: `${priceText} property: AI says ${status}`,
        hook: `I asked Nestrova AI if ${address} is a buy or pass.`,
        script: [
          `This property is listed at ${priceText}.`,
          `Nestrova AI scored it ${score}/100.`,
          "The key question is fair value, rent, and cash flow.",
          `AI verdict: ${status}.`,
          "Would you buy or pass?"
        ],
        caption: `AI real estate analysis for ${address}. Not financial advice. #realestateinvesting #ai #propertyanalysis`
      },
      {
        platform: "Reddit / Community Post",
        title: `AI analysis: ${address}`,
        hook: "Testing an AI real estate analyzer. Curious if investors agree.",
        script: [
          `Address/market: ${address}`,
          `Listing price: ${priceText}`,
          `AI score: ${score}/100`,
          `AI verdict: ${status}`,
          "What would you check before buying?"
        ],
        caption: "Looking for investor feedback. This is a beta tool, not investment advice."
      }
    ]
  });
}

