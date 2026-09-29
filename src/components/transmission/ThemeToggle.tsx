"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "tl-theme";
type Theme = "dark" | "light";

function getShell() {
  return document.querySelector<HTMLElement>(".theme-tech");
}

// The theme lives on the shell element (set before paint by the layout's inline script).
function subscribe(onChange: () => void) {
  const shell = getShell();
  if (!shell) return () => {};
  const observer = new MutationObserver(onChange);
  observer.observe(shell, { attributes: true, attributeFilter: ["data-tl-theme"] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return getShell()?.dataset.tlTheme === "light" ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

export function ThemeToggle({ label }: { label: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    const shell = getShell();
    if (shell) {
      if (next === "light") shell.dataset.tlTheme = "light";
      else delete shell.dataset.tlTheme;
    }
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be blocked; the theme still applies for this visit.
    }
  };

  return (
    <button
      type="button"
      className="tl-theme"
      onClick={toggle}
      aria-label={label}
      aria-pressed={theme === "light"}
      title={label}
    >
      <svg className="tl-icon-moon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M13.5 9.6A5.5 5.5 0 0 1 6.4 2.5a5.5 5.5 0 1 0 7.1 7.1Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
      <svg className="tl-icon-sun" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
