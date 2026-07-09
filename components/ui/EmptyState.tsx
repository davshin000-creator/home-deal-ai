export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  href,
  icon = "N",
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  href?: string;
  icon?: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center text-white">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-black text-black">
        {icon}
      </div>

      <h3 className="mt-5 text-2xl font-semibold">{title}</h3>

      {description && (
        <p className="mt-3 text-sm leading-6 text-white/50">{description}</p>
      )}

      {actionLabel && href && (
        <a
          href={href}
          className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
        >
          {actionLabel}
        </a>
      )}

      {actionLabel && onAction && !href && (
        <button
          onClick={onAction}
          className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
