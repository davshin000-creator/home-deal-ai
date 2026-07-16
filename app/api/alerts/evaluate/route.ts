import { NextRequest, NextResponse } from "next/server";

import { runAlertEngine } from "@/lib/alerts/engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isAuthorized(request: NextRequest) {
  const expectedSecret =
    process.env.ALERT_ENGINE_SECRET;

  if (!expectedSecret) {
    return false;
  }

  const authorization =
    request.headers.get("authorization");

  return authorization === `Bearer ${expectedSecret}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const result = await runAlertEngine();

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error) {
    console.error("alert_engine_error", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Alert Engine failed.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "Nestrova Alert Engine",
    status: "READY",
    method: "POST",
  });
}
