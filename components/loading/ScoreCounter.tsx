"use client";

export default function ScoreCounter({
  value,
  score,
  label = "Score",
}: {
  value?: number;
  score?: number;
  label?: string;
}) {
  const displayValue = score ?? value ?? 0;

  return (
    <span>
      {displayValue}
    </span>
  );
}