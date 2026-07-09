"use client";

export default function Section({
  eyebrow,
  title,
  description,
  action,
  children,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={["grid gap-6", className].join(" ")}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">{eyebrow}</p>}
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-neutral-950">{title}</h2>
          {description && <p className="mt-2 max-w-3xl text-neutral-600">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

