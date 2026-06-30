"use client";

import PropertyHero from "@/components/workspace/PropertyHero";
import ExecutiveWorkspace from "@/components/workspace/ExecutiveWorkspace";
import DecisionCenter from "@/components/workspace/DecisionCenter";
import IntelligencePanel from "@/components/workspace/IntelligencePanel";
import WorkspaceMain from "@/components/workspace/WorkspaceMain";
import ActivityFeed from "@/components/workspace/ActivityFeed";

export default function RC45Workspace() {
  return (
    <div className="grid gap-8">
      <PropertyHero />
      <ExecutiveWorkspace />
      <DecisionCenter />
      <IntelligencePanel />
      <WorkspaceMain />
      <ActivityFeed />
    </div>
  );
}
