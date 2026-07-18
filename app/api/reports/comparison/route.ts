import { NextResponse } from "next/server";

import {
  createSupabaseAdminClient,
  getCurrentUserProfile,
} from "@/lib/supabase/server";

import type {
  CompareProperty,
  CompareResult,
} from "@/types/comparison";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPropertyLocation(property: CompareProperty) {
  const location = [property.city, property.state]
    .filter(Boolean)
    .join(", ");

  return location
    ? `${escapeHtml(property.address)} · ${escapeHtml(location)}`
    : escapeHtml(property.address);
}

function buildMetricRow(
  label: string,
  firstValue: string,
  secondValue: string,
) {
  return `
    <tr>
      <td>${escapeHtml(label)}</td>
      <td>${escapeHtml(firstValue)}</td>
      <td>${escapeHtml(secondValue)}</td>
    </tr>
  `;
}

function buildList(items: string[], emptyText: string) {
  const normalizedItems = items
    .map((item) => String(item || "").trim())
    .filter(Boolean);

  if (normalizedItems.length === 0) {
    return `<li>${escapeHtml(emptyText)}</li>`;
  }

  return normalizedItems
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
}

function buildPropertyCard(
  property: CompareProperty,
  rank: number,
) {
  const valueDifference =
    property.fairValue - property.price;

  const valueDifferencePercent =
    property.price > 0
      ? (valueDifference / property.price) * 100
      : 0;

  return `
    <section class="property-card">
      <div class="property-heading">
        <div>
          <span class="rank">Rank #${rank}</span>
          <h2>${formatPropertyLocation(property)}</h2>
        </div>

        <span class="recommendation">
          ${escapeHtml(property.recommendation)}
        </span>
      </div>

      <p class="summary">
        ${escapeHtml(property.summary)}
      </p>

      <div class="metrics-grid">
        <div class="metric">
          <span>Listing price</span>
          <strong>${formatCurrency(property.price)}</strong>
        </div>

        <div class="metric">
          <span>AI fair value</span>
          <strong>${formatCurrency(property.fairValue)}</strong>
        </div>

        <div class="metric">
          <span>Value position</span>
          <strong>
            ${valueDifferencePercent >= 0 ? "+" : ""}
            ${valueDifferencePercent.toFixed(1)}%
          </strong>
        </div>

        <div class="metric">
          <span>Estimated rent</span>
          <strong>
            ${formatCurrency(property.estimatedRent)}/mo
          </strong>
        </div>
      </div>

      <div class="score-grid">
        <div><span>AI Score</span><strong>${property.brainScore}</strong></div>
        <div><span>Risk</span><strong>${property.riskScore}</strong></div>
        <div><span>Rental</span><strong>${property.rentalScore}</strong></div>
        <div><span>Negotiation</span><strong>${property.negotiationScore}</strong></div>
        <div><span>Forecast</span><strong>${property.forecastScore}</strong></div>
        <div><span>Cash Flow</span><strong>${property.cashflowScore}</strong></div>
        <div><span>ROI</span><strong>${property.roiScore}</strong></div>
      </div>

      <div class="insight-grid">
        <div class="insight">
          <h3>Strengths</h3>
          <ul>
            ${buildList(
              property.strengths,
              "No additional strengths were identified.",
            )}
          </ul>
        </div>

        <div class="insight">
          <h3>Risks and due diligence</h3>
          <ul>
            ${buildList(
              property.risks,
              "Complete standard property due diligence.",
            )}
          </ul>
        </div>
      </div>
    </section>
  `;
}

