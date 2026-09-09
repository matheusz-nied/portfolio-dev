"use client";

import {
  motion,
  AnimatePresence, 
  useReducedMotion,
} from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import profile from "../../../content/portfolio/profile.json";

const FIELD_WIDTH = 1000;
const FIELD_HEIGHT = 520;
const DISPLAY_NAME = profile.displayName ?? profile.name;
const INTERACTIVE_LETTERS = DISPLAY_NAME.replace(/\s/g, "").split("");
const NAME_SEGMENTS = (() => {
  let letterIndex = 0;
  return DISPLAY_NAME.split("").map((char, charIndex) => {
    if (char === " ") {
      return { type: "space" as const, key: `space-${charIndex}` };
    }
    const index = letterIndex++;
    return { type: "letter" as const, char, index, key: `${char}-${charIndex}` };
  });
})();
const HARMONIC_X = [0.62, 0.68, 0.74, 0.8, 0.86, 0.92];

function getHarmonicIndex(letterIndex: number): number {
  return letterIndex % HARMONIC_X.length;
}

function waveY(
  x: number,
  probeX: number,
  synced: boolean,
  height = FIELD_HEIGHT,
): number {
  const nx = x / FIELD_WIDTH;
  const dist = Math.abs(nx - probeX);
  const boost = Math.max(0, 1 - dist * 2.8) * (synced ? 0.22 : 0.14);
  const amp = (synced ? 0.16 : 0.1) + boost;
  return (
    height * 0.5 +
    Math.sin(nx * Math.PI * 4 + probeX * Math.PI * 2) * height * amp +
    Math.sin(nx * Math.PI * 9 + probeX * 0.6) * height * 0.028
  );
}

function buildWavePath(
  probeX: number,
  synced: boolean,
  segments = 48,
): string {
  const points: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * FIELD_WIDTH;
    points.push([x, waveY(x, probeX, synced)]);
  }

  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev[0] + curr[0]) / 2;
    d += ` Q ${cpx} ${prev[1]} ${curr[0]} ${curr[1]}`;
  }
  return d;
}

