"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import type { getExperience } from "@/lib/portfolio";

export const RECENT_EXPERIENCE_COUNT = 5;

type ExperienceItem = ReturnType<typeof getExperience>[number];

interface ExperienceLogProps {
  items: ExperienceItem[];
  presentLabel: string;
  logPrompt: string;
  archiveCount: string;
  liveLabel: string;
  scanHint: string;
  lockedHint: string;
  telemetryLock: string;
  telemetrySnr: string;
  telemetryCoords: string;
}

const AUTO_SCAN_MS = 4200;
const SCRAMBLE_CHARS = "█▓▒░01X?#@";

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function sectorCode(company: string) {
  const code = company.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 4);
  return `SEC-${code || "UNK"}`;
}

function pseudoCoords(company: string) {
  const hash = hashString(company);
  const lat = ((hash % 9000) / 100 - 45).toFixed(2);
  const lng = (((hash >> 8) % 36000) / 100 - 180).toFixed(2);
  return `${lat}°, ${lng}°`;
}

function snrForEntry(company: string, index: number, total: number) {
  const base = 68 + (total - index) * 6;
  return Math.min(99, base + (hashString(company) % 12));
}

function SignalBars({ strength, max = 5 }: { strength: number; max?: number }) {
  return (
    <span
      className="inline-flex items-end gap-0.5 align-middle"
      aria-hidden
      title={`Signal ${strength}/${max}`}
    >
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`w-1 rounded-sm transition-all duration-300 ${
            i < strength
              ? "bg-[var(--accent-primary)]"
              : "bg-[var(--border-subtle)]"
          }`}
          style={{ height: `${6 + i * 3}px` }}
        />
      ))}
    </span>
  );
}

function SignalWaveform({ active }: { active: boolean }) {
  return (
    <svg
      width={48}
      height={16}
      viewBox="0 0 48 16"
      className="shrink-0 opacity-70"
      aria-hidden
    >
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect
          key={i}
          x={i * 7}
          y={4}
          width={3}
          height={8}
          rx={1}
          fill="var(--accent-primary)"
          className={active ? "experience-wave-bar" : ""}
          style={{ animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </svg>
  );
}

function ScrambleText({
  text,
  active,
  reducedMotion,
}: {
  text: string;
  active: boolean;
  reducedMotion: boolean | null;
}) {
  const [display, setDisplay] = useState(text);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!active || reducedMotion || doneRef.current) {
      setDisplay(text);
      return;
    }

    doneRef.current = true;
    let frame = 0;
    const totalFrames = 18;

    const timer = setInterval(() => {
      frame += 1;
      if (frame >= totalFrames) {
        setDisplay(text);
        clearInterval(timer);
        return;
      }

      const progress = frame / totalFrames;
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i / text.length < progress) return char;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join(""),
      );
    }, 45);

    return () => clearInterval(timer);
  }, [active, reducedMotion, text]);

  return <>{display}</>;
}

