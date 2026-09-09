"use client";

import { useTranslations } from "next-intl";
import type { getExperience } from "@/lib/portfolio";
import styles from "./ExperienceSection.module.css";

type ExperienceItem = ReturnType<typeof getExperience>[number];
const RECENT_EXPERIENCE_COUNT = 5;

function CareerEntry({ item, index }: { item: ExperienceItem; index: number }) {
  const t = useTranslations("experience");
  const current = item.period.end === null;

  return (
    <li className={styles.entry}>
      <span className={`${styles.node} ${current ? styles.nodeCurrent : ""}`} aria-hidden />
      <article className={`${styles.card} ${current ? styles.current : ""}`}>
        <div className={styles.cardMeta}>
          <span aria-hidden>EXP / {String(index + 1).padStart(2, "0")}</span>
          <span className={current ? styles.live : styles.completed}>
            {current && <span className={styles.liveDot} aria-hidden />}
            {current ? t("liveLabel") : t("completed")}
          </span>
        </div>
        <header className={styles.cardHeader}>
          <div>
            <p className={styles.company}>{item.company}</p>
            <h3 className={styles.role}>{item.role}</h3>
          </div>
          <span className={styles.year} aria-hidden>{item.period.startYear}</span>
        </header>
        <p className={styles.period}>
          <time dateTime={item.period.start}>{item.period.startLabel}</time>
          <span aria-hidden> — </span>
          {item.period.end ? (
            <time dateTime={item.period.end}>{item.period.endLabel}</time>
          ) : t("present")}
        </p>
        <ul className={styles.highlights}>
          {item.highlights.map((line) => <li key={line}>{line}</li>)}
        </ul>
        <ul className={styles.stack} aria-label={t("technologies")}>
          {item.stack.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
      </article>
    </li>
  );
}

export function ExperienceLog({ items }: { items: ExperienceItem[] }) {
  const t = useTranslations("experience");
  const recent = items.slice(0, RECENT_EXPERIENCE_COUNT);
  const archived = items.slice(RECENT_EXPERIENCE_COUNT);

  return (
    <div className={styles.log}>
      <div className={styles.logHeader}>
        <span><span aria-hidden>$ </span>{t("logPrompt")}</span>
        <span>{t("receivingLabel", { count: items.length })}</span>
      </div>
      <ol className={styles.timeline}>
        {recent.map((item, index) => <CareerEntry key={item.id} item={item} index={index} />)}
      </ol>
      {archived.length > 0 && (
        <details className={styles.archive}>
          <summary>{t("archiveToggle", { count: archived.length })}</summary>
          <ol className={styles.timeline} start={RECENT_EXPERIENCE_COUNT + 1}>
            {archived.map((item, index) => (
              <CareerEntry key={item.id} item={item} index={RECENT_EXPERIENCE_COUNT + index} />
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}
