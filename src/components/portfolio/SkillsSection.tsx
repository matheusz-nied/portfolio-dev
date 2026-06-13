"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SkillOrbit } from "@/components/portfolio/SkillOrbit";
import type { getSkills } from "@/lib/portfolio";

type SkillGroup = ReturnType<typeof getSkills>[number];

interface SkillsSectionProps {
  items: SkillGroup[];
}

export function SkillsSection({ items }: SkillsSectionProps) {
  const t = useTranslations("skills");

  return (
    <section id="skills" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="section-title">{t("title")}</h2>
        <p className="mt-3 max-w-md text-sm text-[var(--text-muted)]">
          {t("subtitle")}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14"
        >
          <SkillOrbit
            groups={items}
            coreLabel={t("coreLabel")}
            autoHint={t("autoHint")}
            clickHint={t("clickHint")}
          />
        </motion.div>

        {/* Full stack — discreet, for users who prefer not to interact */}
        <details className="group mx-auto mt-16 max-w-2xl">
          <summary className="cursor-pointer list-none text-center text-xs text-[var(--text-muted)]/45 transition-colors hover:text-[var(--text-muted)]/70 [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-1.5 border-b border-dotted border-[var(--border-subtle)] pb-0.5">
              {t("fullStackToggle")}
              <span
                className="inline-block transition-transform group-open:rotate-180"
                aria-hidden
              >
                ↓
              </span>
            </span>
          </summary>
          <div className="mt-6 space-y-5 rounded-xl border border-[var(--border-subtle)]/50 bg-[var(--bg-card)]/40 px-5 py-5">
            {items.map((group) => (
              <div key={group.id}>
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]/60">
                  {group.category}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">
                  {group.items.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </details>

        <ul className="sr-only">
          {items.map((group) => (
            <li key={group.id}>
              {group.category}: {group.items.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
