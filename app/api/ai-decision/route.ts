import { NextResponse } from "next/server";
import { runDecisionEngine } from "@/lib/ai/decisionEngine";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = runDecisionEngine({
      address: body.address || "123 Main St",
      city: body.city,
      state: body.state,
      askingPrice: Number(body.askingPrice || 817500),
      fairValue: Number(body.fairValue || 885000),
      estimatedRent: Number(body.estimatedRent || 4200),
      yearBuilt: body.yearBuilt ? Number(body.yearBuilt) : 2008,
      daysOnMarket: body.daysOnMarket ? Number(body.daysOnMarket) : 28,
      propertyTaxAnnual: body.propertyTaxAnnual ? Number(body.propertyTaxAnnual) : undefined,
      insuranceAnnual: body.insuranceAnnual ? Number(body.insuranceAnnual) : undefined,
      hoaMonthly: body.hoaMonthly ? Number(body.hoaMonthly) : undefined,
    });

    return NextResponse.json({ ok: true, result });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to run AI decision engine." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const result = runDecisionEngine({
    address: "123 Main St",
    city: "Dallas",
    state: "TX",
    askingPrice: 817500,
    fairValue: 885000,
    estimatedRent: 4200,
    yearBuilt: 2008,
    daysOnMarket: 28,
    hoaMonthly: 250,
  });

  return NextResponse.json({ ok: true, demo: true, result });
}

