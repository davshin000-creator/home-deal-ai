export type ResearchPublicOpportunity = {
  symbol?: string;
  name?: string;
  asset_name?: string;
  asset_type?: string;
  market?: string;

  score?: number;
  weighted_score?: number;
  opportunity_score?: number;
  confidence?: number;

  risk?: string;
  status?: string;
  regime?: string;

  research_style?: string;
  research_version?: string;
  research_reasons?: string[];

  [key: string]: unknown;
};

export type ResearchPublicState = {
  generated_at?: string;
  schema_version?: string;

  opportunities?: unknown;
  top_opportunities?: unknown;

  market?: {
    regime?: string;
    research_style?: string;
    [key: string]: unknown;
  };

  research?: {
    strategy_mode?: string;
    total_count?: number;
    verified_count?: number;
    research_count?: number;
    [key: string]: unknown;
  };

  [key: string]: unknown;
};

export type ResearchPublicAsset =
  ResearchPublicOpportunity & {
    public_mode?: string;
    execution_exposed?: boolean;
    source_available?: boolean;
    generated_at?: string;
  };

const RESEARCH_GATEWAY_URL =
  process.env.NESTROVA_TRADING_API_URL ||
  "https://api.nestrovaai.com";

export async function loadResearchPublicState():
  Promise<ResearchPublicState | null> {
  try {
    const response = await fetch(
      `${RESEARCH_GATEWAY_URL}/api/v1/core/state`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error(
        "research_public_gateway_failed",
        response.status,
      );

      return null;
    }

    return (
      await response.json()
    ) as ResearchPublicState;
  } catch (error) {
    console.error(
      "research_public_gateway_request_failed",
      error,
    );

    return null;
  }
}

export async function loadResearchPublicAsset(
  rawSymbol: string,
): Promise<ResearchPublicAsset | null> {
  const symbol =
    rawSymbol.trim().toUpperCase();

  if (
    !symbol ||
    !/^[A-Z0-9._-]{1,20}$/.test(symbol)
  ) {
    return null;
  }

  try {
    const response = await fetch(
      `${RESEARCH_GATEWAY_URL}/api/v1/assets/${encodeURIComponent(
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

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `PUBLIC_ASSET_LOOKUP_${response.status}`,
      );
    }

    return (
      await response.json()
    ) as ResearchPublicAsset;
  } catch (error) {
    console.error(
      "research_public_asset_request_failed",
      symbol,
      error,
    );

    throw error;
  }
}
