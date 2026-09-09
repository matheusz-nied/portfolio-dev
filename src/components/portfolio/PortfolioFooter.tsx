"use client";

import { useLocale, useTranslations } from "next-intl";
import { BlogPortalLinks } from "@/components/portfolio/BlogPortalLinks";
import { useSecretTerminal } from "@/components/easter-eggs/SecretTerminal";
import profile from "../../../content/portfolio/profile.json";

const socialLinks = [
  {
    label: "LinkedIn",
    href: profile.linkedin,
    path: "M6.94 8.5H3.56V19h3.38V8.5ZM5.25 3A1.96 1.96 0 1 0 5.25 6.92 1.96 1.96 0 0 0 5.25 3ZM19 13.24c0-3.16-1.69-4.63-3.94-4.63a3.39 3.39 0 0 0-3.08 1.7V8.5H8.6V19h3.38v-5.2c0-1.37.26-2.7 1.96-2.7 1.68 0 1.7 1.57 1.7 2.79V19H19v-5.76Z",
  },
  {
    label: "GitHub",
    href: profile.github,
    path: "M12 2.75a9.5 9.5 0 0 0-3 18.52c.48.09.65-.2.65-.46v-1.67c-2.66.58-3.22-1.13-3.22-1.13-.43-1.1-1.06-1.4-1.06-1.4-.87-.59.07-.58.07-.58.96.07 1.47.99 1.47.99.85 1.46 2.24 1.04 2.79.8.09-.62.33-1.04.6-1.28-2.12-.24-4.35-1.06-4.35-4.7 0-1.04.37-1.89.98-2.56-.1-.24-.43-1.21.09-2.52 0 0 .8-.26 2.61.98A9.07 9.07 0 0 1 12 6.42a9.1 9.1 0 0 1 2.38.32c1.81-1.24 2.61-.98 2.61-.98.52 1.31.19 2.28.09 2.52.61.67.98 1.52.98 2.56 0 3.65-2.23 4.45-4.36 4.69.34.3.65.88.65 1.78v3.5c0 .26.17.56.66.46A9.5 9.5 0 0 0 12 2.75Z",
  },
  {
    label: "Instagram",
    href: profile.instagram,
    path: "M7.25 2.75h9.5a4.5 4.5 0 0 1 4.5 4.5v9.5a4.5 4.5 0 0 1-4.5 4.5h-9.5a4.5 4.5 0 0 1-4.5-4.5v-9.5a4.5 4.5 0 0 1 4.5-4.5Zm0 1.7a2.8 2.8 0 0 0-2.8 2.8v9.5a2.8 2.8 0 0 0 2.8 2.8h9.5a2.8 2.8 0 0 0 2.8-2.8v-9.5a2.8 2.8 0 0 0-2.8-2.8h-9.5Zm9.9 1.28a1.12 1.12 0 1 1 0 2.24 1.12 1.12 0 0 1 0-2.24ZM12 7.38A4.62 4.62 0 1 1 12 16.62 4.62 4.62 0 0 1 12 7.38Zm0 1.7A2.92 2.92 0 1 0 12 14.92 2.92 2.92 0 0 0 12 9.08Z",
  },
  {
    label: "X",
    href: profile.x,
    path: "M4 3h4.15l4.67 6.24L18.25 3H20l-6.38 7.33L20.5 21h-4.15l-4.9-6.56L5.75 21H4l6.65-7.65L4 3Zm3.28 1.5 9.82 15h1.12L8.4 4.5H7.28Z",
  },
] as const;

export function PortfolioFooter() {
  const tt = useTranslations("terminal");
  const locale = useLocale();

  const { openTerminal } = useSecretTerminal();

  return (
    <footer className="portfolio-footer border-t border-[var(--border-subtle)] px-6 py-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-4">
        <BlogPortalLinks />
        <nav
          className="footer-socials"
          aria-label={locale === "pt" ? "Redes sociais" : "Social media"}
        >
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              title={social.label}
              className="footer-social-link"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={social.path} />
              </svg>
            </a>
          ))}
        </nav>
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
