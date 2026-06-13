"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
];

export function SecretTerminal() {
  const t = useTranslations("terminal");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (KONAMI[index] === e.key) {
        const next = index + 1;
        if (next === KONAMI.length) {
          setOpen(true);
          setHistory([t("welcome")]);
          setIndex(0);
        } else {
          setIndex(next);
        }
      } else {
        setIndex(0);
      }
    },
    [index, t],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output: string;

    switch (trimmed) {
      case "help":
        output = t("help");
        break;
      case "resume":
        output = t("resume");
        break;
      case "projects":
        output = t("projects");
        break;
      case "contact":
        output = t("contact");
        break;
      case "clear":
        setHistory([]);
        return;
      case "exit":
        setOpen(false);
        setHistory([]);
        return;
      default:
        output = t("unknown");
    }

    setHistory((h) => [...h, `> ${cmd}`, output]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 font-mono text-sm">
        <div className="mb-3 flex items-center justify-between text-[var(--text-muted)]">
          <span>~/secret-terminal</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="hover:text-[var(--text-primary)]"
          >
            ✕
          </button>
        </div>
        <div className="mb-3 max-h-48 space-y-1 overflow-y-auto text-[var(--text-muted)]">
          {history.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input) {
              runCommand(input);
              setInput("");
            }
          }}
          className="flex gap-2"
        >
          <span className="text-[var(--accent-primary)]">$</span>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-[var(--text-primary)] outline-none"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}
