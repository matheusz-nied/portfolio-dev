"use client";

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import styles from "./SkillsSection.module.css";

interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

const CATEGORY_GLYPHS: Record<string, string> = {
  frontend: "</>", backend: "{ }", mobile: "[ ]", data: "≡", tools: ">_",
};

export function SkillOrbit({ groups }: { groups: SkillGroup[] }) {
  const t = useTranslations("skills");
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [selection, setSelection] = useState({ category: groups[0]?.id, skill: null as string | null });
  const activeIndex = Math.max(0, groups.findIndex((group) => group.id === selection.category));
  const active = groups[activeIndex];
  const total = groups.reduce((count, group) => count + group.items.length, 0);

  if (!active) return null;

  function selectCategory(index: number) {
    if (groups[index].id !== active.id) {
      setSelection({ category: groups[index].id, skill: null });
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % groups.length; break;
      case "ArrowLeft": next = (index - 1 + groups.length) % groups.length; break;
      case "Home": next = 0; break;
      case "End": next = groups.length - 1; break;
      default: return;
    }
    event.preventDefault();
    selectCategory(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className={styles.console} data-paused={paused || !!reducedMotion}>
      <div className={styles.titlebar}>
        <span><span className={styles.statusDot} aria-hidden />STACK EXPLORER <span className={styles.version}>/ V.03</span></span>
        <button
          type="button"
          className={styles.motionButton}
          onClick={() => setPaused((value) => !value)}
          disabled={!!reducedMotion}
        >
          <span aria-hidden>{paused || reducedMotion ? "▷" : "Ⅱ"}</span>
          {reducedMotion ? t("reducedMotion") : paused ? t("resumeMotion") : t("pauseMotion")}
        </button>
      </div>
      <div className={styles.tabs} role="tablist" aria-label={t("navLabel")}>
        {groups.map((group, index) => (
          <button
            key={group.id}
            ref={(element) => { tabs.current[index] = element; }}
            type="button"
            role="tab"
            id={`${id}-tab-${group.id}`}
            aria-controls={`${id}-panel-${group.id}`}
            aria-selected={group.id === active.id}
            tabIndex={group.id === active.id ? 0 : -1}
            className={styles.tab}
            onClick={() => selectCategory(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span className={styles.tabNumber} aria-hidden>{String(index + 1).padStart(2, "0")}</span>
            <span>{group.category}</span>
            <span className={styles.tabCount}>{group.items.length}</span>
          </button>
        ))}
      </div>
      <div className={styles.body}>
        <div className={styles.reactor} aria-hidden>
          <span className={styles.reactorLabel}>NEURAL CORE / {String(activeIndex + 1).padStart(2, "0")}</span>
          <div className={styles.orbit}>
            <svg viewBox="0 0 320 320" fill="none">
              <circle cx="160" cy="160" r="145" stroke="currentColor" strokeOpacity=".15" />
              <g className={styles.rotor}>
                <circle cx="160" cy="160" r="131" stroke="currentColor" strokeOpacity=".35" strokeDasharray="1 8" />
                <path d="M160 15 A145 145 0 0 1 285.6 87.5" stroke="currentColor" strokeOpacity=".65" strokeWidth="2" />
              </g>
              <circle cx="160" cy="160" r="106" stroke="currentColor" strokeOpacity=".15" strokeDasharray="4 7" />
              {groups.map((group, index) => {
                const angle = (index / groups.length) * Math.PI * 2 - Math.PI / 2;
                const x = 160 + Math.cos(angle) * 131;
                const y = 160 + Math.sin(angle) * 131;
                return (
                  <g key={group.id} opacity={index === activeIndex ? 1 : .22}>
                    <path d={`M${160 + Math.cos(angle) * 91} ${160 + Math.sin(angle) * 91}L${x} ${y}`} stroke="currentColor" strokeDasharray="2 4" />
                    <circle cx={x} cy={y} r="5" fill="var(--bg-surface)" stroke="currentColor" />
                    <circle cx={x} cy={y} r="2" fill="currentColor" />
                  </g>
                );
              })}
              <g className={styles.selector} style={{ transform: `rotate(${activeIndex * (360 / groups.length)}deg)` }}>
                <path d="M138 56 A106 106 0 0 1 182 56" stroke="currentColor" strokeWidth="3" />
                <path d="M156 42L160 48L164 42" stroke="currentColor" />
              </g>
            </svg>
            <div className={styles.core} key={`${active.id}-${selection.skill ?? "category"}`}>
              <span className={styles.coreGlyph}>{CATEGORY_GLYPHS[active.id] ?? "<>"}</span>
              <span className={styles.coreName}>{selection.skill ?? active.category}</span>
              <span className={styles.coreState}>{selection.skill ? "LINK ESTABLISHED" : "SECTOR ONLINE"}</span>
            </div>
          </div>
          <div className={styles.signalBars}>
            {Array.from({ length: 19 }, (_, index) => (
              <span key={index} style={{ height: `${5 + ((index * 7) % 19)}px`, animationDelay: `${index * -.13}s` }} />
            ))}
          </div>
          <p className={styles.reactorCaption}>{t("coreHint")}</p>
        </div>
        <div className={styles.panels}>
          {groups.map((group) => (
            <div
              key={group.id}
              role="tabpanel"
              id={`${id}-panel-${group.id}`}
              aria-labelledby={`${id}-tab-${group.id}`}
              hidden={group.id !== active.id}
              tabIndex={0}
              className={styles.panel}
            >
              {group.id === active.id && (
                <>
                  <div className={styles.panelHeading}>
                    <div><p className={styles.panelLabel}>{t("sectorLabel")} / {String(activeIndex + 1).padStart(2, "0")}</p><h3>{group.category}</h3></div>
                    <span className={styles.moduleCount}>{t("modulesLabel", { count: group.items.length })}</span>
                  </div>
                  <p className={styles.description}>{t.has(`descriptions.${group.id}`) ? t(`descriptions.${group.id}`) : t("subtitle")}</p>
                  <ul className={styles.skillGrid}>
                    {group.items.map((skill, index) => (
                      <li key={skill} style={{ "--delay": `${index * 35}ms` } as CSSProperties}>
                        <button
                          type="button"
                          aria-pressed={selection.skill === skill}
                          className={styles.skillButton}
                          onClick={() => setSelection({ category: group.id, skill: selection.skill === skill ? null : skill })}
                        >
                          <span aria-hidden className={styles.skillIndex}>{String(index + 1).padStart(2, "0")}</span>
                          <span>{skill}</span><span className={styles.skillIndicator} aria-hidden>↗</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className={styles.command} aria-hidden><span>$ </span>connect --sector={active.id}<span className={styles.commandCursor}>_</span></p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <span><span className={styles.statusDot} aria-hidden />{t("totalLabel", { count: total, sectors: groups.length })}</span>
        <span aria-hidden>LOCAL SYSTEM / READY</span>
      </div>
    </div>
  );
}
