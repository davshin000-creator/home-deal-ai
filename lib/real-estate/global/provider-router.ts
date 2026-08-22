import {
  getRealEstateCountryConfig,
  type RealEstateCountryCode,
} from "./country-config";

import {
  homeDealProvider,
} from "./home-deal-provider";

import {
  canadaProvider,
} from "./canada-provider";

import type {
  RealEstateDataProvider,
} from "./provider-types";

export type RealEstateProviderId =
  | "rentcast"
  | "canada_pending"
  | "korea_pending";

export type RealEstateProviderResolution = {
  countryCode: RealEstateCountryCode;
  provider: RealEstateProviderId;
  available: boolean;
};

const PROVIDER_REGISTRY: Partial<
  Record<
    RealEstateProviderId,
    RealEstateDataProvider
  >
> = {
  rentcast: homeDealProvider,
  canada_pending: canadaProvider,
};

export function resolveRealEstateProvider(
  countryCode: RealEstateCountryCode = "US",
): RealEstateProviderResolution {
  const config =
    getRealEstateCountryConfig(countryCode);

  return {
    countryCode: config.code,
    provider: config.dataProvider,
    available:
      config.enabled &&
      Boolean(
        PROVIDER_REGISTRY[
          config.dataProvider
        ],
      ),
  };
}

export function requireRealEstateProvider(
  countryCode: RealEstateCountryCode = "US",
): RealEstateProviderResolution {
  const resolution =
    resolveRealEstateProvider(countryCode);

  if (!resolution.available) {
    throw new Error(
      `Real estate provider unavailable for ${resolution.countryCode}.`,
    );
  }

  return resolution;
}

export function getRealEstateDataProvider(
  countryCode: RealEstateCountryCode = "US",
): RealEstateDataProvider | null {
  const resolution =
    resolveRealEstateProvider(countryCode);

  if (!resolution.available) {
    return null;
  }

  return (
    PROVIDER_REGISTRY[
      resolution.provider
    ] ?? null
  );
}