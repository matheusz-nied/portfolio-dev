"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export function PortfolioNav() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");

  const links = [
    { href: "#experience", label: t("experience") },
    { href: "#projects", label: t("projects") },
    { href: "#skills", label: t("skills") },
    { href: "#ai", label: t("ai") },
    { href: "#contact", label: t("contact") },
    { href: "/resume", label: t("resume") },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-space)]/75 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--text-primary)]"
          >
            KC
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            {links.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
          <LanguageSwitcher variant="portfolio" />
        </nav>
      </header>
      <footer className="border-t border-[var(--border-subtle)] px-6 py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2.5 text-sm">
            <Link
              href="/tech"
              className="text-[var(--text-muted)] transition-colors hover:text-[var(--accent-primary)]"
            >
              {tf("techPortal")}
            </Link>
            <Link
              href="/reflections"
              className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              {tf("reflectionsPortal")}
            </Link>
          </div>
          <p className="text-xs text-[var(--text-muted)]/60">{tf("hint")}</p>
        </div>
      </footer>
    </>
  );
}
