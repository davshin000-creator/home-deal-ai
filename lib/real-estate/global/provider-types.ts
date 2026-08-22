import type {
  RealEstateCountryCode,
  RealEstateCurrencyCode,
} from "./country-config";

export type RealEstateProviderProperty = {
  externalId?: string | null;
  address: string;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  countryCode: RealEstateCountryCode;

  latitude?: number | null;
  longitude?: number | null;

  propertyType?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  squareFootage?: number | null;
  lotSize?: number | null;
  yearBuilt?: number | null;

  listingPrice?: number | null;
  currency: RealEstateCurrencyCode;

  imageUrl?: string | null;
};

export type RealEstateProviderValuation = {
  estimatedValue?: number | null;
  lowEstimate?: number | null;
  highEstimate?: number | null;
  confidence?: number | null;
  currency: RealEstateCurrencyCode;
};

export type RealEstateProviderRentEstimate = {
  monthlyRent?: number | null;
  lowEstimate?: number | null;
  highEstimate?: number | null;
  confidence?: number | null;
  currency: RealEstateCurrencyCode;
};

export type RealEstateProviderComparable = {
  externalId?: string | null;
  address: string;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;

  salePrice?: number | null;
  listPrice?: number | null;
  soldDate?: string | null;

  bedrooms?: number | null;
  bathrooms?: number | null;
  squareFootage?: number | null;
  yearBuilt?: number | null;

  distanceMiles?: number | null;
  currency: RealEstateCurrencyCode;
};

export type RealEstateProviderResult = {
  provider: string;
  countryCode: RealEstateCountryCode;
  property: RealEstateProviderProperty;

  valuation?: RealEstateProviderValuation | null;
  rentEstimate?: RealEstateProviderRentEstimate | null;
  comparables?: RealEstateProviderComparable[];

  raw?: unknown;
};

export class RealEstateProviderError extends Error {
  readonly status: number;
  readonly data: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    data: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "RealEstateProviderError";
    this.status = status;
    this.data = data;
  }
}
export type RealEstateProviderAnalyzeInput = {
  address: string;
  countryCode: RealEstateCountryCode;
  listingPrice?: number | null;

  financing?: {
    downPaymentPercent?: number | null;
    interestRate?: number | null;
    loanTermYears?: number | null;
  };

  requestContext?: {
    userId?: string | null;
    isPro?: boolean;
  };
};

export interface RealEstateDataProvider {
  id: string;
  countryCode: RealEstateCountryCode;

  analyze(
    input: RealEstateProviderAnalyzeInput,
  ): Promise<RealEstateProviderResult>;
}