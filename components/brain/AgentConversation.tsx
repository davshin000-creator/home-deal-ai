"use client";

import { Card, Badge } from "@/components/ui";

const conversations = [
  {
    agent: "Valuation Agent",
    message: "Fair value appears above asking price. Margin of safety is positive.",
    tone: "complete",
  },
  {
    agent: "Risk Agent",
    message: "No critical risk detected. Inspection and HOA still need verification.",
    tone: "running",
  },
  {
    agent: "Rental Agent",
    message: "Rental yield is acceptable for this price range and market profile.",
    tone: "complete",
  },
  {
    agent: "Offer Agent",
    message: "Balanced offer is the best first move. Aggressive offer may reduce acceptance probability.",
    tone: "thinking",
  },
  {
    agent: "Executive Brain",
    message: "Recommendation: NEGOTIATE. Confidence remains high, but price discipline matters.",
    tone: "executive",
  },
];

function dotClass(tone: string) {
  if (tone === "complete") return "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]";
  if (tone === "running") return "bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.9)]";
  if (tone === "executive") return "bg-white shadow-[0_0_22px_rgba(255,255,255,0.9)]";
  return "bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.9)]";
}

export default function AgentConversation() {
  return (
    <Card variant="premium" className="relative overflow-hidden p-8">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative">
        <Badge variant="pro">Agent Conversation</Badge>

        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
          Brain-to-brain reasoning
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/50">
          Nestrova agents exchange conclusions before the Executive Brain forms the final decision.
        </p>

        <div className="mt-8 grid gap-4">
          {conversations.map((item, index) => (
            <div
              key={item.agent}
              className="relative rounded-[28px] border border-white/10 bg-white/[0.055] p-5"
            >
              <div className="flex items-start gap-4">
                <div className="grid justify-items-center">
                  <span className={`mt-1 h-3 w-3 rounded-full ${dotClass(item.tone)}`} />
                  {index < conversations.length - 1 && (
                    <span className="mt-3 h-12 w-px bg-white/10" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">{item.agent}</p>
                  <p className="mt-2 text-sm leading-6 text-white/58">{item.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
