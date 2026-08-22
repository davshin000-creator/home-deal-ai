import type {
  RealEstateDataProvider,
  RealEstateProviderAnalyzeInput,
  RealEstateProviderResult,
} from "./provider-types";

import {
  RealEstateProviderError,
} from "./provider-types";

export class CanadaProvider
  implements RealEstateDataProvider
{
  readonly id = "canada_pending";
  readonly countryCode = "CA";

  async analyze(
    input: RealEstateProviderAnalyzeInput,
  ): Promise<RealEstateProviderResult> {
    if (input.countryCode !== "CA") {
      throw new RealEstateProviderError(
        "CanadaProvider supports Canadian properties only.",
        400,
        {
          code: "INVALID_PROVIDER_COUNTRY",
          country: input.countryCode,
        },
      );
    }

    throw new RealEstateProviderError(
      "Canadian property analysis provider is not connected yet.",
      503,
      {
        code: "CANADA_PROVIDER_NOT_CONNECTED",
        country: "CA",
      },
    );
  }
}

export const canadaProvider =
  new CanadaProvider();