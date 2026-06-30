"use client";

export default function Drawer({
  open,
  title,
  description,
  children,
  onClose,
  side = "right",
}: {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
  side?: "left" | "right";
}) {
  if (!open) return null;

  const position = side === "right" ? "right-0 border-l" : "left-0 border-r";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      <div className={`fixed top-0 h-full w-full max-w-md overflow-y-auto border-black/10 bg-white p-6 shadow-2xl ${position}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-neutral-950">{title}</h2>
            {description && <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-lg font-semibold text-neutral-600 transition hover:bg-neutral-200"
            aria-label="Close drawer"
          >
            ×
          </button>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
