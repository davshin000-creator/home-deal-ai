"use client";

import NestrovaCard from "@/components/ui/NestrovaCard";
import NestrovaMetric from "@/components/ui/NestrovaMetric";
import { sampleWorkspace } from "../../lib/os/sampleWorkspaceData";

function money(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

export default function WorkspaceMain() {
  const property = sampleWorkspace.property;

  return (
    <div className="grid gap-6">
      <NestrovaCard eyebrow="Executive Brief" title="Should you buy?">
        <div className="grid gap-4 md:grid-cols-3">
          <NestrovaMetric label="Decision" value={property.recommendation} sub="AI recommended" />
          <NestrovaMetric label="Score" value={`${property.dealScore}/100`} sub="Excellent opportunity" />
          <NestrovaMetric label="Confidence" value={`${property.confidence}%`} sub="High confidence" />
        </div>
        <p className="mt-5 text-neutral-600">
          This property appears priced below our estimated fair value with enough room for
          a disciplined offer strategy. Confirm inspection, financing, taxes, and local comps
          before taking action.
        </p>
      </NestrovaCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <NestrovaCard eyebrow="Forecast" title="Investment forecast">
          <div className="grid gap-4 sm:grid-cols-2">
            <NestrovaMetric label="Fair Value" value={money(property.fairValue)} />
            <NestrovaMetric label="Appreciation" value={`${property.appreciation}%`} />
          </div>
        </NestrovaCard>

        <NestrovaCard eyebrow="Offer" title="Offer strategy">
          <div className="grid gap-4 sm:grid-cols-2">
            <NestrovaMetric label="Suggested Offer" value={money(property.suggestedOffer)} />
            <NestrovaMetric label="Leverage" value="Strong" />
          </div>
        </NestrovaCard>
      </div>
    </div>
  );
}
