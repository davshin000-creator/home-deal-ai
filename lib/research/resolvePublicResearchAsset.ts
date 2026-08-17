import {
  loadResearchPublicAsset,
} from "@/lib/research/public-gateway";

export type PublicResearchAsset = {
  symbol?: string;
  asset_name?: string;
  name?: string;
  asset_type?: string;

  opportunity_score?: number;
  score?: number;
  weighted_score?: number;
  confidence?: number;

  regime?: string;
  risk?: string;
  status?: string;

  research_style?: string;
  research_version?: string;
  research_reasons?: string[];

  score_basis?: string;
  score_components?: Record<
    string,
    number
  >;

  market?: string;
  currency?: string;
  current_price?: number | null;

  rsi?: number | null;
  return_5d_pct?: number | null;
  return_20d_pct?: number | null;
  volume_ratio?: number | null;
  annualized_volatility_pct?: number | null;

  generated_at?: string | null;
  data_time?: string | null;
};

function normalizeSymbol(
  value: unknown,
) {
  return String(value ?? "")
    .trim()
    .toUpperCase();
}

function normalizeList(
  value: unknown,
): PublicResearchAsset[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (
      item,
    ): item is PublicResearchAsset =>
      Boolean(
        item &&
          typeof item === "object" &&
          !Array.isArray(item),
      ),
  );
}

export async function resolvePublicResearchAsset(
  state: {
    top_opportunities?: unknown;
    opportunities?: unknown;
  },
  rawSymbol: string,
): Promise<
  PublicResearchAsset | null
> {
  const symbol =
    normalizeSymbol(rawSymbol);

  if (!symbol) {
    return null;
  }

  const existing = [
    ...normalizeList(
      state.top_opportunities,
    ),
    ...normalizeList(
      state.opportunities,
    ),
  ].find(
    (item) =>
      normalizeSymbol(
        item.symbol,
      ) === symbol,
  );

  if (existing) {
    return existing;
  }

  const asset =
    await loadResearchPublicAsset(
      symbol,
    );

  if (!asset) {
    return null;
  }

  if (
    normalizeSymbol(
      asset.symbol,
    ) !== symbol
  ) {
    return null;
  }

  return asset;
}
