export const TRADING_PUBLIC_GATEWAY_URL =
  process.env.NESTROVA_TRADING_API_URL ??
  "https://api.nestrovaai.com";

export type TradingGatewayResult<T> = {
  data: T | null;
  error: string | null;
  status: number | null;
};

export async function loadTradingPublicState<T>():
  Promise<TradingGatewayResult<T>> {
  try {
    const response = await fetch(
      `${TRADING_PUBLIC_GATEWAY_URL}/api/v1/core/state`,
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
        "trading_public_gateway_failed",
        response.status,
      );

      return {
        data: null,
        error:
          "Trading intelligence is temporarily unavailable.",
        status: response.status,
      };
    }

    return {
      data: (await response.json()) as T,
      error: null,
      status: response.status,
    };
  } catch (error) {
    console.error(
      "trading_public_gateway_request_failed",
      error,
    );

    return {
      data: null,
      error:
        "Trading intelligence is temporarily unavailable.",
      status: null,
    };
  }
}

export async function loadTradingPublicAsset<T>(
  rawSymbol: string,
): Promise<TradingGatewayResult<T>> {
  const symbol =
    rawSymbol.trim().toUpperCase();

  if (
    !symbol ||
    !/^[A-Z0-9._-]{1,20}$/.test(symbol)
  ) {
    return {
      data: null,
      error: "Invalid trading symbol.",
      status: 400,
    };
  }

  try {
    const response = await fetch(
      `${TRADING_PUBLIC_GATEWAY_URL}/api/v1/assets/${encodeURIComponent(
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
      return {
        data: null,
        error:
          "Trading asset intelligence is temporarily unavailable.",
        status: response.status,
      };
    }

    return {
      data: (await response.json()) as T,
      error: null,
      status: response.status,
    };
  } catch (error) {
    console.error(
      "trading_public_asset_request_failed",
      symbol,
      error,
    );

    return {
      data: null,
      error:
        "Trading asset intelligence is temporarily unavailable.",
      status: null,
    };
  }
}

