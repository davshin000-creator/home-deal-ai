"use client";

type ToastVariant = "success" | "error" | "info" | "warning";

const variants: Record<ToastVariant, string> = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-black/10 bg-white text-neutral-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
};

const icons: Record<ToastVariant, string> = {
  success: "✓",
  error: "!",
  info: "i",
  warning: "!",
};

export default function Toast({
  show,
  title,
  description,
  variant = "info",
  onClose,
}: {
  show: boolean;
  title: string;
  description?: string;
  variant?: ToastVariant;
  onClose?: () => void;
}) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[calc(100%-48px)] max-w-sm">
      <div className={`rounded-[24px] border p-4 shadow-2xl ${variants[variant]}`}>
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
            {icons[variant]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{title}</p>
            {description && <p className="mt-1 text-sm opacity-80">{description}</p>}
          </div>
          {onClose && (
            <button onClick={onClose} className="text-sm font-bold opacity-60 hover:opacity-100">
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
