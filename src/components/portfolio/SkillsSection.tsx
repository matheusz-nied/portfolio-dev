"use client";

import { useTranslations } from "next-intl";
import { SkillOrbit } from "@/components/portfolio/SkillOrbit";
import type { getSkills } from "@/lib/portfolio";
import styles from "./SkillsSection.module.css";

type SkillGroup = ReturnType<typeof getSkills>[number];

export function SkillsSection({ items }: { items: SkillGroup[] }) {
  const t = useTranslations("skills");

  return (
    <section id="skills" aria-labelledby="skills-title" className="px-6 py-20">
      <div className={styles.heading}>
        <div>
          <p className="section-index">03 / TECH ARSENAL</p>
          <h2 id="skills-title" className="section-title">{t("title")}</h2>
          <p className="section-subtitle">{t("subtitle")}</p>
        </div>
        <span className={styles.headingNote}>{t("exploreHint")}</span>
      </div>
      <SkillOrbit groups={items} />
      <details className={styles.fullStack}>
        <summary>{t("fullStackToggle")} <span aria-hidden>↗</span></summary>
        <dl>
          {items.map((group) => (
            <div key={group.id}>
              <dt>{group.category}</dt>
              <dd>{group.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  );
}
