import {
  NextResponse,
} from "next/server";

const API_BASE_URL =
  process.env.NESTROVA_TRADING_API_URL ||
  process.env.NEXT_PUBLIC_NESTROVA_TRADING_API_URL ||
  "";

type SearchAsset = {
  symbol: string;
  name?: string;
  asset_type?: string;
  market?: string;
  exchange?: string;
  is_etf?: boolean;
};

function normalizeSearchUniverse(
  value: unknown,
): SearchAsset[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();
  const result: SearchAsset[] = [];

  for (const raw of value) {
    if (
      !raw ||
      typeof raw !== "object" ||
      Array.isArray(raw)
    ) {
      continue;
    }

    const item =
      raw as Record<string, unknown>;

    const symbol =
      String(item.symbol ?? "")
        .trim()
        .toUpperCase();

    if (!symbol || seen.has(symbol)) {
      continue;
    }

    seen.add(symbol);

    result.push({
      symbol,

      name:
        typeof item.name === "string"
          ? item.name
          : undefined,

      asset_type:
        typeof item.asset_type === "string"
          ? item.asset_type
          : undefined,

      market:
        typeof item.market === "string"
          ? item.market
          : undefined,

      exchange:
        typeof item.exchange === "string"
          ? item.exchange
          : undefined,

      is_etf:
        typeof item.is_etf === "boolean"
          ? item.is_etf
          : undefined,
    });
  }

  return result;
}

export async function GET() {
  if (!API_BASE_URL) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Trading gateway is not configured.",
        assets: [],
        count: 0,
      },
      {
        status: 503,
      },
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/core/state`,
      {
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
          error:
            "Trading gateway returned an error.",
          assets: [],
          count: 0,
        },
        {
          status: 502,
        },
      );
    }

    const state =
      (await response.json()) as {
        opportunities?: unknown;
      };

    const opportunities =
      state.opportunities;

    if (
      !opportunities ||
      typeof opportunities !== "object" ||
      Array.isArray(opportunities)
    ) {
      return NextResponse.json({
        ok: true,
        assets: [],
        count: 0,
      });
    }

    const objectValue =
      opportunities as Record<
        string,
        unknown
      >;

    const assets =
      normalizeSearchUniverse(
        objectValue.search_universe,
      );

    return NextResponse.json({
      ok: true,
      assets,
      count: assets.length,
    });
  } catch (error) {
    console.error(
      "research_universe_fetch_failed",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not load research universe.",
        assets: [],
        count: 0,
      },
      {
        status: 502,
      },
    );
  }
}
