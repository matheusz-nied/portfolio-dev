"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

const AUTO_INTERVAL_MS = 3800;

/** Evenly spread sectors on the upper arc of the wide ellipse. */
function getSectorAngles(ids: string[]): Record<string, number> {
  if (ids.length === 0) return {};
  if (ids.length === 1) return { [ids[0]]: 90 };

  const startAngle = 198;
  const endAngle = -8;
  const step = (startAngle - endAngle) / (ids.length - 1);

  return Object.fromEntries(
    ids.map((id, i) => [id, startAngle - i * step]),
  );
}

function labelAnchor(labelX: number, cx: number): "start" | "middle" | "end" {
  const delta = labelX - cx;
  if (delta < -24) return "end";
  if (delta > 24) return "start";
  return "middle";
}

function labelOffset(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const nx = Math.cos(rad);
  const ny = Math.sin(rad);
  return {
    dx: nx * 10,
    dy: ny * 6,
  };
}

interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

interface SkillOrbitProps {
  groups: SkillGroup[];
  coreLabel: string;
  autoHint: string;
  clickHint: string;
  mapPrompt: string;
  sectorLabel: string;
}

function polarToEllipse(
  angleDeg: number,
  rx: number,
  ry: number,
  cx: number,
  cy: number,
) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + rx * Math.cos(rad),
    y: cy + ry * Math.sin(rad),
  };
}

