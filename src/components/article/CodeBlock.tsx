"use client";

import { useState, useRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { useLocale } from "next-intl";

interface CodeBlockProps extends ComponentPropsWithoutRef<"pre"> {
  children?: ReactNode;
  "data-language"?: string;
  "data-theme"?: string;
}

const LANGUAGE_LABELS: Record<string, string> = {
  python: "Python",
  py: "Python",
  typescript: "TypeScript",
  ts: "TypeScript",
  tsx: "TSX",
  javascript: "JavaScript",
  js: "JavaScript",
  jsx: "JSX",
  bash: "Bash",
  sh: "Shell",
  shell: "Shell",
  zsh: "Zsh",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  html: "HTML",
  css: "CSS",
  sql: "SQL",
  markdown: "Markdown",
  md: "Markdown",
  mdx: "MDX",
};

export function CodeBlock({
  children,
  className = "",
  "data-language": language,
  "data-theme": theme,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  const locale = useLocale();
  const isPt = locale === "pt";
  const copyLabel = isPt ? "Copiar" : "Copy";
  const copiedLabel = isPt ? "Copiado!" : "Copied!";

  const displayLang = language
    ? LANGUAGE_LABELS[language.toLowerCase()] ?? language.toUpperCase()
    : "";

  const handleCopy = async () => {
    if (!preRef.current) return;
    const text = preRef.current.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API fails
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="tl-code not-prose group my-8 overflow-hidden rounded-xl border border-[rgba(var(--signal-accent-rgb),0.16)] bg-[#0b0d13] shadow-2xl shadow-black/60 transition-all duration-200 hover:border-[rgba(var(--signal-accent-rgb),0.4)]">
      {/* Code Header Bar */}
      <div className="tl-code-head flex items-center justify-between border-b border-white/[0.08] bg-black/40 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="tl-code-dots flex items-center gap-1.5 opacity-70 transition-opacity group-hover:opacity-100">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/80 inline-block" />
          </div>
          {displayLang && (
            <span className="tl-code-lang font-mono text-[0.6875rem] font-medium tracking-wider uppercase text-white/50 bg-white/[0.06] px-2 py-0.5 rounded">
              {displayLang}
            </span>
          )}
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? copiedLabel : copyLabel}
          className={`tl-code-copy flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-mono transition-all ${
            copied
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "text-white/60 hover:text-white hover:bg-white/[0.08] border border-transparent"
          }`}
        >
          {copied ? (
            <>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="h-3.5 w-3.5 text-emerald-400"
              >
                <path
                  d="M13.5 4.5L6.5 11.5L3 8"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{copiedLabel}</span>
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="h-3.5 w-3.5 text-white/50 group-hover:text-white"
              >
                <rect
                  x="5"
                  y="5"
                  width="8"
                  height="8"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
                <path
                  d="M11 3H4.5C3.67157 3 3 3.67157 3 4.5V11"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
              <span>{copyLabel}</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="tl-code-scroll relative overflow-x-auto p-4 font-mono text-[0.875rem] leading-[1.7] text-slate-200 selection:bg-white/20">
        <pre
          ref={preRef}
          data-language={language}
          data-theme={theme}
          className={`!bg-transparent !p-0 !m-0 !border-0 font-mono text-[0.875rem] leading-[1.7] ${className}`}
          {...props}
        >
          {children}
        </pre>
      </div>
    </div>
  );
}
