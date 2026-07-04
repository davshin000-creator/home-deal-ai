"use client";

import { Badge, Card } from "@/components/ui";
import type { CompareResult } from "@/types/comparison";

export default function ExecutiveComparisonSummary({ result }: { result: CompareResult }) {
  return (
    <Card className="p-8">
      <Badge variant="pro">Executive Summary</Badge>
      <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-neutral-950">AI comparison verdict</h2>
      <p className="mt-4 max-w-4xl text-lg leading-8 text-neutral-600">{result.executiveSummary}</p>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {result.ranking.map((property,index)=>(
          <div key={property.id} className="rounded-[28px] border border-black/10 bg-neutral-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Rank #{index+1}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-neutral-950">{property.address}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{property.summary}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
