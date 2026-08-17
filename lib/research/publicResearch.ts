export type PublicOpportunity = {
  symbol?: string;
  name?: string;
  asset_name?: string;
  asset_type?: string;
  market?: string;

  confidence?: number;
  opportunity_score?: number;
  weighted_score?: number;
  score?: number;

  risk?: string;
  regime?: string;
  status?: string;

  research_style?: string;
  research_version?: string;
  research_reasons?: string[];

  [key: string]: unknown;
};

export type PublicSearchAsset = {
  symbol: string;
  name?: string;
  asset_type?: string;
  market?: string;
  exchange?: string;
  is_etf?: boolean;
};

export function normalizePublicSearchUniverse(
  value: unknown,
): PublicSearchAsset[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();
  const items: PublicSearchAsset[] = [];

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

    items.push({
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

  return items;
}

export function getPublicSearchUniverse(
  state:
    | {
        opportunities?: unknown;
      }
    | null
    | undefined,
): PublicSearchAsset[] {
  if (!state?.opportunities) {
    return [];
  }

  const opportunities =
    state.opportunities;

  if (
    typeof opportunities !== "object" ||
    Array.isArray(opportunities)
  ) {
    return [];
  }

  const objectValue =
    opportunities as Record<
      string,
      unknown
    >;

  return normalizePublicSearchUniverse(
    objectValue.search_universe,
  );
}


export function normalizePublicOpportunities(
  value: unknown,
): PublicOpportunity[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is PublicOpportunity =>
        Boolean(
          item &&
            typeof item === "object" &&
            !Array.isArray(item),
        ),
    );
  }

  if (
    !value ||
    typeof value !== "object"
  ) {
    return [];
  }

  const objectValue =
    value as Record<string, unknown>;

  // Research should use the broad safe public universe first.
  // Trading can continue using top_opportunities separately.
  for (const preferredKey of [
    "research_universe",
    "top_opportunities",
  ]) {
    const preferred =
      objectValue[preferredKey];

    if (Array.isArray(preferred)) {
      const items =
        preferred.filter(
          (item): item is PublicOpportunity =>
            Boolean(
              item &&
                typeof item === "object" &&
                !Array.isArray(item),
            ),
        );

      if (items.length > 0) {
        return items;
      }
    }
  }

  const nestedKeys = [
    "items",
    "candidates",
    "opportunities",
    "stocks",
    "crypto",
    "data",
  ];

  const combined: PublicOpportunity[] = [];

  for (const key of nestedKeys) {
    const nested = objectValue[key];

    if (Array.isArray(nested)) {
      combined.push(
        ...nested.filter(
          (item): item is PublicOpportunity =>
            Boolean(
              item &&
                typeof item === "object" &&
                !Array.isArray(item),
            ),
        ),
      );
    }
  }

  if (combined.length > 0) {
    return combined;
  }

  for (const nested of Object.values(
    objectValue,
  )) {
    if (Array.isArray(nested)) {
      combined.push(
        ...nested.filter(
          (item): item is PublicOpportunity =>
            Boolean(
              item &&
                typeof item === "object" &&
                !Array.isArray(item),
            ),
        ),
      );
    }
  }

  return combined;
}

export function getPublicOpportunities(
  state:
    | {
        top_opportunities?: unknown;
        opportunities?: unknown;
      }
    | null
    | undefined,
): PublicOpportunity[] {
  if (!state) {
    return [];
  }

  const researchUniverse =
    normalizePublicOpportunities(
      state.opportunities,
    );

  if (researchUniverse.length > 0) {
    return researchUniverse;
  }

  return normalizePublicOpportunities(
    state.top_opportunities,
  );
}
