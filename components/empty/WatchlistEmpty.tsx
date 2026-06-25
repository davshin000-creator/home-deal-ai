"use client";
import EmptyLayout from "./EmptyLayout";
export default function WatchlistEmpty() {
  return (
    <EmptyLayout
      icon="🔔"
      title="No Watchlist Items Yet"
      description="Track properties before you buy. Nestrova can later alert you when prices drop, scores improve, or market conditions change."
      primaryLabel="Explore Deals"
      primaryHref="/deals"
      secondaryLabel="Browse Markets"
      secondaryHref="/markets"
      aiTipBody="A strong watchlist usually includes 5 to 10 properties across 2 to 3 markets."
    />
  );
}
