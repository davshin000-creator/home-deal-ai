"use client";

export default function UsageBadge({
  used,
  limit,
  label,
}: {
  used: number;
  limit: number;
  label: string;
}) {
  const percent = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 100;

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-gray-500">
          {used} / {limit === 9999 ? "∞" : limit}
        </p>
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-3 rounded-full bg-black"
          style={{ width: `${limit === 9999 ? 100 : percent}%` }}
        />
      </div>
    </div>
  );
}
