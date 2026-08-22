import type {
  RealEstateCountryCode,
} from "./country-config";

export type ParsedRealEstateLocation = {
  countryCode: RealEstateCountryCode;
  city: string | null;
  region: string | null;
  postalCode: string | null;
};

const US_ZIP_PATTERN = /\b(\d{5}(?:-\d{4})?)\b/;

const CANADA_POSTAL_CODE_PATTERN =
  /\b([A-Z]\d[A-Z][ -]?\d[A-Z]\d)\b/i;

const REGION_CODE_PATTERN =
  /\b([A-Z]{2})\b/i;

function normalizeCanadianPostalCode(
  value: string,
): string {
  const compact = value
    .replace(/\s+/g, "")
    .toUpperCase();

  if (compact.length !== 6) {
    return value.toUpperCase();
  }

  return `${compact.slice(0, 3)} ${compact.slice(3)}`;
}

function parseNorthAmericanAddress(
  address: string,
  countryCode: "US" | "CA",
): ParsedRealEstateLocation {
  const parts = String(address ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const city =
    parts.length >= 2
      ? parts[parts.length - 2]
      : null;

  const finalPart =
    parts.length >= 1
      ? parts[parts.length - 1]
      : "";

  const regionMatch =
    finalPart.match(REGION_CODE_PATTERN);

  const postalMatch =
    countryCode === "US"
      ? finalPart.match(US_ZIP_PATTERN)
      : finalPart.match(
          CANADA_POSTAL_CODE_PATTERN,
        );

  return {
    countryCode,
    city,
    region: regionMatch
      ? regionMatch[1].toUpperCase()
      : null,
    postalCode: postalMatch
      ? countryCode === "CA"
        ? normalizeCanadianPostalCode(
            postalMatch[1],
          )
        : postalMatch[1]
      : null,
  };
}

function parseKoreanAddress(
  address: string,
): ParsedRealEstateLocation {
  const normalized = String(
    address ?? "",
  ).trim();

  if (!normalized) {
    return {
      countryCode: "KR",
      city: null,
      region: null,
      postalCode: null,
    };
  }

  const parts = normalized
    .split(/\s+/)
    .filter(Boolean);

  return {
    countryCode: "KR",
    region:
      parts.length >= 1
        ? parts[0]
        : null,
    city:
      parts.length >= 2
        ? parts[1]
        : null,
    postalCode: null,
  };
}

export function parseRealEstateLocation(
  address: string,
  countryCode: RealEstateCountryCode = "US",
): ParsedRealEstateLocation {
  if (countryCode === "CA") {
    return parseNorthAmericanAddress(
      address,
      "CA",
    );
  }

  if (countryCode === "KR") {
    return parseKoreanAddress(address);
  }

  return parseNorthAmericanAddress(
    address,
    "US",
  );
}