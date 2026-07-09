"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { useCommandPalette } from "@/hooks/useCommandPalette";

type CommandItem = {
  id: string;
  title: string;
  description: string;
  shortcut?: string;
  group: string;
  action?: () => void;
};

export default function ExecutiveCommandCenter({
  onRefresh,
  onSave,
}: {
  onRefresh?: () => void;
  onSave?: () => void;
}) {
  const { open, setOpen } = useCommandPalette();
  const [query, setQuery] = useState("");

  const commands: CommandItem[] = [
    {
      id: "new-analysis",
      title: "Run new AI analysis",
      description: "Analyze a new property with Nestrova Brain.",
      shortcut: "Ctrl K",
      group: "Brain",
      action: onRefresh,
    },
    {
      id: "save-decision",
      title: "Save current decision",
      description: "Add the current Brain result to memory.",
      shortcut: "S",
      group: "Memory",
      action: onSave,
    },
    {
      id: "compare",
      title: "Compare alternatives",
      description: "Prepare side-by-side property comparison.",
      group: "Portfolio",
    },
    {
      id: "generate-report",
      title: "Generate executive report",
      description: "Create a shareable investment memo.",
      group: "Report",
    },
    {
      id: "offer",
      title: "Open offer studio",
      description: "Review aggressive, balanced, and safe offer ranges.",
      group: "Negotiation",
    },
    {
      id: "risk",
      title: "Review risk guardrails",
      description: "Inspect rental, HOA, carrying cost, and inspection risks.",
      group: "Risk",
    },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((item) =>
      [item.title, item.description, item.group].join(" ").toLowerCase().includes(q)
    );
  }, [query]);

  function runCommand(command: CommandItem) {
    command.action?.();
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      <Button
        variant="ghost"
        className="border border-white/10 bg-white/[0.06] text-white hover:bg-white/10 hover:text-white"
        onClick={() => setOpen(true)}
      >
        Ctrl K Command
      </Button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-24 backdrop-blur-xl">
          <div className="w-full max-w-3xl overflow-hidden rounded-[34px] border border-white/10 bg-[#080808] shadow-[0_40px_140px_rgba(0,0,0,0.65)]">
            <div className="border-b border-white/10 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
                Executive Command Center
              </p>
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Brain, reports, offers, memory..."
                className="mt-4 h-14 w-full bg-transparent text-2xl font-semibold tracking-[-0.03em] text-white outline-none placeholder:text-white/20"
              />
            </div>

            <div className="max-h-[520px] overflow-y-auto p-3">
              {filtered.map((command) => (
                <button
                  key={command.id}
                  onClick={() => runCommand(command)}
                  className="group grid w-full gap-1 rounded-[24px] p-4 text-left transition hover:bg-white/[0.07]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{command.title}</p>
                      <p className="mt-1 text-sm text-white/45">{command.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                        {command.group}
                      </span>
                      {command.shortcut && (
                        <span className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-white/40">
                          {command.shortcut}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {filtered.length === 0 && (
                <div className="rounded-[24px] border border-dashed border-white/10 p-8 text-center text-sm text-white/40">
                  No commands found.
                </div>
              )}
            </div>

            <div className="border-t border-white/10 px-5 py-4 text-xs text-white/30">
              Press Esc to close. Press Ctrl+K or Cmd+K to open anytime.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