export function Hero() {
  const t = useTranslations("hero");
  const tc = useTranslations("constellation");
  const locale = useLocale() as "pt" | "en";
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const [probeX, setProbeX] = useState(0.5);
  const [probeY, setProbeY] = useState(0.5);
  const [fieldActive, setFieldActive] = useState(false);
  const [hoveredLetter, setHoveredLetter] = useState<number | null>(null);
  const [seqProgress, setSeqProgress] = useState(0);
  const [synced, setSynced] = useState(false);

  const harmonics = useMemo(
    () => [
      {
        label: t("layerExperience"),
        value: t("expValue", { years: profile.yearsExperience }),
        scan: t("scanYears"),
      },
      {
        label: profile.topStack[0],
        value: profile.topStack[0],
        scan: t("scanStack"),
      },
      {
        label: profile.topStack[1],
        value: profile.topStack[1],
        scan: t("scanStack"),
      },
      {
        label: profile.topStack[2],
        value: profile.topStack[2],
        scan: t("scanStack"),
      },
      {
        label: profile.topStack[3],
        value: profile.topStack[3],
        scan: t("scanStack"),
      },
      {
        label: profile.topStack[4],
        value: profile.topStack[4],
        scan: t("scanStack"),
      },
    ],
    [t],
  );

  const scanZones = useMemo(
    () => [
      { value: profile.title[locale], scan: t("scanRole") },
      { value: profile.availability[locale], scan: t("scanStatus") },
      { value: profile.location[locale], scan: t("scanLocation") },
      { value: profile.languages[locale], scan: t("scanLanguages") },
    ],
    [locale, t],
  );

  const nodes = useMemo(
    () =>
      HARMONIC_X.map((rx, i) => ({
        x: rx * FIELD_WIDTH,
        y: waveY(rx * FIELD_WIDTH, probeX, synced),
        index: i,
      })),
    [probeX, synced],
  );

  const wavePath = useMemo(
    () => buildWavePath(probeX, synced),
    [probeX, synced],
  );

  const activeHarmonic =
    hoveredLetter !== null ? harmonics[getHarmonicIndex(hoveredLetter)] : null;

  const scanIndex = Math.min(
    scanZones.length - 1,
    Math.floor(probeX * scanZones.length),
  );
  const scanReadout = scanZones[scanIndex];

  const handleFieldMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      setProbeX(Math.max(0.04, Math.min(0.96, x)));
      setProbeY(Math.max(0.05, Math.min(0.95, y)));
      setFieldActive(true);
    },
    [],
  );

  const handleLetterEnter = (index: number) => {
    setHoveredLetter(index);
    if (synced) return;

    if (index === seqProgress) {
      const next = seqProgress + 1;
      if (next === INTERACTIVE_LETTERS.length) {
        setSynced(true);
        setSeqProgress(next);
      } else {
        setSeqProgress(next);
      }
    } else {
      setSeqProgress(index === 0 ? 1 : 0);
    }
  };


  return (
    <section
      ref={sectionRef}
      className={`hero-field portfolio-hero relative flex w-full items-center overflow-hidden ${synced ? "hero-field-synced" : ""}`}
      onMouseMove={handleFieldMove}
      onMouseLeave={() => {
        setFieldActive(false);
        setHoveredLetter(null);
      }}
    >
      <div className="hero-field-ambient pointer-events-none absolute inset-0" aria-hidden>
        <svg
          viewBox={`0 0 ${FIELD_WIDTH} ${FIELD_HEIGHT}`}
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="hero-wave-glow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0" />
              <stop
                offset={`${probeX * 100}%`}
                stopColor="var(--accent-primary)"
                stopOpacity={synced ? 0.4 : 0.35}
              />
              <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d={wavePath}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="1.2"
            opacity="0.25"
          />
          <motion.path
            d={wavePath}
            fill="none"
            stroke="url(#hero-wave-glow)"
            strokeWidth={synced ? 1.4 : 1.6}
            strokeLinecap="round"
            animate={{ pathLength: 1 }}
            initial={reducedMotion ? undefined : { pathLength: 0.15 }}
            transition={{ duration: synced ? 0.6 : 1.4, ease: [0.22, 1, 0.36, 1] }}
            className={synced ? undefined : "hero-field-wave-breathe"}
          />

          {nodes.map((node) => {
            const lit =
              hoveredLetter === node.index ||
              (!synced && seqProgress > node.index);
            const isHovered = hoveredLetter === node.index;
            return (
              <g key={node.index}>
                {isHovered && !synced && !reducedMotion && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="14"
                    fill="var(--accent-primary)"
                    opacity="0.06"
                    className="hero-field-node-glow"
                  />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 4.5 : lit ? 4 : 3}
                  fill="var(--accent-primary)"
                  fillOpacity={
                    synced ? 0.35 : isHovered ? 0.9 : lit ? 0.55 : 0.15
                  }
                />
              </g>
            );
          })}

          {hoveredLetter !== null &&
            nodes.map((node) => {
              if (node.index !== getHarmonicIndex(hoveredLetter)) return null;
              const letterX =
                100 +
                (node.index / Math.max(INTERACTIVE_LETTERS.length - 1, 1)) * 220;
              const letterY = FIELD_HEIGHT * 0.5;
              return (
                <motion.line
                  key={`link-${node.index}`}
                  x1={letterX}
                  y1={letterY}
                  x2={node.x}
                  y2={node.y}
                  stroke="var(--accent-primary)"
                  strokeWidth="0.5"
                  strokeOpacity="0.4"
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                />
              );
            })}
        </svg>
      </div>

      {!reducedMotion && fieldActive && !synced && (
        <div
          className="hero-field-scan pointer-events-none absolute bottom-0 top-0 w-px"
          style={{ left: `${probeX * 100}%` }}
        />
      )}

      <AnimatePresence>
        {fieldActive && !synced && hoveredLetter === null && (
          <motion.div
            key="probe"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="hero-field-probe pointer-events-none absolute z-20 hidden md:block"
            style={{
              left: `calc(${probeX * 100}% + 14px)`,
              top: `calc(${probeY * 100}% - 8px)`,
            }}
          >
            <span className="mt-0.5 block max-w-[200px] truncate font-[family-name:var(--font-mono)] text-[11px] text-[var(--accent-primary)]/75">
              {scanReadout.value}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hero-layout relative z-10 mx-auto grid w-full items-center px-6">
        <div className="max-w-xl">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="hero-eyebrow">
              {profile.title[locale]}
            </p>

            <p className="hero-intro">{t("intro")}</p>
            <h1
              className="hero-name hero-display"
              aria-label={profile.name}
            >
              {NAME_SEGMENTS.map((segment) => {
                if (segment.type === "space") {
                  return (
                    <span
                      key={segment.key}
                      className="hero-field-space"
                      aria-hidden
                    />
                  );
                }

                const { char, index } = segment;
                const active = hoveredLetter === index;
                const isNext =
                  !synced &&
                  seqProgress === index &&
                  hoveredLetter !== index;
                const isDone = !synced && seqProgress > index;

                return (
                  <span
                    key={segment.key}
                    role="button"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleLetterEnter(index);
                      }
                    }}
                    aria-label={harmonics[getHarmonicIndex(index)].label}
                    onMouseEnter={() => handleLetterEnter(index)}
                    onMouseLeave={() => setHoveredLetter(null)}
                    onFocus={() => handleLetterEnter(index)}
                    onBlur={() => setHoveredLetter(null)}
                    tabIndex={0}
                    className={`hero-field-letter outline-none ${active ? "is-active" : ""} ${isNext ? "is-next" : ""} ${isDone ? "is-done" : ""} ${synced ? "is-synced" : ""}`}
                  >
                    {char}
                  </span>
                );
              })}
            </h1>

            <p className="hero-statement">{t("statement")} <span>{t("statementAccent")}</span></p>

            {!synced && (
              <div className="hero-letter-track mt-4" aria-hidden>
                {INTERACTIVE_LETTERS.map((_, index) => {
                  const done = seqProgress > index;
                  const next = seqProgress === index;
                  return (
                    <span
                      key={`track-${index}`}
                      className={`hero-letter-track-dot ${done ? "is-done" : ""} ${next ? "is-next" : ""}`}
                    />
                  );
                })}
              </div>
            )}

            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mt-5 max-w-md text-base leading-relaxed text-[var(--text-muted)]"
            >
              {profile.summary[locale]}
            </motion.p>

            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="mt-10"
            >
              <a href="#projects" className="hero-hud-cta hero-primary group">
                <span className="hero-hud-cta-corners" aria-hidden />
                <span className="hero-hud-cta-prefix">01</span>
                <span className="hero-hud-cta-label">{t("ctaPrimary")}</span>
                <span className="hero-hud-cta-arrow" aria-hidden>
                  →
                </span>
              </a>

              <nav
                className="hero-hud-actions mt-4 flex flex-wrap items-center gap-2"
                aria-label={t("quickLinks")}
              >
                <a
                  href="/resume.pdf"
                  download
                  className="hero-hud-btn-secondary"
                >
                  {t("downloadCv")}
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-hud-btn-secondary"
                >
                  GitHub
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-hud-btn-secondary"
                >
                  LinkedIn
                </a>
              </nav>
            </motion.div>
          </motion.div>
        </div>

        <div className="hero-art-panel">
          <div className="hero-art-meta" aria-hidden><span>KC / SIGNAL CORE</span><span>001 — ∞</span></div>
          <div className="hero-sigil" aria-hidden>
            <svg viewBox="0 0 440 440" fill="none">
              <defs><linearGradient id="sigil-green" x1="80" y1="60" x2="360" y2="380" gradientUnits="userSpaceOnUse"><stop stopColor="#ccf4c0"/><stop offset=".5" stopColor="#6ec492"/><stop offset="1" stopColor="#28543b"/></linearGradient></defs>
              <g className="sigil-orbit"><circle cx="220" cy="220" r="192" stroke="currentColor" strokeOpacity=".2" strokeDasharray="2 9"/><path d="M220 16V40M220 400V424M16 220H40M400 220H424" stroke="currentColor" strokeOpacity=".6"/></g>
              <circle cx="220" cy="220" r="163" stroke="currentColor" strokeOpacity=".15"/>
              <path d="M107 299V141L151 115L220 222L289 115L333 141V299L290 325V197L220 298L150 197V325Z" fill="url(#sigil-green)" fillOpacity=".12" stroke="url(#sigil-green)" strokeWidth="1.5"/>
              <path d="M107 141L150 167L220 274L290 167L333 141M150 167V325M290 167V325M220 222V274" stroke="url(#sigil-green)" strokeOpacity=".7"/>
              <path d="M64 110V64H110M330 64H376V110M376 330V376H330M110 376H64V330" stroke="currentColor" strokeOpacity=".35"/>
              <circle cx="220" cy="58" r="3" fill="currentColor"/><circle cx="382" cy="220" r="3" fill="currentColor"/>
            </svg>
            <span className="sigil-caption">BUILD · REFINE · REPEAT</span>
          </div>
          <div className="hero-art-readout">
          <span className="hero-status-dot" aria-hidden />
          <AnimatePresence mode="wait">
            {synced ? (
              <motion.div
                key="synced-layer"
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-sm space-y-4 lg:ml-auto"
              >
                <p className="font-[family-name:var(--font-display)] text-xl font-medium leading-snug text-[var(--accent-primary)] md:text-2xl">
                  {profile.availability[locale]}
                </p>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]/70">
                  {profile.languages[locale]}
                </p>
                <p className="font-[family-name:var(--font-mono)] text-xs leading-relaxed text-[var(--text-muted)]/45">
                  {profile.topStack.join(" · ")}
                </p>
                <p className="border-t border-[var(--border-subtle)]/30 pt-4 font-[family-name:var(--font-serif)] text-sm italic leading-relaxed text-[var(--accent-primary)]/60">
                  {tc("revealed")}
                </p>
              </motion.div>
            ) : activeHarmonic && hoveredLetter !== null ? (
              <motion.div
                key={`node-readout-${hoveredLetter}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="hero-field-readout lg:ml-auto lg:text-right"
              >
                <p className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-none text-[var(--text-primary)]">
                  {activeHarmonic.value}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-xs lg:ml-auto lg:text-right"
              >
                <p className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--accent-primary)]/90 md:text-xl">
                  {profile.availability[locale]}
                </p>
                <p className="mt-1.5 text-sm text-[var(--text-muted)]/45">
                  {profile.location[locale]}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
        <div className="hero-bottom"><span>{profile.location[locale]}</span><span>{profile.topStack.slice(0, 3).join(" / ")}</span><a href="#projects">{t("explore")} <span aria-hidden>↓</span></a></div>
      </div>
    </section>
  );
}
