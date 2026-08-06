"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { getAiProjects } from "@/lib/portfolio";

type AiProject = ReturnType<typeof getAiProjects>[number];

interface AiSectionProps {
  items: AiProject[];
}

export function AiSection({ items }: AiSectionProps) {
  const t = useTranslations("ai");
  const reducedMotion = useReducedMotion();

  return (
    <section id="ai" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>

        <div className="content-panel relative mt-10 overflow-hidden">
          {!reducedMotion && (
            <div className="project-registry-sweep pointer-events-none absolute inset-y-0 w-28" aria-hidden />
          )}
          <div className="project-registry-scanlines pointer-events-none absolute inset-0" aria-hidden />

          <div className="relative divide-y divide-[var(--border-subtle)]/50">
            {items.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="project-module p-5 sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="hud-tag">AI-{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-3 text-lg font-medium text-[var(--text-primary)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--text-muted)]">
                  {item.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tools.map((tool) => (
                    <span
                      key={tool}
                      className="skill-module-chip border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-0.5 text-xs text-[var(--accent-primary)]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
                {item.relatedPost && (
                  <Link
                    href={`/tech/${item.relatedPost}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--accent-primary)] transition-colors hover:text-[var(--accent-secondary)]"
                  >
                    {t("readMore")}
                    <span aria-hidden>→</span>
                  </Link>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
