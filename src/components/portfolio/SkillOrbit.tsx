"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

const BUS_WIDTH = 1000;
const SCRAMBLE_CHARS = "█▓▒░01X?#@";

interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

interface SkillOrbitProps {
  groups: SkillGroup[];
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function moduleHex(id: string, index: number) {
  const base = hashString(id) % 0xffff;
  return `0x${(base + index * 0x137).toString(16).toUpperCase().padStart(4, "0")}`;
}

function skillChecksum(skill: string) {
  return hashString(skill).toString(16).toUpperCase().slice(0, 4);
}

function busNodeX(index: number, total: number) {
  if (total <= 1) return 0.5;
  const margin = 0.08;
  return margin + (index / (total - 1)) * (1 - margin * 2);
}

function signalStrength(count: number, max: number) {
  return Math.max(2, Math.min(5, Math.round((count / max) * 5)));
}

function SignalBars({ strength, max = 5 }: { strength: number; max?: number }) {
  return (
    <span className="inline-flex items-end gap-0.5" aria-hidden>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`w-1 rounded-sm transition-all duration-300 ${
            i < strength ? "bg-[var(--accent-primary)]" : "bg-[var(--border-subtle)]"
          }`}
          style={{ height: `${5 + i * 3}px` }}
        />
      ))}
    </span>
  );
}

function ChannelWaveform({ active }: { active: boolean }) {
  return (
    <svg width={40} height={14} viewBox="0 0 40 14" className="opacity-70" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={i * 8}
          y={3}
          width={3}
          height={8}
          rx={1}
          fill="var(--accent-primary)"
          className={active ? "skill-rack-wave-bar" : undefined}
          style={{ animationDelay: `${i * 0.09}s` }}
        />
      ))}
    </svg>
  );
}

function ScrambleTitle({
  text,
  active,
  reducedMotion,
}: {
  text: string;
  active: boolean;
  reducedMotion: boolean | null;
}) {
  const [display, setDisplay] = useState(text);
  const keyRef = useRef("");

  useEffect(() => {
    if (!active || reducedMotion) return;

    if (keyRef.current === text) return;
    keyRef.current = text;

    let frame = 0;
    const total = 14;
    const timer = setInterval(() => {
      frame += 1;
      if (frame >= total) {
        setDisplay(text);
        clearInterval(timer);
        return;
      }
      const progress = frame / total;
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " " || char === "/") return char;
            if (i / text.length < progress) return char;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join(""),
      );
    }, 40);

    return () => clearInterval(timer);
  }, [active, reducedMotion, text]);

  return <>{!active || reducedMotion ? text : display}</>;
}

function InjectCommand({
  sector,
  reducedMotion,
}: {
  sector: string;
  reducedMotion: boolean | null;
}) {
  const t = useTranslations("skills");
  const full = t("injectCommand", { sector });
  const [visible, setVisible] = useState("");

  useEffect(() => {
    if (reducedMotion) return;

    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setVisible(full.slice(0, i));
      if (i >= full.length) clearInterval(timer);
    }, 22);

    return () => clearInterval(timer);
  }, [full, reducedMotion]);

  return (
    <p className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-muted)]/70">
      <span className="text-[var(--accent-highlight)]/90">root@netrun</span>
      <span className="text-[var(--text-muted)]/40">:</span>
      <span className="text-[var(--accent-primary)]/80">~/stack</span>
      <span className="text-[var(--text-muted)]">$ </span>
      {reducedMotion ? full : visible}
      {!reducedMotion && (
        <span className="skill-inject-cursor ml-0.5 inline-block h-[1em] w-[7px] translate-y-px bg-[var(--accent-primary)]/75" />
      )}
    </p>
  );
}

