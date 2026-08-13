type NestrovaMarkProps = {
  className?: string;
};

export default function NestrovaMark({
  className = "",
}: NestrovaMarkProps) {
  return (
    <div
      aria-label="Nestrova"
      className={[
        "relative flex shrink-0 items-center justify-center",
        "overflow-hidden bg-black text-white",
        "border border-white/15",
        className,
      ].join(" ")}
    >
      <span
        className="
          select-none
          font-black
          leading-none
          tracking-[-0.16em]
        "
      >
        NT
      </span>
    </div>
  );
}
