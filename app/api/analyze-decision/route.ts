import { NextResponse } from "next/server";
import { analyzeToDecisionInput } from "@/lib/ai/analyzeAdapter";
import { runDecisionEngine } from "@/lib/ai/decisionEngine";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.address) {
      return NextResponse.json({ ok: false, error: "Address is required." }, { status: 400 });
    }

    const { raw, decisionInput } = await analyzeToDecisionInput({
      address: body.address,
      city: body.city,
      state: body.state,
    });

    const decision = runDecisionEngine(decisionInput);

    return NextResponse.json({
      ok: true,
      property: decisionInput,
      analysis: raw,
      decision,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to run analyze decision pipeline.",
      },
      { status: 500 }
    );
  }
}

