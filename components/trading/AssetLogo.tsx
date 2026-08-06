type AssetLogoProps = {
  symbol?: string | null;
  assetType?: string | null;
  size?: "sm" | "md" | "lg";
};

const symbolStyles: Record<string, string> = {
  BTC: "border-orange-300/25 bg-orange-300/10 text-orange-200",
  ETH: "border-violet-300/25 bg-violet-300/10 text-violet-200",
  SOL: "border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-200",
  XRP: "border-slate-300/20 bg-slate-300/10 text-slate-100",
  DOGE: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  NVDA: "border-lime-300/25 bg-lime-300/10 text-lime-200",
  AAPL: "border-slate-200/20 bg-slate-200/10 text-slate-100",
  MSFT: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
  GOOGL: "border-blue-300/25 bg-blue-300/10 text-blue-200",
  AMZN: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  JPM: "border-blue-300/25 bg-blue-300/10 text-blue-200",
  XOM: "border-red-300/25 bg-red-300/10 text-red-200",
};

const sizeClasses = {
  sm: "h-9 w-9 rounded-[12px] text-[10px]",
  md: "h-12 w-12 rounded-[16px] text-xs",
  lg: "h-16 w-16 rounded-[20px] text-sm",
};

export default function AssetLogo({
  symbol,
  assetType,
  size = "md",
}: AssetLogoProps) {
  const normalized = String(symbol ?? "")
    .trim()
    .toUpperCase();

  const initials =
    normalized.length <= 4
      ? normalized
      : normalized.slice(0, 3);

  const fallbackClasses =
    String(assetType ?? "").toLowerCase() === "crypto"
      ? "border-violet-300/20 bg-violet-300/10 text-violet-200"
      : "border-cyan-300/20 bg-cyan-300/10 text-cyan-200";

  return (
    <span
      aria-label={`${normalized || "Asset"} logo`}
      className={`flex shrink-0 items-center justify-center border font-black tracking-[-0.04em] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${
        sizeClasses[size]
      } ${symbolStyles[normalized] ?? fallbackClasses}`}
    >
      {initials || "AI"}
    </span>
  );
}
