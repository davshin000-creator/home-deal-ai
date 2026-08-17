import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GATEWAY_URL =
  process.env.NESTROVA_TRADING_API_URL ||
  "https://api.nestrovaai.com";

export async function GET() {
  try {
    const response = await fetch(
      `${GATEWAY_URL}/api/v1/core/state`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Public trading state unavailable.",
        },
        {
          status: 502,
        },
      );
    }

    const data = await response.json();

    if (
      data?.system?.public_mode !== "READ_ONLY" ||
      data?.system?.execution_exposed !== false
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Public trading safety validation failed.",
        },
        {
          status: 502,
        },
      );
    }

    return NextResponse.json(
      data,
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error(
      "trading_public_state_proxy_failed",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error: "Public trading state unavailable.",
      },
      {
        status: 502,
      },
    );
  }
}
