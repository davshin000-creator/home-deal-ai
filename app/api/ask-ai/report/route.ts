import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function money(value: number) {
  return `$${Math.round(Number(value || 0)).toLocaleString()}`;
}

function safeNumber(value: unknown, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function grade(score: number) {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  return "C";
}

function buildReportHtml({
  property,
  aiText,
  investorType,
  isPro,
}: {
  property: any;
  aiText: string;
  investorType: string;
  isPro: boolean;
}) {
  const score = safeNumber(property.deal_score);
  const reportGrade = grade(score);
  const fairValue = safeNumber(property.fair_value);
  const listingPrice = safeNumber(property.listing_price);
  const discount = fairValue
    ? (((fairValue - listingPrice) / fairValue) * 100).toFixed(1)
    : "0.0";

  const annualAppreciation = safeNumber(property.expected_appreciation) / 100;
  const forecastRows = [0, 1, 3, 5].map((year) => ({
    year,
    value: Math.round(fairValue * Math.pow(1 + annualAppreciation, year)),
  }));

  const maxForecast = Math.max(...forecastRows.map((item) => item.value), 1);

  const locked = !isPro
    ? `<div class="locked">
        <h2>Upgrade to Pro to unlock the full AI report</h2>
        <p>This preview includes the executive summary and key metrics. Pro includes negotiation strategy, risk analysis, exit strategy, and the full downloadable report.</p>
      </div>`
    : "";

  const proOnlySections = isPro
    ? `
      <section class="page">
        <h2>AI Negotiation Strategy</h2>
        <div class="ai-text">${aiText}</div>
      </section>

      <section class="page">
        <h2>Risk Analysis</h2>
        <ul>
          <li>Verify taxes, insurance, HOA fees, and special assessments.</li>
          <li>Compare actual rent comps before relying on projected rent.</li>
          <li>Inspect property condition and repair requirements.</li>
          <li>Review local vacancy, rent control, and ownership rules.</li>
        </ul>
      </section>

      <section class="page">
        <h2>Exit Strategy</h2>
        <p>Suggested hold period: <strong>5 years</strong></p>
        <p>Projected 5-year value: <strong>${money(forecastRows[3].value)}</strong></p>
        <p>Best suited for: <strong>${investorType}</strong></p>
      </section>

      <section class="page">
        <h2>Final AI Recommendation</h2>
        <div class="final-grade">${reportGrade}</div>
        <p>This report is informational only and is not financial, legal, tax, or investment advice.</p>
      </section>
    `
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <title>Nestrova AI Investment Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #111827;
      margin: 0;
      background: #f9fafb;
    }
    .page {
      width: 900px;
      min-height: 1080px;
      margin: 24px auto;
      padding: 52px;
      background: white;
      box-sizing: border-box;
      border: 1px solid #e5e7eb;
    }
    .cover {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .brand {
      font-size: 34px;
      font-weight: 900;
      letter-spacing: 0.04em;
    }
    .muted {
      color: #6b7280;
    }
    h1 {
      font-size: 58px;
      line-height: 1.03;
      margin: 50px 0 20px;
    }
    h2 {
      font-size: 32px;
      margin: 0 0 20px;
    }
    .grade {
      font-size: 92px;
      font-weight: 900;
      margin: 10px 0;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
      margin-top: 24px;
    }
    .card {
      border: 1px solid #e5e7eb;
      border-radius: 18px;
      padding: 20px;
      background: #fff;
    }
    .label {
      color: #6b7280;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .value {
      margin-top: 8px;
      font-size: 30px;
      font-weight: 900;
    }
    .bar-wrap {
      margin-top: 18px;
    }
    .bar-row {
      margin-bottom: 18px;
    }
    .bar {
      height: 18px;
      background: #e5e7eb;
      border-radius: 999px;
      overflow: hidden;
      margin-top: 8px;
    }
    .bar-fill {
      height: 18px;
      background: #111827;
      border-radius: 999px;
    }
    .ai-text {
      white-space: pre-wrap;
      line-height: 1.7;
      font-size: 16px;
      background: #f9fafb;
      border-radius: 18px;
      padding: 22px;
    }
    .locked {
      width: 900px;
      margin: 24px auto;
      padding: 32px 52px;
      box-sizing: border-box;
      background: #111827;
      color: white;
      border-radius: 24px;
    }
    .final-grade {
      font-size: 110px;
      font-weight: 900;
    }
    @media print {
      body { background: white; }
      .page {
        margin: 0;
        width: auto;
        min-height: 100vh;
        border: none;
        page-break-after: always;
      }
      .locked {
        page-break-after: always;
      }
    }
  </style>
</head>
<body>
  <section class="page cover">
    <div>
      <div class="brand">NESTROVA</div>
      <p class="muted">AI Real Estate Intelligence</p>

      <h1>AI Investment Report</h1>
      <p class="muted">${property.address}</p>

      <div class="grade">${reportGrade}</div>
      <p><strong>Investment Score:</strong> ${score}/100</p>
      <p><strong>Investor Type:</strong> ${investorType}</p>
    </div>

    <p class="muted">Generated by Nestrova AI · ${new Date().toLocaleDateString()}</p>
  </section>

  <section class="page">
    <h2>Executive Summary</h2>
    <div class="grid">
      <div class="card">
        <div class="label">Listing Price</div>
        <div class="value">${money(listingPrice)}</div>
      </div>
      <div class="card">
        <div class="label">AI Fair Value</div>
        <div class="value">${money(fairValue)}</div>
      </div>
      <div class="card">
        <div class="label">Discount to Value</div>
        <div class="value">${discount}%</div>
      </div>
      <div class="card">
        <div class="label">Status</div>
        <div class="value">${property.status || "Analyzed"}</div>
      </div>
    </div>
    <p style="margin-top:30px; line-height:1.7;">${property.summary || "Nestrova analyzed this property using valuation, rent, cash-flow, and market factors."}</p>
  </section>

  <section class="page">
    <h2>Rental and Cash Flow Analysis</h2>
    <div class="grid">
      <div class="card">
        <div class="label">Estimated Monthly Rent</div>
        <div class="value">${money(safeNumber(property.estimated_monthly_rent))}</div>
      </div>
      <div class="card">
        <div class="label">Monthly Cash Flow</div>
        <div class="value">${money(safeNumber(property.estimated_monthly_cash_flow))}</div>
      </div>
      <div class="card">
        <div class="label">Gross Rent Yield</div>
        <div class="value">${safeNumber(property.gross_rent_yield).toFixed(2)}%</div>
      </div>
      <div class="card">
        <div class="label">Confidence</div>
        <div class="value">${safeNumber(property.confidence_score, 50)}%</div>
      </div>
    </div>
  </section>

  <section class="page">
    <h2>Price Forecast Timeline</h2>
    <p class="muted">Simple projection based on current fair value and expected appreciation.</p>
    <div class="bar-wrap">
      ${forecastRows
        .map(
          (item) => `
          <div class="bar-row">
            <strong>${item.year === 0 ? "Today" : `${item.year} Year${item.year > 1 ? "s" : ""}`}</strong>
            <span style="float:right;">${money(item.value)}</span>
            <div class="bar">
              <div class="bar-fill" style="width:${Math.max(
                8,
                (item.value / maxForecast) * 100
              )}%"></div>
            </div>
          </div>
        `
        )
        .join("")}
    </div>
  </section>

  ${locked}
  ${proOnlySections}

</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY environment variable." },
        { status: 500 }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Missing Supabase service environment variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const property = body.property;
    const userId = String(body.user_id || "");
    const investorType = String(body.investor_type || "Beginner");
    const isPro = Boolean(body.is_pro);

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id." }, { status: 400 });
    }

    if (!property?.address) {
      return NextResponse.json(
        { error: "Property analysis result is required." },
        { status: 400 }
      );
    }

    const propertyContext = {
      address: property.address,
      listing_price: safeNumber(property.listing_price),
      fair_value: safeNumber(property.fair_value),
      estimated_monthly_rent: safeNumber(property.estimated_monthly_rent),
      gross_rent_yield: safeNumber(property.gross_rent_yield),
      deal_score: safeNumber(property.deal_score),
      status: property.status,
      estimated_monthly_cash_flow: safeNumber(property.estimated_monthly_cash_flow),
      expected_appreciation: safeNumber(property.expected_appreciation),
      confidence_score: safeNumber(property.confidence_score, 50),
      summary: property.summary,
      investor_type: investorType,
      is_pro: isPro,
    };

    let aiText = "Preview mode. Upgrade to Pro to unlock the full negotiation, risk, and exit strategy sections.";

    if (isPro) {
      const openAiResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            temperature: 0.35,
            messages: [
              {
                role: "system",
                content:
                  "You are Nestrova AI, a real estate investment report analyst. Create concise professional investment report sections. Do not provide legal, tax, lending, or personalized financial advice.",
              },
              {
                role: "user",
                content: `Create a professional AI report section for this property. Include negotiation strategy, risk analysis, exit strategy, and final recommendation. Property data: ${JSON.stringify(propertyContext, null, 2)}`,
              },
            ],
          }),
        }
      );

      if (openAiResponse.ok) {
        const data = await openAiResponse.json();
        aiText =
          data.choices?.[0]?.message?.content ||
          "Could not generate AI report text.";
      }
    }

    const reportHtml = buildReportHtml({
      property,
      aiText,
      investorType,
      isPro,
    });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: report, error } = await supabase
      .from("ai_reports")
      .insert({
        user_id: userId,
        property_address: property.address,
        investor_type: investorType,
        is_full_report: isPro,
        report_html: reportHtml,
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Could not save report." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      report_id: report.id,
      report_html: reportHtml,
      is_full_report: isPro,
    });
  } catch (error) {
    console.error("report route error:", error);

    return NextResponse.json(
      { error: "Unexpected report server error." },
      { status: 500 }
    );
  }
}
