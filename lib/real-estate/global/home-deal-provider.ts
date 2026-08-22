import {
  parseRealEstateLocation,
} from "./location-parser";

import type {
  RealEstateDataProvider,
  RealEstateProviderAnalyzeInput,
  RealEstateProviderComparable,
  RealEstateProviderResult,
} from "./provider-types";

import {
  RealEstateProviderError,
} from "./provider-types";

const HOME_DEAL_API_URL =
  process.env.HOME_DEAL_API_URL ||
  "https://home-deal-api.onrender.com";

const INTERNAL_API_KEY =
  process.env.NESTROVA_INTERNAL_API_KEY;

type RawObject = Record<string, unknown>;

function numberOrNull(
  value: unknown,
): number | null {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function stringOrNull(
  value: unknown,
): string | null {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return null;
  }

  return value.trim();
}

function normalizeComparable(
  raw: RawObject,
): RealEstateProviderComparable {
  const address =
    stringOrNull(raw.address) ||
    stringOrNull(raw.formatted_address) ||
    "Comparable property";

  const location =
    parseRealEstateLocation(
      address,
      "US",
    );

  return {
    externalId:
      stringOrNull(raw.id) ||
      stringOrNull(raw.property_id),

    address,

    city:
      stringOrNull(raw.city) ||
      location.city,

    region:
      stringOrNull(raw.state) ||
      location.region,

    postalCode:
      stringOrNull(raw.zip_code) ||
      stringOrNull(raw.zip) ||
      location.postalCode,

    salePrice:
      numberOrNull(raw.sale_price) ??
      numberOrNull(raw.price),

    listPrice:
      numberOrNull(raw.listing_price) ??
      numberOrNull(raw.list_price),

    soldDate:
      stringOrNull(raw.sale_date) ||
      stringOrNull(raw.sold_date),

    bedrooms:
      numberOrNull(raw.bedrooms),

    bathrooms:
      numberOrNull(raw.bathrooms),

    squareFootage:
      numberOrNull(
        raw.square_footage ??
          raw.squareFootage,
      ),

    yearBuilt:
      numberOrNull(
        raw.year_built ??
          raw.yearBuilt,
      ),

    distanceMiles:
      numberOrNull(
        raw.distance_miles ??
          raw.distance,
      ),

    currency: "USD",
  };
}

export class HomeDealProvider
  implements RealEstateDataProvider
{
  readonly id = "rentcast";
  readonly countryCode = "US";

  async analyze(
    input: RealEstateProviderAnalyzeInput,
  ): Promise<RealEstateProviderResult> {
    if (input.countryCode !== "US") {
      throw new Error(
        "HomeDealProvider currently supports US properties only.",
      );
    }

    const response = await fetch(
      `${HOME_DEAL_API_URL}/analyze`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          ...(INTERNAL_API_KEY
            ? {
                "X-Nestrova-Internal-Key":
                  INTERNAL_API_KEY,
              }
            : {}),
        },

        body: JSON.stringify({
          address: input.address,
          listing_price:
            input.listingPrice ?? 0,

          down_payment_percent:
            input.financing?.downPaymentPercent ??
            25,

          interest_rate:
            input.financing?.interestRate ??
            6.5,

          loan_term_years:
            input.financing?.loanTermYears ??
            30,

          user_id:
            input.requestContext?.userId ??
            null,

          is_pro:
            input.requestContext?.isPro ??
            false,
        }),

        cache: "no-store",
      },
    );

    const raw =
      (await response
        .json()
        .catch(() => ({}))) as RawObject;

    if (!response.ok) {
      const detail =
        stringOrNull(raw.detail) ||
        stringOrNull(raw.error) ||
        "US property provider request failed.";

      throw new RealEstateProviderError(
        detail,
        response.status,
        raw,
      );
    }

    const resolvedAddress =
      stringOrNull(raw.address) ||
      input.address;

    const location =
      parseRealEstateLocation(
        resolvedAddress,
        "US",
      );

    const rawComparables =
      Array.isArray(raw.comparables)
        ? raw.comparables
        : [];

    const comparables =
      rawComparables
        .filter(
          (item): item is RawObject =>
            Boolean(
              item &&
                typeof item ===
                  "object",
            ),
        )
        .map(normalizeComparable);

    return {
      provider: this.id,
      countryCode: "US",

      property: {
        address: resolvedAddress,

        city: location.city,
        region: location.region,
        postalCode:
          location.postalCode,

        countryCode: "US",

        latitude:
          numberOrNull(raw.latitude),

        longitude:
          numberOrNull(raw.longitude),

        propertyType:
          stringOrNull(
            raw.property_type,
          ),

        bedrooms:
          numberOrNull(raw.bedrooms),

        bathrooms:
          numberOrNull(raw.bathrooms),

        squareFootage:
          numberOrNull(
            raw.square_footage,
          ),

        yearBuilt:
          numberOrNull(
            raw.year_built,
          ),

        listingPrice:
          numberOrNull(
            raw.listing_price,
          ) ??
          input.listingPrice ??
          null,

        currency: "USD",

        imageUrl:
          stringOrNull(raw.image_url) ||
          stringOrNull(raw.thumbnail) ||
          stringOrNull(raw.photo_url),
      },

      valuation: {
        estimatedValue:
          numberOrNull(raw.fair_value),

        lowEstimate:
          numberOrNull(
            raw.fair_value_low,
          ),

        highEstimate:
          numberOrNull(
            raw.fair_value_high,
          ),

        confidence:
          numberOrNull(
            raw.confidence_score,
          ),

        currency: "USD",
      },

      rentEstimate: {
        monthlyRent:
          numberOrNull(
            raw.estimated_monthly_rent,
          ),

        currency: "USD",
      },

      comparables,

      raw,
    };
  }
}

export const homeDealProvider =
  new HomeDealProvider();