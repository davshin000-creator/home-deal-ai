import type {
  DocumentProps,
} from "@react-pdf/renderer";

import {
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";

import type {
  ReactElement,
} from "react";

import { pdfTheme } from "@/lib/pdf/pdfTheme";

type Props = {
  report: {
    property_address?: string | null;
    investor_type?: string | null;
    created_at?: string | null;
    is_full_report?: boolean | null;
    report_html?: string | null;
  };

  property?: any;
};

function safeNumber(
  value: unknown,
  fallback = 0,
) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

function money(value?: unknown) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return `$${Math.round(
    number,
  ).toLocaleString("en-US")}`;
}

function percent(
  value?: unknown,
  digits = 1,
) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return `${number.toFixed(digits)}%`;
}

function scoreGrade(score: number) {
  if (score >= 90) return "A";
  if (score >= 80) return "B+";
  if (score >= 70) return "B";
  if (score >= 60) return "C+";
  if (score >= 50) return "C";

  return "D";
}

function projectedValue(
  startingValue: number,
  annualRate: number,
  year: number,
) {
  return (
    startingValue *
    Math.pow(
      1 + annualRate / 100,
      year,
    )
  );
}

export default function PropertyReportPdf({
  report,
  property,
}: Props): ReactElement<DocumentProps> {
  const address =
    property?.address ||
    report.property_address ||
    "Property";

  const listingPrice =
    safeNumber(property?.listing_price);

  const fairValue =
    safeNumber(property?.fair_value);

  const dealScore =
    safeNumber(property?.deal_score);

  const overallScore =
    safeNumber(
      property?.overall_score ??
        dealScore,
    );

  const forecastScore =
    safeNumber(
      property?.forecast_score,
    );

  const neighborhoodScore =
    safeNumber(
      property?.neighborhood_score,
    );

  const confidence =
    safeNumber(
      property?.confidence_score,
    );

  const rent =
    safeNumber(
      property?.estimated_monthly_rent,
    );

  const cashFlow =
    safeNumber(
      property
        ?.estimated_monthly_cash_flow,
    );

  const yieldValue =
    safeNumber(
      property?.gross_rent_yield,
    );

  const appreciation =
    safeNumber(
      property?.expected_appreciation,
    );

  const comparables =
    Array.isArray(
      property?.comparables,
    )
      ? property.comparables
      : [];

  const negotiation =
    property?.negotiation ?? {};

  const homeReport =
    property?.home_report ?? {};

  const baseValue =
    fairValue || listingPrice;

  const conservativeRate =
    appreciation - 2;

  const optimisticRate =
    appreciation + 2;

  const base5Y =
    projectedValue(
      baseValue,
      appreciation,
      5,
    );

  const conservative5Y =
    projectedValue(
      baseValue,
      conservativeRate,
      5,
    );

  const optimistic5Y =
    projectedValue(
      baseValue,
      optimisticRate,
      5,
    );

  const generatedDate =
    report.created_at
      ? new Date(
          report.created_at,
        ).toLocaleDateString(
          "en-US",
        )
      : new Date().toLocaleDateString(
          "en-US",
        );

  const recommendation =
    homeReport.recommendation_label ||
    homeReport.recommended_action ||
    property?.status ||
    "Review Carefully";

  const thesis =
    homeReport.investment_thesis ||
    property?.summary ||
    "Nestrova analyzed this property using valuation, rental, market, and financing signals.";

  const strengths =
    Array.isArray(
      homeReport.key_strengths,
    )
      ? homeReport.key_strengths
      : [];

  const risks =
    Array.isArray(
      homeReport.key_risks,
    )
      ? homeReport.key_risks
      : [];

  return (
    <Document>
      <Page
        size="A4"
        style={pdfTheme.page}
      >
        <View
          style={pdfTheme.coverHero}
        >
          <Text
            style={pdfTheme.eyebrow}
          >
            NESTROVA
          </Text>

          <Text
            style={pdfTheme.coverTitle}
          >
            Property Intelligence Report
          </Text>

          <Text
            style={pdfTheme.coverAddress}
          >
            {address}
          </Text>

          <View
            style={
              pdfTheme.coverScoreRow
            }
          >
            <View>
              <Text
                style={
                  pdfTheme.scoreLabel
                }
              >
                Investment Score
              </Text>

              <Text
                style={
                  pdfTheme.coverScore
                }
              >
                {Math.round(
                  overallScore,
                )}
                /100
              </Text>
            </View>

            <View>
              <Text
                style={
                  pdfTheme.scoreLabel
                }
              >
                Grade
              </Text>

              <Text
                style={
                  pdfTheme.coverGrade
                }
              >
                {scoreGrade(
                  overallScore,
                )}
              </Text>
            </View>
          </View>

          <View
            style={
              pdfTheme.recommendationBox
            }
          >
            <Text
              style={
                pdfTheme.recommendationLabel
              }
            >
              AI RECOMMENDATION
            </Text>

            <Text
              style={
                pdfTheme.recommendationValue
              }
            >
              {recommendation}
            </Text>
          </View>
        </View>

        <View
          style={pdfTheme.metricsGrid}
        >
          <View style={pdfTheme.metricCard}>
            <Text style={pdfTheme.label}>
              Listing Price
            </Text>
            <Text style={pdfTheme.metricValue}>
              {money(listingPrice)}
            </Text>
          </View>

          <View style={pdfTheme.metricCard}>
            <Text style={pdfTheme.label}>
              Estimated Fair Value
            </Text>
            <Text style={pdfTheme.metricValue}>
              {money(fairValue)}
            </Text>
          </View>

          <View style={pdfTheme.metricCard}>
            <Text style={pdfTheme.label}>
              Rental Yield
            </Text>
            <Text style={pdfTheme.metricValue}>
              {percent(
                yieldValue,
                2,
              )}
            </Text>
          </View>

          <View style={pdfTheme.metricCard}>
            <Text style={pdfTheme.label}>
              Cash Flow
            </Text>
            <Text style={pdfTheme.metricValue}>
              {money(cashFlow)}/mo
            </Text>
          </View>
        </View>

        <Text style={pdfTheme.footer}>
          Generated {generatedDate} · Nestrova AI
        </Text>
      </Page>

      <Page
        size="A4"
        style={pdfTheme.page}
      >
        <Text
          style={pdfTheme.pageNumber}
        >
          02 / EXECUTIVE INTELLIGENCE
        </Text>

        <Text
          style={pdfTheme.sectionTitleLarge}
        >
          Executive Intelligence
        </Text>

        <View style={pdfTheme.card}>
          <Text style={pdfTheme.label}>
            Investment Thesis
          </Text>

          <Text
            style={pdfTheme.bodyText}
          >
            {thesis}
          </Text>
        </View>

        <View
          style={pdfTheme.metricsGrid}
        >
          <View style={pdfTheme.metricCard}>
            <Text style={pdfTheme.label}>
              Deal Score
            </Text>
            <Text style={pdfTheme.metricValue}>
              {Math.round(dealScore)}
            </Text>
          </View>

          <View style={pdfTheme.metricCard}>
            <Text style={pdfTheme.label}>
              Forecast Score
            </Text>
            <Text style={pdfTheme.metricValue}>
              {Math.round(
                forecastScore,
              )}
            </Text>
          </View>

          <View style={pdfTheme.metricCard}>
            <Text style={pdfTheme.label}>
              Neighborhood
            </Text>
            <Text style={pdfTheme.metricValue}>
              {Math.round(
                neighborhoodScore,
              )}
            </Text>
          </View>

          <View style={pdfTheme.metricCard}>
            <Text style={pdfTheme.label}>
              AI Confidence
            </Text>
            <Text style={pdfTheme.metricValue}>
              {Math.round(
                confidence,
              )}
              %
            </Text>
          </View>
        </View>

        <View
          style={pdfTheme.twoColumn}
        >
          <View
            style={pdfTheme.halfColumn}
          >
            <Text
              style={pdfTheme.subheading}
            >
              Key Strengths
            </Text>

            {(strengths.length
              ? strengths
              : property?.reasons ?? []
            )
              .slice(0, 5)
              .map(
                (
                  item: string,
                  index: number,
                ) => (
                  <Text
                    key={index}
                    style={
                      pdfTheme.bulletPositive
                    }
                  >
                    • {item}
                  </Text>
                ),
              )}
          </View>

          <View
            style={pdfTheme.halfColumn}
          >
            <Text
              style={pdfTheme.subheading}
            >
              Primary Risks
            </Text>

            {(risks.length
              ? risks
              : [
                  "Confirm property condition and inspection findings.",
                  "Review taxes, insurance, HOA fees, and closing costs.",
                ]
            )
              .slice(0, 5)
              .map(
                (
                  item: string,
                  index: number,
                ) => (
                  <Text
                    key={index}
                    style={
                      pdfTheme.bulletWarning
                    }
                  >
                    • {item}
                  </Text>
                ),
              )}
          </View>
        </View>

        <View style={pdfTheme.card}>
          <View style={pdfTheme.row}>
            <Text style={pdfTheme.label}>
              Estimated Monthly Rent
            </Text>
            <Text style={pdfTheme.value}>
              {money(rent)}
            </Text>
          </View>

          <View style={pdfTheme.row}>
            <Text style={pdfTheme.label}>
              Gross Rental Yield
            </Text>
            <Text style={pdfTheme.value}>
              {percent(
                yieldValue,
                2,
              )}
            </Text>
          </View>

          <View style={pdfTheme.row}>
            <Text style={pdfTheme.label}>
              Monthly Cash Flow
            </Text>
            <Text style={pdfTheme.value}>
              {money(cashFlow)}
            </Text>
          </View>
        </View>

        <Text style={pdfTheme.footer}>
          Nestrova Property Intelligence
        </Text>
      </Page>

      <Page
        size="A4"
        style={pdfTheme.page}
      >
        <Text
          style={pdfTheme.pageNumber}
        >
          03 / FIVE-YEAR OUTLOOK
        </Text>

        <Text
          style={pdfTheme.sectionTitleLarge}
        >
          5-Year Value Outlook
        </Text>

        <Text style={pdfTheme.bodyMuted}>
          Scenario projections use the current Nestrova expected appreciation estimate.
        </Text>

        <View
          style={pdfTheme.forecastPanel}
        >
          <View
            style={pdfTheme.forecastColumn}
          >
            <Text style={pdfTheme.label}>
              Conservative
            </Text>

            <Text
              style={pdfTheme.forecastValue}
            >
              {money(
                conservative5Y,
              )}
            </Text>

            <Text style={pdfTheme.bodyMuted}>
              {percent(
                conservativeRate,
              )} annual
            </Text>
          </View>

          <View
            style={pdfTheme.forecastColumnPrimary}
          >
            <Text style={pdfTheme.labelLight}>
              Base Case
            </Text>

            <Text
              style={pdfTheme.forecastValueLight}
            >
              {money(base5Y)}
            </Text>

            <Text style={pdfTheme.bodyLight}>
              {percent(
                appreciation,
              )} annual
            </Text>
          </View>

          <View
            style={pdfTheme.forecastColumn}
          >
            <Text style={pdfTheme.label}>
              Optimistic
            </Text>

            <Text
              style={pdfTheme.forecastValue}
            >
              {money(
                optimistic5Y,
              )}
            </Text>

            <Text style={pdfTheme.bodyMuted}>
              {percent(
                optimisticRate,
              )} annual
            </Text>
          </View>
        </View>

        {[1, 2, 3, 4, 5].map(
          (year) => {
            const value =
              projectedValue(
                baseValue,
                appreciation,
                year,
              );

            const max =
              Math.max(
                base5Y,
                baseValue,
                1,
              );

            const width =
              Math.max(
                8,
                Math.min(
                  100,
                  (value / max) * 100,
                ),
              );

            return (
              <View
                key={year}
                style={
                  pdfTheme.timelineRow
                }
              >
                <View
                  style={
                    pdfTheme.timelineHeader
                  }
                >
                  <Text
                    style={
                      pdfTheme.timelineYear
                    }
                  >
                    Year {year}
                  </Text>

                  <Text
                    style={
                      pdfTheme.timelineValue
                    }
                  >
                    {money(value)}
                  </Text>
                </View>

                <View
                  style={
                    pdfTheme.barTrack
                  }
                >
                  <View
                    style={[
                      pdfTheme.barFill,
                      {
                        width: `${width}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          },
        )}

        <View style={pdfTheme.card}>
          <View style={pdfTheme.row}>
            <Text style={pdfTheme.label}>
              Starting Value
            </Text>
            <Text style={pdfTheme.value}>
              {money(baseValue)}
            </Text>
          </View>

          <View style={pdfTheme.row}>
            <Text style={pdfTheme.label}>
              Base 5Y Gain
            </Text>
            <Text style={pdfTheme.value}>
              {money(
                base5Y -
                  baseValue,
              )}
            </Text>
          </View>
        </View>

        <Text style={pdfTheme.footer}>
          Scenario estimates are not guarantees of future value.
        </Text>
      </Page>

      <Page
        size="A4"
        style={pdfTheme.page}
      >
        <Text
          style={pdfTheme.pageNumber}
        >
          04 / COMPARABLE INTELLIGENCE
        </Text>

        <Text
          style={pdfTheme.sectionTitleLarge}
        >
          Comparable Intelligence
        </Text>

        {comparables.length > 0 ? (
          <>
            <View
              style={
                pdfTheme.bestComparable
              }
            >
              <Text
                style={
                  pdfTheme.labelLight
                }
              >
                BEST MATCH
              </Text>

              <Text
                style={
                  pdfTheme.bestComparableAddress
                }
              >
                {comparables[0]
                  ?.address ?? "—"}
              </Text>

              <Text
                style={
                  pdfTheme.bodyLight
                }
              >
                Similarity{" "}
                {Math.round(
                  safeNumber(
                    comparables[0]
                      ?.similarity_score,
                  ),
                )}
                /100 ·{" "}
                {money(
                  comparables[0]
                    ?.price,
                )}
              </Text>
            </View>

            {comparables
              .slice(0, 5)
              .map(
                (
                  comp: any,
                  index: number,
                ) => (
                  <View
                    key={
                      comp.id ??
                      `${comp.address}-${index}`
                    }
                    style={pdfTheme.card}
                  >
                    <Text
                      style={
                        pdfTheme.compAddress
                      }
                    >
                      #{index + 1}{" "}
                      {comp.address ??
                        "Comparable Property"}
                    </Text>

                    <View style={pdfTheme.row}>
                      <Text
                        style={
                          pdfTheme.label
                        }
                      >
                        Price
                      </Text>

                      <Text
                        style={
                          pdfTheme.value
                        }
                      >
                        {money(
                          comp.price,
                        )}
                      </Text>
                    </View>

                    <View style={pdfTheme.row}>
                      <Text
                        style={
                          pdfTheme.label
                        }
                      >
                        Beds / Baths
                      </Text>

                      <Text
                        style={
                          pdfTheme.value
                        }
                      >
                        {comp.bedrooms ??
                          "—"}{" "}
                        /{" "}
                        {comp.bathrooms ??
                          "—"}
                      </Text>
                    </View>

                    <View style={pdfTheme.row}>
                      <Text
                        style={
                          pdfTheme.label
                        }
                      >
                        Square Feet
                      </Text>

                      <Text
                        style={
                          pdfTheme.value
                        }
                      >
                        {safeNumber(
                          comp.square_footage,
                        ).toLocaleString(
                          "en-US",
                        )}
                      </Text>
                    </View>

                    <View style={pdfTheme.row}>
                      <Text
                        style={
                          pdfTheme.label
                        }
                      >
                        Similarity
                      </Text>

                      <Text
                        style={
                          pdfTheme.value
                        }
                      >
                        {Math.round(
                          safeNumber(
                            comp.similarity_score,
                          ),
                        )}
                        /100
                      </Text>
                    </View>
                  </View>
                ),
              )}
          </>
        ) : (
          <Text style={pdfTheme.bodyMuted}>
            Comparable data was unavailable for this report.
          </Text>
        )}

        <Text style={pdfTheme.footer}>
          Comparable results are market references, not substitutes for an appraisal.
        </Text>
      </Page>

      <Page
        size="A4"
        style={pdfTheme.page}
      >
        <Text
          style={pdfTheme.pageNumber}
        >
          05 / NEGOTIATION AI
        </Text>

        <Text
          style={pdfTheme.sectionTitleLarge}
        >
          Negotiation AI
        </Text>

        <View
          style={pdfTheme.metricsGrid}
        >
          <View style={pdfTheme.metricCard}>
            <Text style={pdfTheme.label}>
              Opening Offer
            </Text>
            <Text style={pdfTheme.metricValue}>
              {money(
                negotiation
                  .suggested_offer,
              )}
            </Text>
          </View>

          <View style={pdfTheme.metricCard}>
            <Text style={pdfTheme.label}>
              Target Price
            </Text>
            <Text style={pdfTheme.metricValue}>
              {money(
                negotiation
                  .recommended_target,
              )}
            </Text>
          </View>

          <View style={pdfTheme.metricCard}>
            <Text style={pdfTheme.label}>
              Walk-Away
            </Text>
            <Text style={pdfTheme.metricValue}>
              {money(
                negotiation
                  .walk_away_price ??
                  negotiation
                    .maximum_offer,
              )}
            </Text>
          </View>

          <View style={pdfTheme.metricCard}>
            <Text style={pdfTheme.label}>
              Estimated Savings
            </Text>
            <Text style={pdfTheme.metricValue}>
              {money(
                negotiation
                  .estimated_savings,
              )}
            </Text>
          </View>
        </View>

        <View style={pdfTheme.card}>
          <View style={pdfTheme.row}>
            <Text style={pdfTheme.label}>
              Comparable Median
            </Text>
            <Text style={pdfTheme.value}>
              {money(
                negotiation
                  .comparable_median,
              )}
            </Text>
          </View>

          <View style={pdfTheme.row}>
            <Text style={pdfTheme.label}>
              Best Match Price
            </Text>
            <Text style={pdfTheme.value}>
              {money(
                negotiation
                  .best_match_price,
              )}
            </Text>
          </View>

          <View style={pdfTheme.row}>
            <Text style={pdfTheme.label}>
              Market Reference
            </Text>
            <Text style={pdfTheme.value}>
              {money(
                negotiation
                  .market_reference,
              )}
            </Text>
          </View>
        </View>

        <View
          style={pdfTheme.strategyBox}
        >
          <Text
            style={pdfTheme.subheading}
          >
            Strategy
          </Text>

          <Text
            style={pdfTheme.bodyText}
          >
            {negotiation.strategy ||
              "Negotiation strategy unavailable."}
          </Text>
        </View>

        {(negotiation
          .strategy_reasons ?? []
        )
          .slice(0, 5)
          .map(
            (
              reason: string,
              index: number,
            ) => (
              <Text
                key={index}
                style={
                  pdfTheme.bulletPositive
                }
              >
                • {reason}
              </Text>
            ),
          )}

        <Text style={pdfTheme.footer}>
          Negotiation ranges are analytical references only.
        </Text>
      </Page>

      <Page
        size="A4"
        style={pdfTheme.page}
      >
        <Text
          style={pdfTheme.pageNumber}
        >
          06 / PROPERTY & FINAL ASSESSMENT
        </Text>

        <Text
          style={pdfTheme.sectionTitleLarge}
        >
          Property & Final Assessment
        </Text>

        <View
          style={pdfTheme.metricsGrid}
        >
          <View style={pdfTheme.metricCard}>
            <Text style={pdfTheme.label}>
              Property Type
            </Text>
            <Text style={pdfTheme.metricValueSmall}>
              {property?.property_type ||
                "—"}
            </Text>
          </View>

          <View style={pdfTheme.metricCard}>
            <Text style={pdfTheme.label}>
              Beds / Baths
            </Text>
            <Text style={pdfTheme.metricValueSmall}>
              {property?.bedrooms ??
                "—"}{" "}
              /{" "}
              {property?.bathrooms ??
                "—"}
            </Text>
          </View>

          <View style={pdfTheme.metricCard}>
            <Text style={pdfTheme.label}>
              Square Feet
            </Text>
            <Text style={pdfTheme.metricValueSmall}>
              {property
                ?.square_footage
                ? safeNumber(
                    property
                      .square_footage,
                  ).toLocaleString(
                    "en-US",
                  )
                : "—"}
            </Text>
          </View>

          <View style={pdfTheme.metricCard}>
            <Text style={pdfTheme.label}>
              Year Built
            </Text>
            <Text style={pdfTheme.metricValueSmall}>
              {property?.year_built ??
                "—"}
            </Text>
          </View>
        </View>

        <Text
          style={pdfTheme.subheading}
        >
          Financing Snapshot
        </Text>

        <View style={pdfTheme.card}>
          <View style={pdfTheme.row}>
            <Text style={pdfTheme.label}>
              Down Payment
            </Text>
            <Text style={pdfTheme.value}>
              {money(
                property
                  ?.down_payment,
              )}
            </Text>
          </View>

          <View style={pdfTheme.row}>
            <Text style={pdfTheme.label}>
              Loan Amount
            </Text>
            <Text style={pdfTheme.value}>
              {money(
                property?.loan_amount,
              )}
            </Text>
          </View>

          <View style={pdfTheme.row}>
            <Text style={pdfTheme.label}>
              Monthly Mortgage
            </Text>
            <Text style={pdfTheme.value}>
              {money(
                property
                  ?.monthly_mortgage,
              )}
            </Text>
          </View>

          <View style={pdfTheme.row}>
            <Text style={pdfTheme.label}>
              Property Tax
            </Text>
            <Text style={pdfTheme.value}>
              {money(
                property
                  ?.monthly_property_tax,
              )}
            </Text>
          </View>

          <View style={pdfTheme.row}>
            <Text style={pdfTheme.label}>
              Insurance
            </Text>
            <Text style={pdfTheme.value}>
              {money(
                property
                  ?.monthly_insurance,
              )}
            </Text>
          </View>
        </View>

        <View
          style={
            pdfTheme.finalRecommendation
          }
        >
          <Text
            style={
              pdfTheme.labelLight
            }
          >
            FINAL AI ASSESSMENT
          </Text>

          <Text
            style={
              pdfTheme.finalRecommendationTitle
            }
          >
            {recommendation}
          </Text>

          <Text
            style={
              pdfTheme.bodyLight
            }
          >
            {thesis}
          </Text>
        </View>

        <View
          style={pdfTheme.disclaimer}
        >
          <Text
            style={
              pdfTheme.disclaimerTitle
            }
          >
            Important Disclosure
          </Text>

          <Text
            style={
              pdfTheme.disclaimerText
            }
          >
            This report is generated from automated models and available property data. It is informational only and is not financial, legal, tax, lending, appraisal, inspection, or investment advice. Property values, rent estimates, financing assumptions, and future projections may differ materially from actual outcomes.
          </Text>
        </View>

        <Text style={pdfTheme.footer}>
          Nestrova AI · Property Intelligence Report
        </Text>
      </Page>
    </Document>
  );
}
