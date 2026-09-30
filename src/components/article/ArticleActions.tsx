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
    <div className="cj-actions">
      <button
        type="button"
        onClick={handleCopyLink}
        className={`cj-action ${copied ? "is-done" : ""}`}
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          {copied ? (
            <path d="M13.5 4.5L6.5 11.5L3 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <>
              <rect x="5" y="5" width="8" height="8" stroke="currentColor" strokeWidth="1.2" />
              <path d="M11 3H4.5C3.67157 3 3 3.67157 3 4.5V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </>
          )}
        </svg>
        <span aria-live="polite">{copied ? labels.copiedLink : labels.copyLink}</span>
      </button>

      <button type="button" onClick={scrollToTop} className="cj-action">
        <span>{labels.backToTop}</span>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 12.5V3.5M8 3.5L4 7.5M8 3.5L12 7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
