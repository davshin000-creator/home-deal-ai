"use client";

import Button from "./Button";

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  href,
  icon = "◇",
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  href?: string;
  icon?: string;
}) {
  const action =
    actionLabel && href ? (
      <a
        href={href}
        className="inline-flex h-12 items-center justify-center rounded-2xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.99]"
      >
        {actionLabel}
      </a>
    ) : actionLabel ? (
      <Button onClick={onAction}>{actionLabel}</Button>
    ) : null;

  return (
    <div className="rounded-[28px] border border-dashed border-black/15 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-neutral-100 text-3xl text-neutral-700">
        {icon}
      </div>

      <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-neutral-950">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
