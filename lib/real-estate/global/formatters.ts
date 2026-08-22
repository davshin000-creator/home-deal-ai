import {
  getRealEstateCountryConfig,
  type RealEstateAreaUnit,
  type RealEstateCountryCode,
} from "./country-config";

const SQFT_PER_SQM = 10.7639104167;
const SQM_PER_PYEONG = 3.305785;

export function formatRealEstateCurrency(
  value: number | null | undefined,
  countryCode: RealEstateCountryCode = "US",
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "-";
  }

  const config =
    getRealEstateCountryConfig(countryCode);

  return new Intl.NumberFormat(
    config.defaultLocale,
    {
      style: "currency",
      currency: config.currency,
      maximumFractionDigits:
        config.currency === "KRW" ? 0 : 0,
    },
  ).format(value);
}

export function formatRealEstateNumber(
  value: number | null | undefined,
  countryCode: RealEstateCountryCode = "US",
  maximumFractionDigits = 0,
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "-";
  }

  const config =
    getRealEstateCountryConfig(countryCode);

  return new Intl.NumberFormat(
    config.defaultLocale,
    {
      maximumFractionDigits,
    },
  ).format(value);
}

export function convertArea(
  value: number,
  fromUnit: RealEstateAreaUnit,
  toUnit: RealEstateAreaUnit,
): number {
  if (fromUnit === toUnit) {
    return value;
  }

  let sqm = value;

  if (fromUnit === "sqft") {
    sqm = value / SQFT_PER_SQM;
  }

  if (fromUnit === "pyeong") {
    sqm = value * SQM_PER_PYEONG;
  }

  if (toUnit === "sqm") {
    return sqm;
  }

  if (toUnit === "sqft") {
    return sqm * SQFT_PER_SQM;
  }

  return sqm / SQM_PER_PYEONG;
}

export function formatRealEstateArea(
  value: number | null | undefined,
  countryCode: RealEstateCountryCode = "US",
  sourceUnit?: RealEstateAreaUnit,
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "-";
  }

  const config =
    getRealEstateCountryConfig(countryCode);

  const fromUnit =
    sourceUnit || config.primaryAreaUnit;

  const primaryValue = convertArea(
    value,
    fromUnit,
    config.primaryAreaUnit,
  );

  const primaryText =
    `${formatRealEstateNumber(
      primaryValue,
      countryCode,
      config.primaryAreaUnit === "pyeong"
        ? 1
        : 0,
    )} ${getAreaUnitLabel(
      config.primaryAreaUnit,
    )}`;

  if (!config.secondaryAreaUnit) {
    return primaryText;
  }

  const secondaryValue = convertArea(
    value,
    fromUnit,
    config.secondaryAreaUnit,
  );

  const secondaryText =
    `${formatRealEstateNumber(
      secondaryValue,
      countryCode,
      config.secondaryAreaUnit === "pyeong"
        ? 1
        : 0,
    )} ${getAreaUnitLabel(
      config.secondaryAreaUnit,
    )}`;

  return `${primaryText} (${secondaryText})`;
}

export function getAreaUnitLabel(
  unit: RealEstateAreaUnit,
): string {
  if (unit === "sqft") {
    return "sq ft";
  }

  if (unit === "sqm") {
    return "m\u00B2";
  }

  return "pyeong";
}