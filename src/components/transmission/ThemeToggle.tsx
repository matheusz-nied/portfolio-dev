"use client";

import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

interface ThemeToggleProps {
  label: string;
  /** Selector of the themed shell element that carries the attribute. */
  shell?: string;
  /** Attribute on the shell that holds "light" (absent = dark). */
  attr?: string;
  storageKey?: string;
  className?: string;
}

// The theme lives on the shell element (set before paint by the layout's inline script).
export function ThemeToggle({
  label,
  shell = ".theme-tech",
  attr = "data-tl-theme",
  storageKey = "tl-theme",
  className = "tl-theme",
}: ThemeToggleProps) {
  const getShell = () => document.querySelector<HTMLElement>(shell);

  const subscribe = (onChange: () => void) => {
    const el = getShell();
    if (!el) return () => {};
    const observer = new MutationObserver(onChange);
    observer.observe(el, { attributes: true, attributeFilter: [attr] });
    return () => observer.disconnect();
  };

  const getSnapshot = (): Theme =>
    getShell()?.getAttribute(attr) === "light" ? "light" : "dark";

  const theme = useSyncExternalStore(subscribe, getSnapshot, () => "dark" as Theme);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    const el = getShell();
    if (el) {
      if (next === "light") el.setAttribute(attr, "light");
      else el.removeAttribute(attr);
    }
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // Storage can be blocked; the theme still applies for this visit.
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={toggle}
      aria-label={label}
      aria-pressed={theme === "light"}
      title={label}
    >
      <svg className="theme-icon-moon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M13.5 9.6A5.5 5.5 0 0 1 6.4 2.5a5.5 5.5 0 1 0 7.1 7.1Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
      <svg className="theme-icon-sun" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="2.8" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
