"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslations } from "next-intl";

const SecretTerminalContext = createContext<{ openTerminal: () => void } | null>(
  null,
);

export function useSecretTerminal() {
  const ctx = useContext(SecretTerminalContext);
  if (!ctx) {
    throw new Error("useSecretTerminal must be used within SecretTerminalProvider");
  }
  return ctx;
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

export function SecretTerminalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("terminal");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const openTerminal = useCallback(() => {
    setOpen(true);
    setHistory([t("welcome")]);
    setInput("");
  }, [t]);

  const closeTerminal = useCallback(() => {
    setOpen(false);
    setHistory([]);
    setInput("");
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        if (isTypingTarget(e.target) && !open) return;
        e.preventDefault();
        if (open) closeTerminal();
        else openTerminal();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, openTerminal, closeTerminal]);

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
        closeTerminal();
        return;
      default:
        output = t("unknown");
    }

    setHistory((h) => [...h, `> ${cmd}`, output]);
  };

  return (
    <SecretTerminalContext.Provider value={{ openTerminal }}>
      {children}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 font-mono text-sm">
            <div className="mb-3 flex items-center justify-between text-[var(--text-muted)]">
              <span>~/terminal</span>
              <button
                type="button"
                onClick={closeTerminal}
                className="hover:text-[var(--text-primary)]"
                aria-label={t("close")}
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
      )}
    </SecretTerminalContext.Provider>
  );
}