export function SkillOrbit({
  groups,
  coreLabel,
  autoHint,
  clickHint,
  mapPrompt,
  sectorLabel,
}: SkillOrbitProps) {
  const t = useTranslations("skills");
  const prefersReducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(groups[0]?.id ?? null);
  const [userInteracted, setUserInteracted] = useState(false);

  const sectorAngles = useMemo(
    () => getSectorAngles(groups.map((g) => g.id)),
    [groups],
  );

  const active = groups.find((g) => g.id === activeId);
  const activeIndex = groups.findIndex((g) => g.id === activeId);

  const selectSector = useCallback((id: string) => {
    setActiveId(id);
    setUserInteracted(true);
  }, []);

  useEffect(() => {
    if (userInteracted || prefersReducedMotion || groups.length < 2) return;

    const timer = setInterval(() => {
      setActiveId((current) => {
        const idx = groups.findIndex((g) => g.id === current);
        const next = (idx + 1) % groups.length;
        return groups[next].id;
      });
    }, AUTO_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [userInteracted, prefersReducedMotion, groups]);

  const cx = 260;
  const cy = 168;
  const orbitRx = 172;
  const orbitRy = 96;
  const labelRx = 218;
  const labelRy = 118;

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--accent-primary)]">
          <span className="text-[var(--text-muted)]">$</span> {mapPrompt}
        </p>
        <div className="flex items-center gap-2 text-center">
          {!userInteracted ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-primary)] opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-primary)]" />
              </span>
              <p className="text-xs text-[var(--text-muted)]">{autoHint}</p>
            </>
          ) : (
            <p className="text-xs text-[var(--text-muted)]/70">{clickHint}</p>
          )}
        </div>
      </div>

      <div className="mt-6 grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10 xl:gap-14">
        {/* Radar map — wide horizontal */}
        <div className="relative min-h-[260px] w-full sm:min-h-[300px] lg:min-h-[340px]">
          {!prefersReducedMotion && (
            <div className="skill-radar-sweep pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-sm opacity-40" />
          )}

          <svg
            viewBox="0 0 520 300"
            className="h-full w-full"
            role="img"
            aria-label="Skill sectors map"
            preserveAspectRatio="xMidYMid meet"
          >
            {[0.42, 0.68, 1].map((scale, i) => (
              <ellipse
                key={i}
                cx={cx}
                cy={cy}
                rx={orbitRx * scale}
                ry={orbitRy * scale}
                fill="none"
                stroke="var(--border-subtle)"
                strokeWidth={1}
                strokeDasharray={i === 2 ? "none" : "4 8"}
                opacity={0.45 - i * 0.08}
              />
            ))}

            <line
              x1={cx - orbitRx - 24}
              y1={cy}
              x2={cx + orbitRx + 24}
              y2={cy}
              stroke="var(--border-subtle)"
              strokeWidth={0.5}
              opacity={0.35}
            />
            <line
              x1={cx}
              y1={cy - orbitRy - 16}
              x2={cx}
              y2={cy + orbitRy + 16}
              stroke="var(--border-subtle)"
              strokeWidth={0.5}
              opacity={0.25}
            />

            {groups.map((group) => {
              const angle = sectorAngles[group.id] ?? 0;
              const node = polarToEllipse(angle, orbitRx, orbitRy, cx, cy);
              const isActive = group.id === activeId;

              return (
                <line
                  key={`spoke-${group.id}`}
                  x1={cx}
                  y1={cy}
                  x2={node.x}
                  y2={node.y}
                  stroke="var(--accent-primary)"
                  strokeWidth={isActive ? 1.5 : 0.5}
                  strokeOpacity={isActive ? 0.55 : 0.1}
                  className="transition-all duration-500"
                />
              );
            })}

            {active &&
              active.items.map((skill, i) => {
                const baseAngle = sectorAngles[active.id] ?? 0;
                const spread = 28;
                const offset =
                  active.items.length === 1
                    ? 0
                    : (i / (active.items.length - 1) - 0.5) * spread;
                const angle = baseAngle + offset;
                const dot = polarToEllipse(
                  angle,
                  orbitRx * 0.62,
                  orbitRy * 0.62,
                  cx,
                  cy,
                );

                return (
                  <motion.circle
                    key={`${active.id}-${skill}`}
                    cx={dot.x}
                    cy={dot.y}
                    r={3}
                    fill="var(--accent-primary)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.75, scale: 1 }}
                    transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  />
                );
              })}

            <ellipse
              cx={cx}
              cy={cy}
              rx={34}
              ry={28}
              fill="var(--bg-surface)"
              stroke="var(--accent-primary)"
              strokeWidth={1}
              strokeOpacity={0.35}
            />
            <text
              x={cx}
              y={cy + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--text-muted)"
              fontSize={8}
              fontFamily="var(--font-geist-mono), monospace"
              letterSpacing="0.1em"
            >
              {coreLabel.toUpperCase()}
            </text>

            {groups.map((group, i) => {
              const angle = sectorAngles[group.id] ?? 0;
              const node = polarToEllipse(angle, orbitRx, orbitRy, cx, cy);
              const label = polarToEllipse(angle, labelRx, labelRy, cx, cy);
              const anchor = labelAnchor(label.x, cx);
              const nudge = labelOffset(angle);
              const isActive = group.id === activeId;
              const isNext =
                !userInteracted &&
                !prefersReducedMotion &&
                i === (activeIndex + 1) % groups.length;

              return (
                <g
                  key={group.id}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  aria-label={group.category}
                  onClick={() => selectSector(group.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      selectSector(group.id);
                    }
                  }}
                >
                  {!isActive && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={12}
                      fill="none"
                      stroke="var(--accent-primary)"
                      strokeWidth={1}
                      className={isNext ? "skill-node-pulse-next" : "skill-node-pulse"}
                    />
                  )}

                  {isActive && (
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={20}
                      fill="none"
                      stroke="var(--accent-primary)"
                      strokeWidth={1}
                      strokeOpacity={0.35}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={isActive ? 10 : 7}
                    fill={isActive ? "var(--accent-primary)" : "var(--bg-surface)"}
                    stroke="var(--accent-primary)"
                    strokeWidth={1.5}
                    strokeOpacity={isActive ? 0.9 : 0.45}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.92 }}
                  />

                  <text
                    x={label.x + nudge.dx}
                    y={label.y + nudge.dy}
                    textAnchor={anchor}
                    dominantBaseline="middle"
                    fill={isActive ? "var(--accent-primary)" : "var(--text-muted)"}
                    fontSize={10}
                    fontFamily="var(--font-geist-sans), system-ui"
                    fontWeight={isActive ? 500 : 400}
                    className="pointer-events-none select-none"
                    style={
                      isActive
                        ? undefined
                        : {
                            textDecoration: "underline",
                            textDecorationStyle: "dotted",
                            textDecorationColor: "var(--accent-primary)",
                          }
                    }
                    opacity={isActive ? 1 : 0.85}
                  >
                    {group.category}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Sector readout — terminal panel */}
        <div className="flex min-h-[260px] flex-col border-y border-[var(--border-subtle)] lg:min-h-[340px]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-1 py-3">
            <div className="flex flex-wrap gap-1.5">
              {groups.map((group, i) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => selectSector(group.id)}
                  className={`rounded-sm border px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider transition-colors ${
                    group.id === activeId
                      ? "border-[var(--accent-primary)]/45 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                      : "border-[var(--border-subtle)] text-[var(--text-muted)]/55 hover:border-[var(--accent-primary)]/25 hover:text-[var(--text-muted)]"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
            {active && (
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-muted)]/45">
                {String(activeIndex + 1).padStart(2, "0")}/{String(groups.length).padStart(2, "0")}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-1 flex-col px-1 py-5"
              >
                <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--text-muted)]/50">
                  {sectorLabel} :: {active.id}
                </p>
                <p className="mt-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-muted)]/40">
                  {t("loadLabel", { sector: active.id })}
                </p>

                <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-medium tracking-wide text-[var(--accent-primary)] sm:text-xl">
                    {active.category}
                  </h3>
                  <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--text-muted)]">
                    {t("modulesLabel", { count: active.items.length })}
                  </span>
                </div>

                <ul className="mt-6 flex flex-1 flex-wrap content-start gap-2">
                  {active.items.map((skill, i) => (
                    <motion.li
                      key={skill}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className="skill-module-chip inline-block border border-[var(--border-subtle)] bg-[var(--bg-card)]/50 px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)]/35 hover:text-[var(--accent-primary)]">
                        {skill}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <div className="h-px w-full overflow-hidden bg-[var(--border-subtle)]/50">
                    <motion.span
                      key={active.id}
                      className="skill-panel-beam block h-full w-1/3 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "400%" }}
                      transition={{
                        duration: 1.8,
                        ease: "easeInOut",
                        repeat: prefersReducedMotion ? 0 : Infinity,
                        repeatDelay: 0.6,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
