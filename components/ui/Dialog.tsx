"use client";

export default function Dialog({
  open,
  title,
  description,
  children,
  onClose,
  footer,
}: {
  open: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[28px] border border-black/10 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-neutral-950">{title}</h2>
            {description && <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-lg font-semibold text-neutral-600 transition hover:bg-neutral-200"
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        {children && <div className="mt-6">{children}</div>}
        {footer && <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  );
}
