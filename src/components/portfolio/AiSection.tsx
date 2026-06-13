"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { getAiProjects } from "@/lib/portfolio";

type AiProject = ReturnType<typeof getAiProjects>[number];

interface AiSectionProps {
  items: AiProject[];
}

export function AiSection({ items }: AiSectionProps) {
  const t = useTranslations("ai");

  return (
    <section id="ai" className="px-6 py-20">
      <h2 className="section-title">{t("title")}</h2>
      <p className="mt-4 max-w-xl text-[var(--text-muted)]">{t("subtitle")}</p>
      <div className="mt-12 space-y-5">
        {items.map((item, i) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-[var(--border-subtle)] p-6"
          >
            <h3 className="text-lg font-medium text-[var(--text-primary)]">
              {item.title}
            </h3>
            <p className="mt-2 leading-relaxed text-[var(--text-muted)]">
              {item.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
              {item.tools.map((tool) => (
                <span key={tool} className="text-xs text-[var(--accent-primary)]">
                  {tool}
                </span>
              ))}
            </div>
            {item.relatedPost && (
              <Link
                href={`/tech/${item.relatedPost}`}
                className="mt-4 inline-block text-sm text-[var(--accent-primary)] hover:underline"
              >
                {t("readMore")} →
              </Link>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
