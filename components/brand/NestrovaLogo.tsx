import NestrovaMark from "./NestrovaMark";

type NestrovaLogoProps = {
  markClassName?: string;
  subtitle?: string;
  compact?: boolean;
};

export default function NestrovaLogo({
  markClassName = "h-10 w-10 rounded-[12px] text-[14px]",
  subtitle = "Intelligence Platform",
  compact = false,
}: NestrovaLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <NestrovaMark className={markClassName} />

      {!compact ? (
        <div className="min-w-0">
          <p className="truncate text-lg font-black tracking-[-0.045em] text-white">
            Nestrova
          </p>

          <p className="truncate text-[9px] font-semibold uppercase tracking-[0.19em] text-white/30">
            {subtitle}
          </p>
        </div>
      ) : null}
    </div>
  );
}
