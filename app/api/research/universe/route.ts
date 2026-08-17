import {
  NextResponse,
} from "next/server";

import {
  loadResearchPublicState,
} from "@/lib/research/public-gateway";

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
  try {
    const state =
      await loadResearchPublicState();

    if (!state) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Research universe is temporarily unavailable.",
          assets: [],
          count: 0,
        },
        {
          status: 502,
        },
      );
    }

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
