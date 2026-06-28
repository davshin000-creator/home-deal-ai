"use client";

import NestrovaCard from "@/components/ui/NestrovaCard";
import NestrovaMetric from "@/components/ui/NestrovaMetric";
import NestrovaProgress from "@/components/ui/NestrovaProgress";
import ForecastMiniChart from "@/components/charts/ForecastMiniChart";
import { sampleWorkspace } from "../../lib/os/sampleWorkspaceData";

function money(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

export default function ExecutiveWorkspace() {
  const property = sampleWorkspace.property;

  return (
    <div className="grid gap-6">
      <section className="rounded-[36px] border border-black/10 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Executive Brief
            </p>
            <h2 className="mt-3 text-5xl font-semibold tracking-[-0.04em] text-neutral-950">
              {property.recommendation}
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600">
              This property appears undervalued relative to estimated fair value.
              The projected rental yield is healthy, and current assumptions support
              a disciplined offer below asking price.
            </p>
          </div>

          <div className="grid min-w-[320px] gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-black p-6 text-white">
              <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">
                Deal Score
              </p>
              <p className="mt-2 text-5xl font-semibold">{property.dealScore}</p>
            </div>
            <div className="rounded-3xl border border-black/10 bg-neutral-50 p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                Confidence
              </p>
              <p className="mt-2 text-5xl font-semibold">{property.confidence}%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <NestrovaMetric label="Fair Value" value={money(property.fairValue)} />
        <NestrovaMetric label="Suggested Offer" value={money(property.suggestedOffer)} />
        <NestrovaMetric label="Appreciation" value={`${property.appreciation}%`} sub="5-year outlook" />
        <NestrovaMetric label="Rental Yield" value={`${property.rentalYield}%`} />
        <NestrovaMetric label="Risk" value="Moderate" sub="Verify inspection" />
        <NestrovaMetric label="Cash Flow" value="$515/mo" sub="Estimated" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <ForecastMiniChart />

        <div className="grid gap-6">
          <NestrovaCard eyebrow="Next Best Action" title="Generate Offer">
            <p className="text-neutral-600">
              The current score and valuation spread support creating an offer strategy
              before comparing nearby alternatives.
            </p>
            <a
              href="/offer"
              className="mt-5 inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
            >
              Generate Offer
            </a>
          </NestrovaCard>

          <NestrovaProgress
            label="AI Confidence"
            value={property.confidence}
            sub="Based on valuation, yield, and market assumptions"
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <NestrovaCard eyebrow="Why This Deal" title="AI reasoning">
          <ul className="grid gap-3 text-sm text-neutral-600">
            <li>✓ Estimated offer is meaningfully below fair value.</li>
            <li>✓ Rental yield remains acceptable for a growth market.</li>
            <li>✓ Negotiation spread creates room for inspection credits.</li>
            <li>✓ Best next step is to generate an offer strategy.</li>
          </ul>
        </NestrovaCard>

        <NestrovaCard eyebrow="Risk Review" title="What to verify first">
          <ul className="grid gap-3 text-sm text-neutral-600">
            <li>⚠ Confirm property tax and insurance assumptions.</li>
            <li>⚠ Review roof, HVAC, foundation, and deferred maintenance.</li>
            <li>⚠ Compare local rent comps before submitting an offer.</li>
            <li>⚠ Have offer terms reviewed by qualified professionals.</li>
          </ul>
        </NestrovaCard>
      </div>
    </div>
  );
}
