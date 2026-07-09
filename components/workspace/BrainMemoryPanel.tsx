"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card } from "@/components/ui";
import {
  BrainMemoryItem,
  clearBrainMemory,
  readBrainMemory,
  saveBrainMemory,
} from "@/lib/brain/memoryStore";

export default function BrainMemoryPanel({
  current,
}: {
  current?: {
    address: string;
    action: "BUY" | "NEGOTIATE" | "WAIT" | "SKIP";
    brainScore: number;
    confidence: number;
    headline: string;
    executiveSummary: string;
  } | null;
}) {
  const [items, setItems] = useState<BrainMemoryItem[]>([]);

  function refresh() {
    setItems(readBrainMemory());
  }

  function saveCurrent() {
    if (!current) return;
    saveBrainMemory({
      address: current.address,
      action: current.action,
      brainScore: current.brainScore,
      confidence: current.confidence,
      headline: current.headline,
      summary: current.executiveSummary,
    });
    refresh();
  }

  function clearAll() {
    clearBrainMemory();
    refresh();
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <Card className="p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Badge variant="pro">Brain Memory</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-neutral-950">
            Recent Brain decisions
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
            Nestrova remembers recent decisions in this browser so you can compare how the Brain judged properties over time.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={saveCurrent} disabled={!current}>
            Save Current
          </Button>
          <Button variant="ghost" onClick={clearAll}>
            Clear
          </Button>
        </div>
      </div>

      <div className="mt-7 grid gap-3">
        {items.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-black/15 bg-neutral-50 p-6 text-sm text-neutral-600">
            No saved Brain decisions yet.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-[24px] border border-black/10 bg-neutral-50 p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-950">{item.address}</p>
                  <p className="mt-1 text-sm text-neutral-600">{item.headline}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={item.action === "BUY" ? "buy" : item.action === "SKIP" ? "pass" : item.action === "WAIT" ? "hold" : "pro"}>
                    {item.action}
                  </Badge>
                  <Badge variant="default">{item.brainScore}</Badge>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-neutral-600">{item.summary}</p>
              <p className="mt-3 text-xs text-neutral-400">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

