import { NextResponse } from "next/server";
import { generateExplanation } from "@/lib/ai/explanationEngine";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.address || !body.recommendation || !body.scores) {
      return NextResponse.json(
        { ok: false, error: "Decision result is required." },
        { status: 400 }
      );
    }

    const explanation = await generateExplanation({
      address: body.address,
      recommendation: body.recommendation,
      confidence: Number(body.confidence || 80),
      summary: body.summary || "",
      reasons: Array.isArray(body.reasons) ? body.reasons : [],
      scores: body.scores,
      risks: Array.isArray(body.risks) ? body.risks : [],
      offers: Array.isArray(body.offers) ? body.offers : [],
    });

    return NextResponse.json({
      ok: true,
      explanation,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to generate AI explanation." },
      { status: 500 }
    );
  }
}