function buildComparisonHtml(result: CompareResult) {
  const firstProperty = result.properties[0];
  const secondProperty = result.properties[1];

  if (!firstProperty || !secondProperty) {
    throw new Error(
      "Two properties are required to create a comparison report.",
    );
  }

  const winner = result.winner.property;
  const generatedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());

  const rankingHtml = result.ranking
    .map((property, index) =>
      buildPropertyCard(property, index + 1),
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <title>Nestrova Comparison Memo</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: #f3f4f6;
            color: #111827;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
          }

          .report {
            width: min(1120px, 100%);
            margin: 0 auto;
            background: #ffffff;
          }

          .hero {
            padding: 64px;
            background:
              radial-gradient(
                circle at top right,
                rgba(99, 102, 241, 0.35),
                transparent 42%
              ),
              #050505;
            color: #ffffff;
          }

          .eyebrow {
            margin: 0;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.24em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.45);
          }

          .hero h1 {
            max-width: 800px;
            margin: 18px 0 0;
            font-size: 54px;
            line-height: 1.02;
            letter-spacing: -0.055em;
          }

          .hero-copy {
            max-width: 760px;
            margin: 22px 0 0;
            font-size: 18px;
            line-height: 1.7;
            color: rgba(255, 255, 255, 0.65);
          }

          .winner-box {
            margin-top: 36px;
            padding: 28px;
            border: 1px solid rgba(255, 255, 255, 0.13);
            border-radius: 24px;
            background: rgba(255, 255, 255, 0.07);
          }

          .winner-box span {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #86efac;
          }

          .winner-box h2 {
            margin: 10px 0 0;
            font-size: 32px;
            letter-spacing: -0.035em;
          }

          .winner-box p {
            margin: 12px 0 0;
            color: rgba(255, 255, 255, 0.65);
          }

          .content {
            padding: 56px 64px;
          }

          .section {
            margin-bottom: 48px;
          }

          .section-label {
            margin: 0;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: #6b7280;
          }

          .section h2 {
            margin: 10px 0 0;
            font-size: 34px;
            letter-spacing: -0.04em;
          }

          .executive-summary {
            margin-top: 20px;
            font-size: 17px;
            line-height: 1.75;
            color: #4b5563;
          }

          .reasons {
            display: grid;
            gap: 10px;
            margin: 22px 0 0;
            padding: 0;
            list-style: none;
          }

          .reasons li {
            padding: 14px 16px;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            background: #f9fafb;
          }

          table {
            width: 100%;
            margin-top: 22px;
            border-collapse: collapse;
            overflow: hidden;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
          }

          th,
          td {
            padding: 14px 16px;
            border-bottom: 1px solid #e5e7eb;
            text-align: left;
            font-size: 13px;
          }

          th {
            background: #111827;
            color: #ffffff;
          }

          tr:last-child td {
            border-bottom: 0;
          }

          .property-card {
            margin-bottom: 30px;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-radius: 24px;
            break-inside: avoid;
          }

          .property-heading {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            align-items: flex-start;
          }

          .rank {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #6b7280;
          }

          .property-heading h2 {
            margin: 8px 0 0;
            font-size: 25px;
            letter-spacing: -0.035em;
          }

          .recommendation {
            padding: 8px 12px;
            border-radius: 999px;
            background: #dcfce7;
            color: #166534;
            font-size: 12px;
            font-weight: 700;
          }

          .summary {
            margin: 18px 0 0;
            line-height: 1.65;
            color: #4b5563;
          }

          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-top: 24px;
          }

          .metric {
            padding: 16px;
            border-radius: 16px;
            background: #f3f4f6;
          }

          .metric span,
          .score-grid span {
            display: block;
            font-size: 11px;
            color: #6b7280;
          }

          .metric strong {
            display: block;
            margin-top: 7px;
            font-size: 16px;
          }

          .score-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 8px;
            margin-top: 12px;
          }

          .score-grid div {
            padding: 12px;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            text-align: center;
          }

          .score-grid strong {
            display: block;
            margin-top: 6px;
            font-size: 18px;
          }

          .insight-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-top: 22px;
          }

          .insight {
            padding: 20px;
            border-radius: 18px;
            background: #f9fafb;
          }

          .insight h3 {
            margin: 0;
            font-size: 15px;
          }

          .insight ul {
            margin: 12px 0 0;
            padding-left: 19px;
            color: #4b5563;
          }

          .insight li {
            margin-bottom: 8px;
            line-height: 1.5;
          }

          .footer {
            padding: 28px 64px 46px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 11px;
            line-height: 1.6;
          }

          @media print {
            body {
              background: #ffffff;
            }

            .report {
              width: 100%;
            }

            .property-card {
              page-break-inside: avoid;
            }
          }

          @media (max-width: 760px) {
            .hero,
            .content,
            .footer {
              padding-left: 24px;
              padding-right: 24px;
            }

            .hero h1 {
              font-size: 38px;
            }

            .metrics-grid,
            .score-grid,
            .insight-grid {
              grid-template-columns: 1fr 1fr;
            }

            .property-heading {
              display: block;
            }

            .recommendation {
              display: inline-block;
              margin-top: 14px;
            }
          }
        </style>
      </head>

      <body>
        <article class="report">
          <header class="hero">
            <p class="eyebrow">
              Nestrova AI · Investment Comparison Memo
            </p>

            <h1>
              ${escapeHtml(firstProperty.address)}
              versus
              ${escapeHtml(secondProperty.address)}
            </h1>

            <p class="hero-copy">
              A side-by-side AI assessment of valuation,
              rental performance, risk, negotiation leverage,
              market outlook, cash flow, and return potential.
            </p>

            <div class="winner-box">
              <span>Recommended Property</span>

              <h2>${escapeHtml(winner.address)}</h2>

              <p>
                Selected with
                ${escapeHtml(result.winner.confidence)}%
                comparison confidence.
              </p>
            </div>
          </header>

          <main class="content">
            <section class="section">
              <p class="section-label">
                Executive summary
              </p>

              <h2>AI comparison verdict</h2>

              <p class="executive-summary">
                ${escapeHtml(result.executiveSummary)}
              </p>

              <ul class="reasons">
                ${buildList(
                  result.winner.reasons,
                  "The winner achieved the strongest weighted comparison score.",
                )}
              </ul>
            </section>

            <section class="section">
              <p class="section-label">
                Side-by-side overview
              </p>

              <h2>Core comparison metrics</h2>

              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>${escapeHtml(firstProperty.address)}</th>
                    <th>${escapeHtml(secondProperty.address)}</th>
                  </tr>
                </thead>

                <tbody>
                  ${buildMetricRow(
                    "Listing price",
                    formatCurrency(firstProperty.price),
                    formatCurrency(secondProperty.price),
                  )}

                  ${buildMetricRow(
                    "AI fair value",
                    formatCurrency(firstProperty.fairValue),
                    formatCurrency(secondProperty.fairValue),
                  )}

                  ${buildMetricRow(
                    "Estimated monthly rent",
                    formatCurrency(firstProperty.estimatedRent),
                    formatCurrency(secondProperty.estimatedRent),
                  )}

                  ${buildMetricRow(
                    "AI score",
                    `${firstProperty.brainScore}/100`,
                    `${secondProperty.brainScore}/100`,
                  )}

                  ${buildMetricRow(
                    "Risk score",
                    `${firstProperty.riskScore}/100`,
                    `${secondProperty.riskScore}/100`,
                  )}

                  ${buildMetricRow(
                    "ROI score",
                    `${firstProperty.roiScore}/100`,
                    `${secondProperty.roiScore}/100`,
                  )}

                  ${buildMetricRow(
                    "Recommendation",
                    firstProperty.recommendation,
                    secondProperty.recommendation,
                  )}
                </tbody>
              </table>
            </section>

            <section class="section">
              <p class="section-label">
                Property ranking
              </p>

              <h2>Detailed investment review</h2>

              <div style="margin-top: 24px;">
                ${rankingHtml}
              </div>
            </section>
          </main>

          <footer class="footer">
            <strong>Generated by Nestrova AI</strong><br />
            Created ${escapeHtml(generatedDate)}.<br />
            This report is an AI-assisted investment analysis
            and is not financial, legal, appraisal, lending,
            or real-estate brokerage advice. Verify all property
            details with licensed professionals.
          </footer>
        </article>
      </body>
    </html>
  `;
}

function isValidCompareResult(
  value: unknown,
): value is CompareResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const result = value as Partial<CompareResult>;

  return (
    Array.isArray(result.properties) &&
    result.properties.length === 2 &&
    Array.isArray(result.ranking) &&
    Boolean(result.winner?.property) &&
    typeof result.executiveSummary === "string"
  );
}

export async function POST(request: Request) {
  try {
    const { user, isPro } =
      await getCurrentUserProfile();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Please sign in to generate a comparison memo.",
        },
        { status: 401 },
      );
    }

    if (!isPro) {
      return NextResponse.json(
        {
          error:
            "Comparison memos are available to Pro members.",
        },
        { status: 403 },
      );
    }

    const body = (await request.json().catch(
      () => null,
    )) as {
      result?: unknown;
    } | null;

    if (!isValidCompareResult(body?.result)) {
      return NextResponse.json(
        {
          error:
            "A valid two-property comparison is required.",
        },
        { status: 400 },
      );
    }

    const result = body.result;
    const reportHtml = buildComparisonHtml(result);

    const propertyAddress = result.properties
      .map((property) => property.address)
      .join(" vs ");

    const supabase =
      createSupabaseAdminClient();

    const { data: report, error } =
      await supabase
        .from("ai_reports")
        .insert({
          user_id: user.id,
          property_address: propertyAddress,
          investor_type: "comparison",
          is_full_report: true,
          report_html: reportHtml,
          created_at: new Date().toISOString(),
        })
        .select("id")
        .single();

    if (error) {
      console.error(
        "Could not save comparison report:",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Could not save the comparison memo.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      report_id: report.id,
    });
  } catch (error) {
    console.error(
      "Comparison report route error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unexpected comparison report server error.",
      },
      { status: 500 },
    );
  }
}