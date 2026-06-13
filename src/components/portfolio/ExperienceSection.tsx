"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { getExperience } from "@/lib/portfolio";

type ExperienceItem = ReturnType<typeof getExperience>[number];

interface ExperienceSectionProps {
  items: ExperienceItem[];
}

export function ExperienceSection({ items }: ExperienceSectionProps) {
  const t = useTranslations("experience");

  return (
    <section id="experience" className="px-6 py-20">
      <h2 className="section-title">{t("title")}</h2>
      <div className="mt-12 space-y-10">
        {items.map((item, i) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="relative border-l border-[var(--border-subtle)] pl-6"
          >
            <div className="absolute -left-[4px] top-1.5 h-2 w-2 rounded-full bg-[var(--accent-primary)]/70" />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-medium text-[var(--text-primary)]">
                {item.role}
              </h3>
              <span className="text-sm text-[var(--text-muted)]">
                {item.period.start} — {item.period.end ?? t("present")}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-[var(--accent-primary)]">
              {item.company}
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--text-muted)]">
              {item.highlights.map((h, j) => (
                <li key={j}>{h}</li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
