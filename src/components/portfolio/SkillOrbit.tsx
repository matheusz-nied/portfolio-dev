"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const SECTOR_ANGLES: Record<string, number> = {
  frontend: -90,
  backend: 0,
  data: 90,
  ai: 180,
};

const AUTO_INTERVAL_MS = 3500;

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
}

function polarToCartesian(angleDeg: number, radius: number, cx: number, cy: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

export function SkillOrbit({
  groups,
  coreLabel,
  autoHint,
  clickHint,
}: SkillOrbitProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(groups[0]?.id ?? null);
  const [userInteracted, setUserInteracted] = useState(false);

  const active = groups.find((g) => g.id === activeId);
  const activeIndex = groups.findIndex((g) => g.id === activeId);

  const selectSector = useCallback(
    (id: string) => {
      setActiveId(id);
      setUserInteracted(true);
    },
    [],
  );

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

  const cx = 200;
  const cy = 200;
  const orbitR = 118;
  const labelR = 152;

  return (
    <div className="mx-auto max-w-lg">
      {/* Status hint */}
      <div className="mb-4 flex items-center justify-center gap-2 text-center">
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

      <div className="relative mx-auto aspect-square w-full max-w-[360px]">
        <svg
          viewBox="0 0 400 400"
          className="h-full w-full"
          role="img"
          aria-label="Skill sectors map"
        >
          {[0.45, 0.72, 1].map((scale, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={orbitR * scale}
              fill="none"
              stroke="var(--border-subtle)"
              strokeWidth={1}
              strokeDasharray={i === 2 ? "none" : "4 8"}
              opacity={0.5 - i * 0.1}
            />
          ))}

          <line
            x1={cx}
            y1={cy - orbitR - 20}
            x2={cx}
            y2={cy + orbitR + 20}
            stroke="var(--border-subtle)"
            strokeWidth={0.5}
            opacity={0.35}
          />
          <line
            x1={cx - orbitR - 20}
            y1={cy}
            x2={cx + orbitR + 20}
            y2={cy}
            stroke="var(--border-subtle)"
            strokeWidth={0.5}
            opacity={0.35}
          />

          {groups.map((group) => {
            const angle = SECTOR_ANGLES[group.id] ?? 0;
            const node = polarToCartesian(angle, orbitR, cx, cy);
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
                opacity={isActive ? 0.5 : 0.12}
                className="transition-all duration-500"
              />
            );
          })}

          {active &&
            active.items.map((skill, i) => {
              const baseAngle = SECTOR_ANGLES[active.id] ?? 0;
              const spread = 36;
              const offset =
                active.items.length === 1
                  ? 0
                  : (i / (active.items.length - 1) - 0.5) * spread;
              const angle = baseAngle + offset;
              const dot = polarToCartesian(angle, orbitR * 0.72, cx, cy);

              return (
                <motion.circle
                  key={`${active.id}-${skill}`}
                  cx={dot.x}
                  cy={dot.y}
                  r={3}
                  fill="var(--accent-primary)"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.7, scale: 1 }}
                  transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                />
              );
            })}

          <circle
            cx={cx}
            cy={cy}
            r={28}
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
            fontSize={9}
            fontFamily="var(--font-geist-mono), monospace"
            letterSpacing="0.08em"
          >
            {coreLabel.toUpperCase()}
          </text>

          {groups.map((group, i) => {
            const angle = SECTOR_ANGLES[group.id] ?? 0;
            const node = polarToCartesian(angle, orbitR, cx, cy);
            const label = polarToCartesian(angle, labelR, cx, cy);
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
                {/* Pulse ring on inactive nodes — click affordance */}
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
                    r={18}
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth={1}
                    strokeOpacity={0.3}
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
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isActive ? "var(--accent-primary)" : "var(--text-muted)"}
                  fontSize={11}
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

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-5 py-4"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-[family-name:var(--font-display)] text-sm font-medium tracking-wide text-[var(--accent-primary)]">
                {active.category}
              </h3>
              <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--text-muted)]">
                {String(active.items.length).padStart(2, "0")} modules
              </span>
            </div>
            <p className="mt-3 font-[family-name:var(--font-mono)] text-sm leading-relaxed text-[var(--text-muted)]">
              {active.items.map((skill, i) => (
                <span key={skill}>
                  {i > 0 && (
                    <span className="mx-2 text-[var(--border-subtle)]">/</span>
                  )}
                  <span className="text-[var(--text-primary)]">{skill}</span>
                </span>
              ))}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex flex-wrap justify-center gap-2 md:hidden">
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => selectSector(group.id)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              group.id === activeId
                ? "border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                : "border-[var(--border-subtle)] text-[var(--text-muted)]"
            }`}
          >
            {group.category}
          </button>
        ))}
      </div>
    </div>
  );
}
