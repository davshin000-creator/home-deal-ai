export type PublicOpportunity = {
  symbol?: string;
  name?: string;
  asset_type?: string;
  market?: string;
  confidence?: number;
  weighted_score?: number;
  score?: number;
  risk?: string;
  status?: string;
  research_style?: string;
  research_version?: string;
  research_reasons?: string[];
  [key: string]: unknown;
};

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
