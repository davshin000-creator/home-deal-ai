export type CouncilMember = {
  name: string;
  signal: string;
};

type ExecutiveCouncilCardProps = {
  council: CouncilMember[];
};

function signalClass(signal: string) {
  const normalized = signal.toLowerCase();

  if (normalized.includes("bull")) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (normalized.includes("bear")) {
    return "bg-red-50 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
}

export default function ExecutiveCouncilCard({
  council,
}: ExecutiveCouncilCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          Executive Council
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">
          Multi-agent consensus
        </h2>
      </div>

      <div className="mt-6 space-y-3">
        {council.map((member) => (
          <div
            key={member.name}
            className="flex items-center justify-between rounded-2xl border border-slate-100 p-4"
          >
            <span className="font-semibold text-slate-800">
              {member.name}
            </span>

            <span
              className={
                "rounded-full px-3 py-1 text-sm font-semibold " +
                signalClass(member.signal)
              }
            >
              {member.signal}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}