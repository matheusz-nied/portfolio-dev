"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { getSkills } from "@/lib/portfolio";

type SkillGroup = ReturnType<typeof getSkills>[number];

interface SkillsSectionProps {
  items: SkillGroup[];
}

export function SkillsSection({ items }: SkillsSectionProps) {
  const t = useTranslations("skills");

  return (
    <section id="skills" className="px-6 py-20">
      <h2 className="section-title">{t("title")}</h2>
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {items.map((group, i) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-[var(--border-subtle)] p-5"
          >
            <h3 className="text-sm font-medium text-[var(--accent-primary)]">
              {group.category}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-[var(--border-subtle)] px-2.5 py-1 text-sm text-[var(--text-muted)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
