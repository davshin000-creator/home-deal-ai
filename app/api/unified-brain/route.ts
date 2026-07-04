import { NextResponse } from "next/server";
import { runUnifiedBrain } from "@/lib/ai/unifiedBrain";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.address) {
      return NextResponse.json(
        { ok: false, error: "Address is required." },
        { status: 400 }
      );
    }

    const result = await runUnifiedBrain(body);
    return NextResponse.json({ ok: true, result });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to run Unified Brain." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const result = await runUnifiedBrain({
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
