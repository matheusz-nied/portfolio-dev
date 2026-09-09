"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export function PortfolioNav() {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "#projects", label: t("projects") },
    { href: "#experience", label: t("experience") },
    { href: "#skills", label: t("skills") },
    { href: "#ai", label: t("ai") },
    { href: "#contact", label: t("contact") },
    { href: "/resume", label: t("resume") },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="portfolio-nav sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-space)]/88 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--text-primary)]"
        >
          <span className="brand-mark">K<span>C</span><span className="brand-cursor" aria-hidden>_</span></span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent-primary)]"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent-primary)]"
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher variant="portfolio" />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded border border-[var(--border-subtle)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent-primary)]/40 hover:text-[var(--accent-primary)] md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? t("closeMenu") : t("openMenu")}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              {menuOpen ? (
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" />
              ) : (
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-panel)] px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                {link.href.startsWith("#") ? (
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className="block rounded px-2 py-2.5 text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--accent-primary)]/6 hover:text-[var(--accent-primary)]"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="block rounded px-2 py-2.5 text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--accent-primary)]/6 hover:text-[var(--accent-primary)]"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
