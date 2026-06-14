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
const NAME_LETTERS = profile.name.split("");
const HARMONIC_X = [0.62, 0.68, 0.74, 0.8, 0.86, 0.92];

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
      { value: profile.title, scan: t("scanRole") },
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
    hoveredLetter !== null ? harmonics[hoveredLetter] : null;

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
      if (next === NAME_LETTERS.length) {
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
      className={`hero-field relative flex min-h-[88vh] w-full items-center overflow-hidden py-12 md:min-h-[90vh] ${synced ? "hero-field-synced" : ""}`}
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
              if (node.index !== hoveredLetter) return null;
              const letterX =
                100 +
                (node.index / Math.max(NAME_LETTERS.length - 1, 1)) * 220;
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
                  initial={{ opacity: 0 }}
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

      <div className="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-10 px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]/45">
              {profile.title}
            </p>

            <h1
              className="hero-name mt-3 font-[family-name:var(--font-display)] text-[clamp(3rem,9vw,5.25rem)] font-semibold leading-[0.88] tracking-tight"
              aria-label={profile.name}
            >
              {NAME_LETTERS.map((letter, index) => {
                const active = hoveredLetter === index;
                const isNext =
                  !synced &&
                  seqProgress === index &&
                  hoveredLetter !== index;
                const isDone = !synced && seqProgress > index;

                return (
                  <span
                    key={`${letter}-${index}`}
                    role="button"
                    aria-label={harmonics[index].label}
                    onMouseEnter={() => handleLetterEnter(index)}
                    onMouseLeave={() => setHoveredLetter(null)}
                    onFocus={() => handleLetterEnter(index)}
                    onBlur={() => setHoveredLetter(null)}
                    tabIndex={0}
                    className={`hero-field-letter outline-none ${active ? "is-active" : ""} ${isNext ? "is-next" : ""} ${isDone ? "is-done" : ""} ${synced ? "is-synced" : ""}`}
                  >
                    {letter}
                  </span>
                );
              })}
            </h1>

            {!synced && (
              <div className="hero-letter-track mt-4" aria-hidden>
                {NAME_LETTERS.map((_, index) => {
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mt-5 max-w-md text-base leading-relaxed text-[var(--text-muted)]"
            >
              {profile.summary[locale]}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="mt-10"
            >
              <a href="#projects" className="hero-hud-cta group inline-flex items-center gap-3">
                <span className="hero-hud-cta-bracket text-[var(--accent-primary)]/40" aria-hidden>
                  ⟨
                </span>
                <span className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.14em] text-[var(--accent-primary)] transition-colors group-hover:text-[var(--text-primary)]">
                  {t("ctaProjects")}
                </span>
                <span className="hero-hud-cta-bracket text-[var(--accent-primary)]/40" aria-hidden>
                  ⟩
                </span>
                <span className="text-[var(--accent-primary)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100">
                  →
                </span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        <div className="relative flex min-h-[220px] items-center lg:min-h-[320px]">
          <AnimatePresence mode="wait">
            {synced ? (
              <motion.div
                key="synced-layer"
                initial={{ opacity: 0, y: 8 }}
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
                initial={{ opacity: 0 }}
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
    </section>
  );
}
