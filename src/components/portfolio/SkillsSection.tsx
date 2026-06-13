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
        <p className="mt-4 max-w-2xl text-[var(--text-muted)]">{t("subtitle")}</p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12"
        >
          <SkillOrbit
            groups={items}
            coreLabel={t("coreLabel")}
            autoHint={t("autoHint")}
            clickHint={t("clickHint")}
            mapPrompt={t("mapPrompt")}
            sectorLabel={t("sectorLabel")}
          />
        </motion.div>

        <details className="group mt-14 border-t border-[var(--border-subtle)] pt-10">
          <summary className="cursor-pointer list-none text-center [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs text-[var(--text-muted)]/45 transition-colors hover:text-[var(--accent-primary)]/70">
              <span className="text-[var(--text-muted)]">$</span>
              {t("fullStackToggle")}
              <span
                className="inline-block transition-transform group-open:rotate-180"
                aria-hidden
              >
                ↓
              </span>
            </span>
          </summary>
          <ul className="mt-6 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
            {items.map((group, i) => (
              <motion.li
                key={group.id}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-3 py-5 sm:grid-cols-[140px_1fr] sm:gap-8 sm:py-6"
              >
                <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  {group.category}
                </span>
                <p className="font-[family-name:var(--font-mono)] text-sm leading-relaxed text-[var(--text-muted)]">
                  {group.items.map((skill, j) => (
                    <span key={skill}>
                      {j > 0 && (
                        <span className="mx-2 text-[var(--border-subtle)]">·</span>
                      )}
                      <span className="text-[var(--text-primary)]">{skill}</span>
                    </span>
                  ))}
                </p>
              </motion.li>
            ))}
          </ul>
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
