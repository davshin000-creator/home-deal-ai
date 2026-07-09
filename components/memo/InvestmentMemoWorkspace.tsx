"use client";

import { Card, Badge, Button } from "@/components/ui";

const sections=[
["Executive Summary","Strong valuation gap with disciplined negotiation opportunity."],
["Brain Verdict","BUY · Confidence 96%"],
["Risk Review","Verify inspection, HOA, insurance and rent assumptions."],
["Offer Strategy","Begin with the balanced offer and preserve contingencies."],
["Forecast","Positive 12-month outlook based on current assumptions."],
];

export default function InvestmentMemoWorkspace(){
  return (
    <main className="min-h-screen bg-[#050505] p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <Badge variant="pro">Investment Memo</Badge>
          <h1 className="mt-4 text-6xl font-semibold tracking-[-0.06em]">Professional Investment Report</h1>
          <p className="mt-4 max-w-3xl text-white/60">Designed for investors, lenders and partners.</p>
        </div>

        <Card variant="premium" className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/40">Property</p>
              <h2 className="text-4xl font-semibold">157 Damsel, Irvine CA</h2>
            </div>
            <Button variant="premium">Download PDF</Button>
          </div>
        </Card>

        {sections.map(([title,body])=>(
          <Card key={title} className="p-8">
            <h3 className="text-2xl font-semibold">{title}</h3>
            <p className="mt-3 text-neutral-600 leading-7">{body}</p>
          </Card>
        ))}

        <Card variant="premium" className="p-8">
          <Badge variant="buy">Executive Conclusion</Badge>
          <p className="mt-5 text-xl leading-8 text-white/70">
            Nestrova recommends proceeding with a disciplined offer while validating remaining operational risks.
          </p>
        </Card>
      </div>
    </main>
  )
}

