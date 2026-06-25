import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function safeNumber(value: unknown, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export async function POST(request: Request) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY environment variable." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const property = body.property;

    if (!property || !property.address) {
      return NextResponse.json(
        { error: "Property analysis result is required." },
        { status: 400 }
      );
    }

    const propertyContext = {
      address: property.address,
      listing_price: safeNumber(property.listing_price),
      fair_value: safeNumber(property.fair_value),
      estimated_monthly_rent: safeNumber(property.estimated_monthly_rent),
      gross_rent_yield: safeNumber(property.gross_rent_yield),
      deal_score: safeNumber(property.deal_score),
      status: property.status,
      estimated_monthly_cash_flow: safeNumber(property.estimated_monthly_cash_flow),
      forecast_score: safeNumber(property.forecast_score, 50),
      expected_appreciation: safeNumber(property.expected_appreciation),
      neighborhood_score: safeNumber(property.neighborhood_score, 50),
      confidence_score: safeNumber(property.confidence_score, 50),
      summary: property.summary,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
              "You are Nestrova AI, a real estate investment negotiation assistant. Create practical offer strategies. Do not provide legal, tax, or financial advice. Make clear that this is informational only.",
          },
          {
            role: "user",
            content: `Create an offer strategy for this property. Include: recommended opening offer, max walk-away price, negotiation reasons, seller concessions to ask for, risks, and next due diligence steps. Property data: ${JSON.stringify(propertyContext, null, 2)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "AI negotiation failed. Please try again." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const strategy =
      data.choices?.[0]?.message?.content ||
      "Could not generate a negotiation strategy.";

    return NextResponse.json({ strategy });
  } catch (error) {
    console.error("negotiation route error:", error);
    return NextResponse.json(
      { error: "Unexpected negotiation server error." },
      { status: 500 }
    );
  }
}
