"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ExperienceLog } from "@/components/portfolio/ExperienceLog";
import type { getExperience } from "@/lib/portfolio";
import styles from "./ExperienceSection.module.css";

type ExperienceItem = ReturnType<typeof getExperience>[number];

export function ExperienceSection({ items }: { items: ExperienceItem[] }) {
  const t = useTranslations("experience");
  const firstYear = items.length ? Math.min(...items.map((item) => Number(item.period.startYear))) : null;
  const current = items.find((item) => item.period.end === null);
  const companies = new Set(items.map((item) => item.company)).size;

  return (
    <section id="experience" aria-labelledby="experience-title" className="px-6 py-20">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <p className="section-index">02 / CAREER LOG</p>
          <h2 id="experience-title" className="section-title">{t("title")}</h2>
          <p className="section-subtitle">{t("subtitle")}</p>
          <dl className={styles.stats}>
            {firstYear && <div><dt>{t("since")}</dt><dd>{firstYear}</dd></div>}
            <div><dt>{t("companies")}</dt><dd>{String(companies).padStart(2, "0")}</dd></div>
          </dl>
          {current && (
            <div className={styles.currentCompany}>
              <p><span className={styles.liveDot} aria-hidden />{t("currently")}</p>
              <span>{current.company}</span>
              <p className={styles.currentRole}>{current.role}</p>
            </div>
          )}
          <Link href="/resume" className={styles.resumeLink}>
            {t("resumeLink")} <span aria-hidden>↗</span>
          </Link>
        </div>
        <ExperienceLog items={items} />
      </div>
    </section>
  );
}
