"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import iconPaths from "./skill-icon-paths.json";
import styles from "./SkillsSection.module.css";

interface SkillGroup { id: string; category: string; items: string[] }
export interface SkillProject { id: string; title: string; stack: string[] }
const FEATURED: Record<string, string[]> = {
  frontend: ["React", "Next.js", "Angular"],
  backend: ["Python", "Node.js", "Laravel"],
  mobile: ["Flutter", "Dart", "Firebase"],
};

// Brand silhouettes from Simple Icons 16.30.0 (CC0), stored locally.
function TechIcon({ name }: { name: string }) {
  const path = (iconPaths as Record<string, string>)[name];
  return (
    <svg viewBox="0 0 24 24" fill={path ? "currentColor" : "none"} aria-hidden>
      {path ? <path d={path} /> : name === "SQL" ? (
        <g stroke="currentColor" strokeWidth="1.5"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/></g>
      ) : name === "Code review" ? (
        <g stroke="currentColor" strokeWidth="1.5"><path d="m8 5-6 7 6 7M16 5l6 7-6 7m-7-7 3 3 5-6"/></g>
      ) : (
        <g stroke="currentColor" strokeWidth="1.5"><path d="m5 6 6 6-6 6m8 0h7"/><path d="M2 2h20v20H2z" strokeOpacity=".4"/></g>
      )}
    </svg>
  );
}

export function SkillOrbit({ groups, projects }: { groups: SkillGroup[]; projects: SkillProject[] }) {
  const t = useTranslations("skills");
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const spotlight = hovered ?? selected;
  const main = groups.filter((group) => FEATURED[group.id]);
  const support = groups.filter((group) => !FEATURED[group.id]);
  const related = selected ? projects.filter((project) => project.stack.some((tech) => tech.toLowerCase() === selected.toLowerCase())) : [];

  function skillButton(skill: string, prominent = false) {
    return (
      <button key={skill} type="button" className={prominent ? styles.featuredSkill : styles.skill}
        aria-pressed={selected === skill} data-lit={spotlight === skill}
        onPointerEnter={() => setHovered(skill)} onPointerLeave={() => setHovered(null)}
        onFocus={() => setHovered(skill)} onBlur={() => setHovered(null)}
        onClick={() => setSelected(selected === skill ? null : skill)}
        onKeyDown={(event) => { if (event.key === "Escape") { setSelected(null); setHovered(null); } }}>
        <span className={styles.icon}><TechIcon name={skill}/><span className={styles.iconRipple}/></span>
        <span className={styles.skillName}>{skill}</span>
        {prominent && <span className={styles.pedestal} aria-hidden />}
      </button>
    );
  }

  return (
    <div className={styles.arsenal}>
      <div className={styles.main}>
        {main.map((group, index) => {
          const featured = FEATURED[group.id].filter((skill) => group.items.includes(skill));
          const active = spotlight && group.items.includes(spotlight) ? spotlight : featured[0];
          return (
            <div key={group.id} className={styles.discipline} data-active={!!spotlight && group.items.includes(spotlight)}>
              <div className={styles.watermark} key={active} aria-hidden><TechIcon name={active}/></div>
              <div className={styles.disciplineMeta}><span>0{index + 1} /</span><span className={styles.barcode} aria-hidden/></div>
              <h3>{group.category}<span aria-hidden>.</span></h3>
              <p className={styles.tagline}>{t(`taglines.${group.id}`)}</p>
              <div className={styles.featured}>{featured.map((skill) => skillButton(skill, true))}</div>
              <ul className={styles.secondary}>
                {group.items.filter((skill) => !featured.includes(skill)).map((skill) => <li key={skill}>{skillButton(skill)}</li>)}
              </ul>
            </div>
          );
        })}
      </div>
      <div className={styles.support}>
        {support.map((group) => (
          <div className={styles.supportGroup} key={group.id}>
            <h3><span aria-hidden>{group.id === "data" ? "04" : "05"} / </span>{group.category}</h3>
            <ul>{group.items.map((skill) => <li key={skill}>{skillButton(skill)}</li>)}</ul>
          </div>
        ))}
      </div>
      <div className={styles.readout}>
        {selected ? (
          <>
            <span className={styles.selection}><span aria-hidden>↳</span> {selected}</span>
            <div className={styles.projectLinks}>
              {related.length > 0 ? <><span>{t("usedIn")}</span>{related.map((project) => <Link key={project.id} href={`/projects/${project.id}`}>{project.title}<span aria-hidden>↗</span></Link>)}</> : <Link href="/#experience">{t("experienceLink")}<span aria-hidden>↗</span></Link>}
            </div>
            <button type="button" onClick={() => { setSelected(null); setHovered(null); }} aria-label={t("clearSelection")} className={styles.clear}>×</button>
          </>
        ) : (
          <><span className={styles.hint}><span aria-hidden>↗</span>{t("arsenalHint")}</span><span className={styles.count}>{groups.reduce((sum, group) => sum + group.items.length, 0)} / {t("technologiesLabel")}</span></>
        )}
      </div>
    </div>
  );
}