export function SkillOrbit({ groups }: SkillOrbitProps) {
  const t = useTranslations("skills");
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeId, setActiveId] = useState(groups[0]?.id ?? null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [glitching, setGlitching] = useState(false);

  const maxSkills = Math.max(...groups.map((g) => g.items.length), 1);
  const active = groups.find((g) => g.id === activeId);
  const activeIndex = groups.findIndex((g) => g.id === activeId);
  const litIndex = hoveredId
    ? groups.findIndex((g) => g.id === hoveredId)
    : activeIndex;

  const [sessionId] = useState(
    () =>
      `NR-${hashString(groups.map((g) => g.id).join("-"))
        .toString(16)
        .toUpperCase()
        .slice(0, 6)}`,
  );

  const selectCategory = useCallback(
    (id: string) => {
      if (id === activeId) return;
      setActiveId(id);
      if (!prefersReducedMotion) {
        setGlitching(true);
        window.setTimeout(() => setGlitching(false), 380);
      }
    },
    [activeId, prefersReducedMotion],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (groups.length < 2) return;
      const idx = groups.findIndex((g) => g.id === activeId);
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        selectCategory(groups[(idx + 1) % groups.length].id);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        selectCategory(groups[(idx - 1 + groups.length) % groups.length].id);
      }
    },
    [activeId, groups, selectCategory],
  );

  return (
    <div
      ref={containerRef}
      className={`skill-inject content-panel relative overflow-hidden outline-none ${glitching ? "is-glitching" : ""}`}
      tabIndex={0}
      role="application"
      aria-label={t("navLabel")}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={handleKeyDown}
    >
      {!prefersReducedMotion && (
        <>
          <div className="skill-rack-sweep pointer-events-none absolute inset-y-0 w-24" aria-hidden />
          <div className="skill-inject-glitch pointer-events-none absolute inset-0" aria-hidden />
        </>
      )}
      <div className="skill-rack-scanlines pointer-events-none absolute inset-0" aria-hidden />
      <div className="skill-inject-vignette pointer-events-none absolute inset-0" aria-hidden />

      <span className="skill-inject-bracket skill-inject-bracket-tl" aria-hidden />
      <span className="skill-inject-bracket skill-inject-bracket-tr" aria-hidden />
      <span className="skill-inject-bracket skill-inject-bracket-bl" aria-hidden />
      <span className="skill-inject-bracket skill-inject-bracket-br" aria-hidden />

      <div className="skill-inject-titlebar relative flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)]/35 px-4 py-2 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="skill-inject-dot skill-inject-dot-red" aria-hidden />
          <span className="skill-inject-dot skill-inject-dot-amber" aria-hidden />
          <span className="skill-inject-dot skill-inject-dot-green" aria-hidden />
          <span className="ml-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]/55">
            {t("windowTitle")}
          </span>
        </div>
        <p className="hud-label flex items-center gap-2 text-[var(--text-muted)]/65">
          {!prefersReducedMotion && focused && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-primary)] opacity-30" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
            </span>
          )}
          {t("selectHint")}
        </p>
      </div>

      <div className="skill-inject-hud relative flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[var(--border-subtle)]/30 px-4 py-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider sm:px-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[var(--text-muted)]">
          <span>
            <span className="text-[var(--text-muted)]/55">{t("sessionLabel")}</span>{" "}
            <span className="text-[var(--accent-primary)]">{sessionId}</span>
          </span>
          <span>
            <span className="text-[var(--text-muted)]/55">{t("iceLabel")}</span>{" "}
            <span className="text-[var(--accent-highlight)]/90">{t("iceStatus")}</span>
          </span>
          <span className="hidden sm:inline">
            <span className="text-[var(--text-muted)]/55">{t("uplinkLabel")}</span>{" "}
            <span className="text-[var(--accent-primary)]">{t("uplinkStatus")}</span>
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[var(--accent-primary)]/80">
          <SignalBars strength={4} />
          <span className="hud-tag">{t("breachTag")}</span>
        </span>
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)]/25 px-4 py-2 sm:px-5">
        <p className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-muted)]">
          <span className="text-[var(--accent-primary)]">$</span> {t("terminalPrompt")}
        </p>
        <p className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-muted)]/45">
          {t("modulesLabel", { count: groups.reduce((n, g) => n + g.items.length, 0) })}
        </p>
      </div>

      <div className="relative px-3 pt-3 sm:px-4" aria-hidden>
        <svg viewBox={`0 0 ${BUS_WIDTH} 36`} className="h-9 w-full" preserveAspectRatio="none">
          <line x1="0" y1="18" x2={BUS_WIDTH} y2="18" stroke="var(--border-subtle)" strokeWidth="1" opacity="0.45" />
          <line
            x1="0"
            y1="18"
            x2={BUS_WIDTH}
            y2="18"
            stroke="var(--accent-primary)"
            strokeWidth="1"
            strokeOpacity={activeIndex >= 0 ? 0.55 : 0.15}
            className={!prefersReducedMotion ? "skill-rack-bus-line" : undefined}
          />
          {groups.map((group, index) => {
            const lit = litIndex === index;
            const x = busNodeX(index, groups.length) * BUS_WIDTH;
            return (
              <g key={group.id}>
                <line
                  x1={x}
                  y1="18"
                  x2={x}
                  y2="32"
                  stroke="var(--accent-primary)"
                  strokeWidth="1"
                  strokeOpacity={lit ? 0.65 : 0.1}
                  className="transition-all duration-300"
                />
                <rect
                  x={x - 5}
                  y="13"
                  width="10"
                  height="10"
                  fill="var(--bg-space)"
                  stroke="var(--accent-primary)"
                  strokeWidth="1"
                  strokeOpacity={lit ? 0.9 : 0.3}
                  className="transition-all duration-300"
                />
                {lit && (
                  <circle cx={x} cy="18" r="2" fill="var(--accent-highlight)" fillOpacity="0.95" />
                )}
              </g>
            );
          })}
          {litIndex >= 0 && !prefersReducedMotion && (
            <rect width="6" height="3" fill="var(--accent-highlight)" opacity="0.9">
              <animateMotion
                dur="1.2s"
                repeatCount="indefinite"
                path={`M ${busNodeX(0, groups.length) * BUS_WIDTH} 18 L ${busNodeX(groups.length - 1, groups.length) * BUS_WIDTH} 18`}
              />
            </rect>
          )}
        </svg>
      </div>

      <div
        className="skill-rack-grid relative grid grid-cols-2 border-t border-[var(--border-subtle)]/35 sm:grid-cols-3 lg:grid-cols-5"
        role="tablist"
        aria-label={t("navLabel")}
      >
        {groups.map((group, index) => {
          const isActive = group.id === activeId;
          const isHovered = group.id === hoveredId;

          return (
            <button
              key={group.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`skill-panel-${group.id}`}
              id={`skill-tab-${group.id}`}
              onClick={() => selectCategory(group.id)}
              onMouseEnter={() => setHoveredId(group.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`skill-rack-module skill-inject-module group relative flex min-h-[148px] flex-col justify-between gap-2.5 overflow-hidden px-4 py-4 text-left sm:min-h-[162px] sm:px-5 sm:py-5 ${
                index > 0 ? "border-[var(--border-subtle)]/35 lg:border-l" : ""
              } ${index % 2 === 1 ? "border-l" : ""} ${index >= 2 ? "border-t sm:border-t-0" : ""} ${
                index >= 3 ? "sm:border-t lg:border-t-0" : ""
              } ${isActive ? "is-active" : ""}`}
            >
              {isActive && <span className="skill-inject-module-noise pointer-events-none absolute inset-0" aria-hidden />}

              <span className="skill-inject-module-bracket skill-inject-module-bracket-tl" aria-hidden />
              <span className="skill-inject-module-bracket skill-inject-module-bracket-br" aria-hidden />

              <div className="relative flex items-start justify-between gap-2">
                <div>
                  <span className="hud-label text-[var(--text-muted)]/50">{moduleHex(group.id, index)}</span>
                  <span className="mt-0.5 block font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-muted)]/40">
                    SKL-{String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <ChannelWaveform active={isActive || isHovered} />
              </div>

              <div className="relative">
                <span
                  className={`block font-[family-name:var(--font-display)] text-base font-medium tracking-wide transition-colors sm:text-lg ${
                    isActive || isHovered
                      ? "text-[var(--accent-primary)]"
                      : "text-[var(--text-primary)]"
                  } ${isActive ? "skill-inject-glitch-text" : ""}`}
                >
                  {group.category}
                </span>
                <span className="mt-1 block font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-muted)]/50">
                  {t("modulesLabel", { count: group.items.length })}
                </span>
              </div>

              {isActive && !prefersReducedMotion && (
                <div className="skill-inject-decrypt relative h-1 w-full overflow-hidden bg-[var(--border-subtle)]/30">
                  <span className="skill-inject-decrypt-bar block h-full w-full bg-[var(--accent-primary)]/70" />
                </div>
              )}

              <div className="relative flex items-end justify-between gap-2">
                <SignalBars strength={signalStrength(group.items.length, maxSkills)} />
                <span
                  className={`font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider ${
                    isActive
                      ? "text-[var(--accent-highlight)]"
                      : isHovered
                        ? "text-[var(--accent-primary)]/70"
                        : "text-[var(--text-muted)]/35"
                  }`}
                >
                  {isActive ? t("injectedTag") : t("standbyTag")}
                </span>
              </div>

              <p
                className={`relative truncate font-[family-name:var(--font-mono)] text-[10px] leading-relaxed ${
                  isActive || isHovered ? "text-[var(--text-muted)]/80" : "text-[var(--text-muted)]/38"
                }`}
              >
                {group.items.slice(0, 3).join(" · ")}
                {group.items.length > 3 ? " …" : ""}
              </p>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            id={`skill-panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`skill-tab-${active.id}`}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="skill-inject-panel relative border-t border-[var(--border-subtle)]/35 px-4 py-5 sm:px-6 sm:py-6"
          >
            <InjectCommand sector={active.id} reducedMotion={prefersReducedMotion} />

            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]/45">
                  {t("sectorLabel")} · {moduleHex(active.id, activeIndex)} · SKL-
                  {String(activeIndex + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl font-medium tracking-wide text-[var(--accent-primary)] sm:text-2xl">
                  <ScrambleTitle text={active.category} active reducedMotion={prefersReducedMotion} />
                </h3>
              </div>
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-muted)]/40">
                [{String(activeIndex + 1).padStart(2, "0")}/{String(groups.length).padStart(2, "0")}]
              </span>
            </div>

            <p className="mt-3 font-[family-name:var(--font-mono)] text-[10px] text-[var(--accent-primary)]/55">
              {t("extractLabel", { count: active.items.length })}
            </p>

            <ul className="mt-4 flex flex-wrap gap-2">
              {active.items.map((skill, i) => (
                <motion.li
                  key={skill}
                  initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.86, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: 0.08 + i * 0.05,
                    type: "spring",
                    stiffness: 360,
                    damping: 26,
                  }}
                  whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.04 }}
                >
                  <span className="skill-inject-chip skill-module-chip inline-flex items-center gap-2 border border-[var(--border-subtle)] bg-[var(--bg-card)]/80 px-3 py-2 font-[family-name:var(--font-mono)] text-xs text-[var(--text-primary)]">
                    <span className="text-[var(--accent-primary)]/45">{String(i + 1).padStart(2, "0")}</span>
                    <span>{skill}</span>
                    <span className="text-[var(--text-muted)]/35">#{skillChecksum(skill)}</span>
                  </span>
                </motion.li>
              ))}
            </ul>

            {!prefersReducedMotion && (
              <div className="mt-5 h-px overflow-hidden bg-[var(--border-subtle)]/35">
                <motion.span
                  key={active.id}
                  className="block h-full w-1/3 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent"
                  initial={{ x: "-120%" }}
                  animate={{ x: "450%" }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="skill-inject-statusbar relative flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)]/35 px-4 py-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider sm:px-5">
        <p className="hud-label text-[var(--text-muted)]/70">
          <span className="text-[var(--accent-highlight)]/85">{t("coreLabel")}</span>
          <span className="mx-2 opacity-25">|</span>
          {t("rackHint")}
        </p>
        <p className="text-[var(--text-muted)]/45">{t("footerSig")}</p>
      </div>
    </div>
  );
}
