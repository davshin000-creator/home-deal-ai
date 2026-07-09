"use client";

export type ToastVariant = "success" | "error" | "info" | "warning";

const icons: Record<ToastVariant, string> = {
  success: "OK",
  error: "!",
  info: "i",
  warning: "!",
};

export default function Toast({
  show,
  title,
  description,
  message,
  variant = "info",
  onClose,
}: {
  show?: boolean;
  title?: string;
  description?: string;
  message?: string;
  variant?: ToastVariant;
  onClose?: () => void;
}) {
  if (show === false) return null;

  const displayTitle = title || message || "";

  if (!displayTitle && !description) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border border-white/10 bg-[#111] p-4 text-white shadow-2xl">
      <div className="flex items-start gap-3">
        <span className="font-bold">{icons[variant]}</span>

        <div className="flex-1">
          {displayTitle && (
            <p className="font-semibold">{displayTitle}</p>
          )}

          {description && (
            <p className="mt-1 text-sm text-white/60">
              {description}
            </p>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-sm text-white/40 hover:text-white"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}