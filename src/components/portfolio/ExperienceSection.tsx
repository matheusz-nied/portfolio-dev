"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ExperienceLog } from "@/components/portfolio/ExperienceLog";
import type { getExperience } from "@/lib/portfolio";

type ExperienceItem = ReturnType<typeof getExperience>[number];

interface ExperienceSectionProps {
  items: ExperienceItem[];
}

export function ExperienceSection({ items }: ExperienceSectionProps) {
  const t = useTranslations("experience");

  return (
    <section id="experience" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="section-title">{t("title")}</h2>
        <p className="mt-4 max-w-lg text-[var(--text-muted)]">{t("subtitle")}</p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12"
        >
          <ExperienceLog
            items={items}
            presentLabel={t("present")}
            logPrompt={t("logPrompt")}
            archiveCount={t("archiveCount")}
            liveLabel={t("liveLabel")}
            scanHint={t("scanHint")}
            lockedHint={t("lockedHint")}
            telemetryLock={t("telemetryLock")}
            telemetrySnr={t("telemetrySnr")}
            telemetryCoords={t("telemetryCoords")}
          />
        </motion.div>
      </div>
    </section>
  );
}
