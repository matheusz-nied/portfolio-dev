"use client";

import { useTranslations } from "next-intl";
import { BlogPortalLinks } from "@/components/portfolio/BlogPortalLinks";
import { useSecretTerminal } from "@/components/easter-eggs/SecretTerminal";

export function PortfolioFooter() {
  const tt = useTranslations("terminal");

  const { openTerminal } = useSecretTerminal();

  return (
    <footer className="border-t border-[var(--border-subtle)] px-6 py-6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <BlogPortalLinks />
        <button
          type="button"
          onClick={openTerminal}
          title={tt("shortcutHint")}
          className="font-[family-name:var(--font-mono)] text-xs text-[var(--text-muted)]/50 transition-colors hover:text-[var(--accent-primary)]"
        >
          <span className="text-[var(--text-muted)]">$</span> {tt("openTrigger")}
        </button>
      </div>
    </footer>
  );
}
