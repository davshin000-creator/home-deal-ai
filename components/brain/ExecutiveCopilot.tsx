"use client";

import { useState } from "react";
import { Badge, Button, Card } from "@/components/ui";

const suggestedQuestions = [
  "Should I buy this property?",
  "What is the biggest risk?",
  "What offer should I make?",
  "Should I wait or negotiate?",
];

type Message = {
  role: "user" | "assistant";
  content: string;
};

function generateReply(question: string) {
  const q = question.toLowerCase();

  if (q.includes("risk")) {
    return "The biggest current risks are inspection uncertainty, carrying cost assumptions, and whether the rent estimate is realistic. Nestrova recommends verifying HOA, insurance, property condition, and local rent comps before moving forward.";
  }

  if (q.includes("offer")) {
    return "A balanced offer is the best starting point. Use the calculated balanced offer as your anchor, keep inspection and financing protections, and ask for seller credits if the seller resists a price reduction.";
  }

  if (q.includes("wait")) {
    return "Waiting makes sense if the seller has limited motivation or if comparable homes are improving. If days on market increase or the price drops, the Brain score may improve.";
  }

  return "Nestrova currently leans toward negotiation before commitment. The property may have upside, but the safest move is to protect price discipline, validate risks, and avoid overpaying above the calculated offer range.";
}

export default function ExecutiveCopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Ask Nestrova about the deal, risk, offer strategy, timing, or next action.",
    },
  ]);
  const [input, setInput] = useState("");

  function submit(question?: string) {
    const value = (question || input).trim();
    if (!value) return;

    const reply = generateReply(value);

    setMessages((current) => [
      ...current,
      { role: "user", content: value },
      { role: "assistant", content: reply },
    ]);

    setInput("");
  }

  return (
    <Card variant="premium" className="relative overflow-hidden p-8">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative">
        <Badge variant="pro">Executive Copilot</Badge>

        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
          Ask Nestrova
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/50">
          A premium AI copilot for investment questions, negotiation strategy,
          risk review, and executive next actions.
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          {suggestedQuestions.map((question) => (
            <button
              key={question}
              onClick={() => submit(question)}
              className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              {question}
            </button>
          ))}
        </div>

        <div className="mt-8 grid max-h-[420px] gap-4 overflow-y-auto rounded-[30px] border border-white/10 bg-black/20 p-5">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={
                message.role === "assistant"
                  ? "max-w-[88%] rounded-[26px] border border-white/10 bg-white/[0.07] p-4 text-sm leading-6 text-white/65"
                  : "ml-auto max-w-[88%] rounded-[26px] bg-white p-4 text-sm leading-6 font-medium text-black"
              }
            >
              {message.content}
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit();
            }}
            placeholder="Ask about risk, offer, timing, or portfolio impact..."
            className="h-14 flex-1 rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/20"
          />

          <Button variant="premium" onClick={() => submit()}>
            Ask Brain
          </Button>
        </div>
      </div>
    </Card>
  );
}

