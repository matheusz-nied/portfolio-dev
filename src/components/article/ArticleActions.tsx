"use client";

import { useState } from "react";

interface ArticleActionsProps {
  variant: "tech" | "reflections";
  labels: {
    copyLink: string;
    copiedLink: string;
    backToTop: string;
  };
}

export function ArticleActions({ variant, labels }: ArticleActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isTech = variant === "tech";

  if (isTech) {
    return (
      <div className="tl-actions">
        <button
          type="button"
          onClick={handleCopyLink}
          className={`tl-action ${copied ? "is-done" : ""}`}
        >
          <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
            {copied ? (
              <path d="M13.5 4.5L6.5 11.5L3 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <>
                <rect x="5" y="5" width="8" height="8" stroke="currentColor" strokeWidth="1.25" />
                <path d="M11 3H4.5C3.67157 3 3 3.67157 3 4.5V11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </>
            )}
          </svg>
          <span aria-live="polite">{copied ? labels.copiedLink : labels.copyLink}</span>
        </button>

        <button type="button" onClick={scrollToTop} className="tl-action">
          <span>{labels.backToTop}</span>
          <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M8 12.5V3.5M8 3.5L4 7.5M8 3.5L12 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-white/[0.08]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleCopyLink}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-mono transition-all duration-150 ${
            copied
              ? isTech
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-purple-500/20 text-purple-200 border border-purple-500/30"
              : isTech
                ? "bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
                : "bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
          }`}
        >
          {copied ? (
            <>
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true">
                <path d="M13.5 4.5L6.5 11.5L3 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{labels.copiedLink}</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 opacity-60" aria-hidden="true">
                <path d="M9.5 6.5L12 4C13.1046 2.89543 13.1046 1.10457 12 0C10.8954 -1.10457 9.10457 -1.10457 8 0L5.5 2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                <path d="M6.5 9.5L4 12C2.89543 13.1046 2.89543 14.8954 4 16C5.10457 17.1046 6.89543 17.1046 8 16L10.5 13.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                <path d="M6 10L10 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              <span>{labels.copyLink}</span>
            </>
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        className="flex items-center gap-2 text-xs font-mono text-white/50 hover:text-white transition-colors duration-150 group"
      >
        <span>{labels.backToTop}</span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-y-0.5"
          aria-hidden="true"
        >
          <path
            d="M8 12.5V3.5M8 3.5L4 7.5M8 3.5L12 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
