"use client";

export default function AILoadingOverlay({
  show = false,
  title = "Nestrova is analyzing",
}: {
  show?: boolean;
  title?: string;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 p-6 backdrop-blur-xl">
      <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-2xl">
        <div className="h-4 w-4 animate-ping rounded-full bg-black" />
        <h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em]">{title}</h2>
        <p className="mt-2 text-sm text-neutral-600">Reading data, scoring risk, and preparing a recommendation.</p>
      </div>
    </div>
  );
}