function HighlightLine({
  line,
  index,
  active,
  reducedMotion,
}: {
  line: string;
  index: number;
  active: boolean;
  reducedMotion: boolean | null;
}) {
  return (
    <motion.li
      initial={reducedMotion ? false : { opacity: 0, x: 6 }}
      animate={
        reducedMotion
          ? undefined
          : active
            ? { opacity: 1, x: 0 }
            : { opacity: 0.55, x: 0 }
      }
      whileInView={{ opacity: active ? 1 : 0.55, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: active ? 0.05 + index * 0.06 : 0, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-2 text-sm leading-relaxed transition-colors duration-300 ${
        active ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
      }`}
    >
      <span
        className={`shrink-0 font-[family-name:var(--font-mono)] transition-colors ${
          active ? "text-[var(--accent-primary)]" : "text-[var(--accent-primary)]/35"
        }`}
      >
        &gt;
      </span>
      {line}
    </motion.li>
  );
}

function LogEntry({
  item,
  presentLabel,
  liveLabel,
  index,
  totalRecent,
  active,
  faded = false,
  reducedMotion,
  onFocus,
}: {
  item: ExperienceItem;
  presentLabel: string;
  liveLabel: string;
  index: number;
  totalRecent: number;
  active: boolean;
  faded?: boolean;
  reducedMotion: boolean | null;
  onFocus: () => void;
}) {
  const isCurrent = item.period.end === null;
  const endLabel = item.period.end ?? presentLabel;
  const txId = `TX-${item.period.start}-${String(index + 1).padStart(2, "0")}`;
  const signal = Math.max(1, totalRecent - index);
  const sector = sectorCode(item.company);
  const durationYears =
    (item.period.end ? Number(item.period.end) : new Date().getFullYear()) -
    Number(item.period.start);

  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onFocus}
      onFocus={onFocus}
      tabIndex={0}
      className={`group relative outline-none transition-colors hover:bg-[var(--bg-card)]/40 focus-visible:bg-[var(--bg-card)]/40 ${
        faded ? "opacity-65" : ""
      } ${isCurrent ? "experience-entry-live" : ""} ${
        active ? "experience-entry-active" : ""
      }`}
    >
      {active && <span className="experience-lock-bracket experience-lock-bracket-tl" aria-hidden />}
      {active && <span className="experience-lock-bracket experience-lock-bracket-tr" aria-hidden />}
      {active && <span className="experience-lock-bracket experience-lock-bracket-bl" aria-hidden />}
      {active && <span className="experience-lock-bracket experience-lock-bracket-br" aria-hidden />}

      <div className="flex gap-5 py-8 sm:gap-8">
        <div className="relative z-10 w-12 shrink-0 text-right sm:w-14">
          <div
            className={`relative mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 sm:ml-auto sm:mr-0 ${
              active
                ? "border-[var(--accent-primary)]/50 bg-[var(--accent-primary)]/8 shadow-[0_0_20px_rgba(143,186,160,0.15)]"
                : "border-[var(--border-subtle)] bg-transparent"
            }`}
          >
            {active && (
              <span
                className="experience-year-ring pointer-events-none absolute inset-0 rounded-full border border-dashed border-[var(--accent-primary)]/30"
                aria-hidden
              />
            )}
            <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--accent-primary)]">
              {item.period.start.slice(-2)}
            </span>
          </div>
          <span className="mt-1 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
            {endLabel === presentLabel ? "···" : endLabel.slice(-2)}
          </span>
          <div className="mt-2 flex justify-end">
            <SignalBars strength={active ? signal : Math.max(1, signal - 1)} />
          </div>
        </div>

        <div className="relative z-10 min-w-0 flex-1 border-l border-[var(--border-subtle)] pl-5 sm:pl-6">
          <span
            className={`experience-node absolute -left-[4px] top-3 h-2 w-2 rounded-full border border-[var(--bg-space)] transition-all duration-300 ${
              active
                ? "experience-node-active scale-125 bg-[var(--accent-primary)] shadow-[0_0_14px_rgba(143,186,160,0.55)]"
                : "bg-[var(--accent-primary)]/50 shadow-[0_0_6px_rgba(143,186,160,0.2)]"
            }`}
          />

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            <span className={active ? "text-[var(--accent-primary)]" : "text-[var(--accent-primary)]/55"}>
              {txId}
            </span>
            <span>{sector}</span>
            <span className="text-[var(--text-muted)]/40">
              Δ {durationYears}y
            </span>
            {isCurrent && (
              <span className="inline-flex items-center gap-1.5 text-[var(--accent-primary)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-primary)] opacity-40" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
                </span>
                {liveLabel}
                <SignalWaveform active={active || isCurrent} />
              </span>
            )}
          </div>

          <p className="mt-2 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-muted)]/55">
            <span className="text-[var(--text-muted)]/35">[</span>
            {" SIG :: "}
            <span className={active ? "text-[var(--accent-primary)]/80" : ""}>{item.company}</span>
            {" · "}
            {item.period.start}—{endLabel}
            <span className="text-[var(--text-muted)]/35"> ]</span>
          </p>

          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="glitch-hover text-base font-medium text-[var(--text-primary)] sm:text-lg">
              {item.role}
            </h3>
            <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent-primary)]">
              @{item.company}
            </span>
          </div>

          <ul
            className={`mt-4 space-y-2 border-t border-dotted pt-4 transition-colors duration-300 ${
              active ? "border-[var(--accent-primary)]/25" : "border-[var(--border-subtle)]/80"
            }`}
          >
            {item.highlights.map((line, i) => (
              <HighlightLine
                key={line}
                line={line}
                index={i}
                active={active}
                reducedMotion={reducedMotion}
              />
            ))}
          </ul>
        </div>
      </div>
    </motion.li>
  );
}

function SignalSpine({ count, activeIndex }: { count: number; activeIndex: number }) {
  if (count < 2) return null;

  return (
    <svg
      className="pointer-events-none absolute bottom-8 left-[1.65rem] top-8 hidden w-px overflow-visible sm:left-[1.85rem] sm:block"
      width={2}
      height="100%"
      aria-hidden
    >
      <line
        x1={1}
        y1={0}
        x2={1}
        y2="100%"
        stroke="var(--accent-primary)"
        strokeWidth={1}
        strokeOpacity={0.08}
      />
      <line
        x1={1}
        y1={0}
        x2={1}
        y2="100%"
        stroke="var(--accent-primary)"
        strokeWidth={1}
        strokeOpacity={0.35}
        strokeDasharray="4 10"
        className="experience-spine-flow"
      />
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={1}
          cy={`${((i + 0.5) / count) * 100}%`}
          r={i === activeIndex ? 3.5 : 2}
          fill="var(--accent-primary)"
          fillOpacity={i === activeIndex ? 0.75 : 0.25}
          className={i === activeIndex ? "experience-spine-node-active" : ""}
        />
      ))}
    </svg>
  );
}

function TelemetryHud({
  item,
  index,
  total,
  lockLabel,
  snrLabel,
  coordsLabel,
  userLocked,
  scanHint,
  lockedHint,
}: {
  item: ExperienceItem;
  index: number;
  total: number;
  lockLabel: string;
  snrLabel: string;
  coordsLabel: string;
  userLocked: boolean;
  scanHint: string;
  lockedHint: string;
}) {
  const txId = `TX-${item.period.start}-${String(index + 1).padStart(2, "0")}`;
  const snr = snrForEntry(item.company, index, total);
  const coords = pseudoCoords(item.company);

  return (
    <div className="experience-telemetry mt-4 border border-[var(--border-subtle)]/60 bg-[var(--bg-card)]/20 px-3 py-2.5 sm:px-4">
      <div className="flex flex-wrap items-center justify-between gap-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[var(--text-muted)]">
          <span>
            <span className="text-[var(--text-muted)]/45">{lockLabel}</span>{" "}
            <span className="text-[var(--accent-primary)]">{txId}</span>
          </span>
          <span>
            <span className="text-[var(--text-muted)]/45">{snrLabel}</span>{" "}
            <span className="text-[var(--accent-primary)]">{snr}%</span>
          </span>
          <span className="hidden sm:inline">
            <span className="text-[var(--text-muted)]/45">{coordsLabel}</span>{" "}
            <span className="text-[var(--text-primary)]/70">{coords}</span>
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[var(--text-muted)]/50">
          {!userLocked ? (
            <>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-primary)] opacity-30" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]/70" />
              </span>
              {scanHint}
            </>
          ) : (
            <>
              <span className="text-[var(--accent-primary)]">◆</span>
              {lockedHint}
            </>
          )}
        </span>
      </div>
      <div className="experience-telemetry-scan mt-2 h-px w-full overflow-hidden bg-[var(--border-subtle)]/40">
        <span className="experience-telemetry-beam block h-full w-1/4 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent" />
      </div>
    </div>
  );
}

export function ExperienceLog({
  items,
  presentLabel,
  logPrompt,
  archiveCount,
  liveLabel,
  scanHint,
  lockedHint,
  telemetryLock,
  telemetrySnr,
  telemetryCoords,
}: ExperienceLogProps) {
  const t = useTranslations("experience");
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scanned, setScanned] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userLocked, setUserLocked] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const recent = items.slice(0, RECENT_EXPERIENCE_COUNT);
  const archived = items.slice(RECENT_EXPERIENCE_COUNT);
  const hasArchived = archived.length > 0;
  const activeItem = recent[activeIndex] ?? recent[0];

  const lockSignal = useCallback((index: number) => {
    setActiveIndex(index);
    setUserLocked(true);
  }, []);

  useEffect(() => {
    if (reducedMotion || scanned) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setScanned(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, scanned]);

  useEffect(() => {
    if (userLocked || reducedMotion || recent.length < 2) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % recent.length);
    }, AUTO_SCAN_MS);

    return () => clearInterval(timer);
  }, [userLocked, reducedMotion, recent.length]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--accent-primary)]">
          <span className="text-[var(--text-muted)]">$</span> {logPrompt}
        </p>
        <p className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-muted)]/50">
          {t("receivingLabel", { count: recent.length })}
        </p>
      </div>

      {activeItem && (
        <TelemetryHud
          item={activeItem}
          index={activeIndex}
          total={recent.length}
          lockLabel={telemetryLock}
          snrLabel={telemetrySnr}
          coordsLabel={telemetryCoords}
          userLocked={userLocked}
          scanHint={scanHint}
          lockedHint={lockedHint}
        />
      )}

      <div ref={containerRef} className="relative mt-3 overflow-hidden">
        {scanned && !reducedMotion && (
          <div className="experience-scan-line pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent" />
        )}

        <SignalSpine count={recent.length} activeIndex={activeIndex} />

        <ul className="relative divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
          {recent.map((item, i) => (
            <LogEntry
              key={item.id}
              item={item}
              presentLabel={presentLabel}
              liveLabel={liveLabel}
              index={i}
              totalRecent={recent.length}
              active={i === activeIndex}
              reducedMotion={reducedMotion}
              onFocus={() => lockSignal(i)}
            />
          ))}
        </ul>
      </div>

      {hasArchived && (
        <details
          className="experience-archive group mt-10"
          onToggle={(e) => setArchiveOpen((e.target as HTMLDetailsElement).open)}
        >
          <summary className="cursor-pointer list-none text-center [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs text-[var(--text-muted)]/45 transition-colors hover:text-[var(--accent-primary)]/70">
              <span className="text-[var(--text-muted)]">$</span>
              {t("archiveToggle", { count: archived.length })}
              <span className="inline-block transition-transform duration-300 group-open:rotate-180">
                ↓
              </span>
            </span>
          </summary>
          <div className="experience-archive-content mt-6 overflow-hidden">
            <p className="mb-4 text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--accent-primary)]/50">
              <ScrambleText
                text="// decrypting deep archive..."
                active={archiveOpen}
                reducedMotion={reducedMotion}
              />
            </p>
            <ul className="divide-y divide-[var(--border-subtle)]/50 border-y border-[var(--border-subtle)]/50">
              {archived.map((item, i) => (
                <LogEntry
                  key={item.id}
                  item={item}
                  presentLabel={presentLabel}
                  liveLabel={liveLabel}
                  index={i}
                  totalRecent={archived.length}
                  active={false}
                  faded
                  reducedMotion={reducedMotion}
                  onFocus={() => {}}
                />
              ))}
            </ul>
            <p className="mt-3 text-center font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-muted)]/35">
              {archiveCount}
            </p>
          </div>
        </details>
      )}
    </div>
  );
}
