"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

interface LanguageSwitcherProps {
  variant?: "portfolio" | "tech" | "reflections";
}

export function LanguageSwitcher({ variant = "portfolio" }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const other: Locale = locale === "pt" ? "en" : "pt";

  const styles = {
    portfolio:
      "text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] px-2.5 py-1 rounded-md transition-colors",
    tech: "text-xs text-[var(--tech-muted)] hover:text-[var(--tech-text)] border border-[var(--tech-border)] px-2.5 py-1 rounded-md transition-colors",
    reflections:
      "text-xs text-[var(--refl-muted)] hover:text-[var(--refl-text)] border border-[var(--refl-border)] px-2.5 py-1 rounded-md transition-colors",
  };

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: other })}
      className={styles[variant]}
      aria-label={`Switch to ${other}`}
    >
      {other.toUpperCase()}
    </button>
  );
}
