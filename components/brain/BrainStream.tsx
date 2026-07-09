"use client";

import { Badge, Card } from "@/components/ui";
import { useBrainStream } from "@/hooks/useBrainStream";

function statusStyle(status: "complete" | "active" | "queued") {
  if (status === "complete") return "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]";
  if (status === "active") return "bg-white shadow-[0_0_24px_rgba(255,255,255,0.95)] animate-pulse";
  return "bg-white/20";
}

export default function BrainStream() {
  const { events, activeEvent } = useBrainStream();

  return (
    <Card variant="premium" className="relative overflow-hidden p-6 md:p-8">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Badge variant="pro">Live Brain Stream</Badge>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
            Real-time reasoning feed
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
            Nestrova shows the investment logic as it moves through intake, valuation,
            risk, offer, and final action.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
            Active Engine
          </p>
          <p className="mt-1 text-sm font-semibold text-white">{activeEvent.engine}</p>
        </div>
      </div>

      <div className="relative mt-8 grid gap-4">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="grid gap-4 rounded-[28px] border border-white/10 bg-white/[0.055] p-5 transition hover:bg-white/[0.075] md:grid-cols-[70px_1fr_190px]"
          >
            <div className="flex items-start gap-3">
              <div className={`mt-1 h-3 w-3 rounded-full ${statusStyle(event.status)}`} />
              <p className="text-sm font-semibold text-white/35">{event.time}</p>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-white">{event.title}</p>
                {event.status === "active" && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-black">
                    Thinking
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-6 text-white/45">{event.detail}</p>
            </div>

            <div className="md:text-right">
              <p className="text-sm font-semibold text-white/55">{event.engine}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/25">
                Step {index + 1}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

