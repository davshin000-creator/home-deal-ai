"use client";

import { Card, Section } from "@/components/ui";
import { workspaceActivity } from "@/lib/workspace/workspaceData";

export default function ActivityFeed() {
  return (
    <Section eyebrow="Activity" title="Recent workspace activity">
      <Card>
        <div className="grid gap-3">
          {workspaceActivity.map((item, index) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">{index + 1}</div>
              <p className="text-sm font-semibold text-neutral-700">{item}</p>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
}
