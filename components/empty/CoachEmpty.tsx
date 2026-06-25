"use client";
import EmptyLayout from "./EmptyLayout";
export default function CoachEmpty() {
  return (
    <EmptyLayout
      icon="🤖"
      title="Meet Your AI Investment Coach"
      description="Tell Nestrova your budget, goal, risk level, and target markets. The coach will build a practical investment strategy."
      primaryLabel="Start AI Coach"
      primaryHref="/coach"
      secondaryLabel="View Portfolio"
      secondaryHref="/portfolio"
      aiTipBody="Your coach becomes more useful after you save properties because it can connect your goals to your actual portfolio."
    />
  );
}
