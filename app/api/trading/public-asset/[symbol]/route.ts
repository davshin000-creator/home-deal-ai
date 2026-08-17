import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GATEWAY_URL =
  process.env.NESTROVA_TRADING_API_URL ||
  "https://api.nestrovaai.com";

type RouteContext = {
  params: Promise<{
    symbol: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { symbol: rawSymbol } =
      await context.params;

    const symbol =
      rawSymbol.trim().toUpperCase();

    if (
      !symbol ||
      !/^[A-Z0-9._-]{1,20}$/.test(symbol)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid symbol.",
        },
        {
          status: 400,
        },
      );
    }

    const response = await fetch(
      `${GATEWAY_URL}/api/v1/assets/${encodeURIComponent(
        symbol,
      )}`,
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
          error: "Public asset unavailable.",
        },
        {
          status:
            response.status === 404
              ? 404
              : 502,
        },
      );
    }

    const data = await response.json();

    if (
      data?.public_mode !== "READ_ONLY" ||
      data?.execution_exposed !== false
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Public asset safety validation failed.",
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
      "trading_public_asset_proxy_failed",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error: "Public asset unavailable.",
      },
      {
        status: 502,
      },
    );
  }
}
