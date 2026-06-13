"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const PORTALS = [
  { href: "/tech", labelKey: "techPortal" as const },
  { href: "/reflections", labelKey: "reflectionsPortal" as const },
] as const;

export function BlogPortalLinks({ className = "" }: { className?: string }) {
  const t = useTranslations("footer");

  return (
    <nav
      aria-label={t("blogsNav")}
      className={`flex flex-wrap items-center gap-x-1 font-[family-name:var(--font-mono)] text-xs ${className}`}
    >
      {PORTALS.map((portal, i) => (
        <span key={portal.href} className="inline-flex items-center">
          {i > 0 && (
            <span className="mx-2 text-[var(--text-muted)]/25" aria-hidden>
              /
            </span>
          )}
          <Link
            href={portal.href}
            className="text-[var(--text-muted)]/70 transition-colors hover:text-[var(--accent-primary)]"
          >
            {t(portal.labelKey)}
          </Link>
        </span>
      ))}
    </nav>
  );
}
