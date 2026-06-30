"use client";

import { Button, Card, EmptyState, MetricCard, Section } from "@/components/ui";
import { workspaceProperty } from "@/lib/workspace/workspaceData";

export default function WorkspaceMain() {
  return (
    <Section eyebrow="Workspace" title="Property operations" description="Documents, notes, and next actions are organized around the current property.">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="text-2xl font-semibold tracking-[-0.02em]">Documents</h3>
          <p className="mt-3 text-sm leading-6 text-neutral-600">Generate an offer letter, agent email, purchase summary, or investor report.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>Generate Report</Button>
            <Button variant="secondary">Open Documents</Button>
          </div>
        </Card>
        <Card>
          <h3 className="text-2xl font-semibold tracking-[-0.02em]">Portfolio impact</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <MetricCard label="Projected Cash Flow" value={workspaceProperty.cashFlow} />
            <MetricCard label="Risk" value={workspaceProperty.risk} />
          </div>
        </Card>
      </div>
      <EmptyState title="No team notes yet" description="Add notes about inspection, financing, HOA, or negotiation details." actionLabel="Add Note" icon="✎" />
    </Section>
  );
}
