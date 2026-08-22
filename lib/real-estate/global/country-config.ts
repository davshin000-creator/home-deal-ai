export type RealEstateCountryCode = "US" | "CA" | "KR";

export type RealEstateCurrencyCode = "USD" | "CAD" | "KRW";

export type RealEstateAreaUnit = "sqft" | "sqm" | "pyeong";

export type RealEstateCountryConfig = {
  code: RealEstateCountryCode;
  name: string;
  defaultLocale: string;
  currency: RealEstateCurrencyCode;
  primaryAreaUnit: RealEstateAreaUnit;
  secondaryAreaUnit?: RealEstateAreaUnit;
  regionLabel: string;
  postalCodeLabel: string;
  addressExample: string;
  dataProvider: "rentcast" | "canada_pending" | "korea_pending";
  enabled: boolean;
};

export const REAL_ESTATE_COUNTRY_CONFIG: Record<
  RealEstateCountryCode,
  RealEstateCountryConfig
> = {
  US: {
    code: "US",
    name: "United States",
    defaultLocale: "en-US",
    currency: "USD",
    primaryAreaUnit: "sqft",
    regionLabel: "State",
    postalCodeLabel: "ZIP code",
    addressExample: "123 Main St, Irvine, CA 92620",
    dataProvider: "rentcast",
    enabled: true,
  },

  CA: {
    code: "CA",
    name: "Canada",
    defaultLocale: "en-CA",
    currency: "CAD",
    primaryAreaUnit: "sqft",
    secondaryAreaUnit: "sqm",
    regionLabel: "Province",
    postalCodeLabel: "Postal code",
    addressExample: "123 King St W, Toronto, ON M5H 1J9",
    dataProvider: "canada_pending",
    enabled: false,
  },

  KR: {
    code: "KR",
    name: "South Korea",
    defaultLocale: "ko-KR",
    currency: "KRW",
    primaryAreaUnit: "sqm",
    secondaryAreaUnit: "pyeong",
    regionLabel: "Province / Metropolitan City",
    postalCodeLabel: "Postal code",
    addressExample: "\uC11C\uC6B8\uD2B9\uBCC4\uC2DC \uAC15\uB0A8\uAD6C \uD14C\uD5E4\uB780\uB85C 123",
    dataProvider: "korea_pending",
    enabled: false,
  },
};

export const DEFAULT_REAL_ESTATE_COUNTRY: RealEstateCountryCode =
  "US";

export function getRealEstateCountryConfig(
  countryCode?: string | null,
): RealEstateCountryConfig {
  const normalized = String(
    countryCode || DEFAULT_REAL_ESTATE_COUNTRY,
  ).toUpperCase();

  if (
    normalized === "US" ||
    normalized === "CA" ||
    normalized === "KR"
  ) {
    return REAL_ESTATE_COUNTRY_CONFIG[normalized];
  }

  return REAL_ESTATE_COUNTRY_CONFIG[
    DEFAULT_REAL_ESTATE_COUNTRY
  ];
}

export function isRealEstateCountryEnabled(
  countryCode?: string | null,
): boolean {
  return getRealEstateCountryConfig(countryCode).enabled;
}