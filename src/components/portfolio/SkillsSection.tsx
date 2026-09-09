"use client";

import { useTranslations } from "next-intl";
import { SkillOrbit, type SkillProject } from "./SkillOrbit";
import type { getSkills } from "@/lib/portfolio";
import styles from "./SkillsSection.module.css";

export function SkillsSection({ items, projects }: { items: ReturnType<typeof getSkills>; projects: SkillProject[] }) {
  const t = useTranslations("skills");
  return (
    <section id="skills" aria-labelledby="skills-title" className="px-6 py-20">
      <div className={styles.heading}>
        <div><p className="section-index">03 / TECH ARSENAL</p><h2 id="skills-title" className="section-title">{t("title")}</h2><p className="section-subtitle">{t("subtitle")}</p></div>
        <span className={styles.headingNote}>BUILD. CONNECT. SHIP.<span aria-hidden>↙</span></span>
      </div>
      <SkillOrbit groups={items} projects={projects} />
    </section>
  );
}
