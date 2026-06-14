"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import profile from "../../../content/portfolio/profile.json";

const CHANNELS = [
  {
    id: "email",
    labelKey: "email" as const,
    value: profile.email,
    href: `mailto:${profile.email}`,
    external: false,
  },
  {
    id: "whatsapp",
    labelKey: "whatsapp" as const,
    value: profile.whatsapp,
    href: `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`,
    external: true,
  },
  {
    id: "github",
    labelKey: "github" as const,
    value: profile.github.replace("https://github.com/", ""),
    href: profile.github,
    external: true,
  },
  {
    id: "linkedin",
    labelKey: "linkedin" as const,
    value: profile.linkedin.replace("https://linkedin.com", ""),
    href: profile.linkedin,
    external: true,
  },
] as const;

const BUS_WIDTH = 1000;
const NODE_X = [0.125, 0.375, 0.625, 0.875];

export function ContactSection() {
  const t = useTranslations("contact");
  const locale = useLocale() as "pt" | "en";
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  const availability = profile.availability[locale];
  const location = profile.location[locale];

  useEffect(() => {
    if (reducedMotion || paused) return;
    const timer = window.setInterval(() => {
      setActive((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % CHANNELS.length;
      });
    }, 2200);
    return () => window.clearInterval(timer);
  }, [reducedMotion, paused]);

  const handleEnter = (index: number) => {
    setPaused(true);
    setActive(index);
  };

  const handleLeave = () => {
    setPaused(false);
    setActive(null);
  };

  return (
    <section id="contact" className="px-6 py-14 pb-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">{t("title")}</h2>
            <p className="mt-2 max-w-lg text-sm text-[var(--text-muted)]">{t("subtitle")}</p>
          </div>
          <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]/45">
            <span className="inline-flex items-center gap-1.5 text-[var(--accent-primary)]/80">
              {!reducedMotion && (
                <span className="contact-sync-dot h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
              )}
              {t("syncTag")}
            </span>
            <span className="mx-2 text-[var(--text-muted)]/20">|</span>
            {location}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="contact-bus relative mt-8 overflow-hidden border border-[var(--border-subtle)]/60 bg-[var(--bg-card)]/20"
        >
          <div className="contact-bus-scanlines pointer-events-none absolute inset-0" aria-hidden />
          {!reducedMotion && <div className="contact-bus-sweep pointer-events-none absolute inset-y-0 w-24" aria-hidden />}

          <div className="relative px-3 pt-3 sm:px-4" aria-hidden>
            <svg viewBox={`0 0 ${BUS_WIDTH} 28`} className="h-7 w-full" preserveAspectRatio="none">
              <line
                x1="0"
                y1="14"
                x2={BUS_WIDTH}
                y2="14"
                stroke="var(--border-subtle)"
                strokeWidth="1"
                opacity="0.45"
              />
              <line
                x1="0"
                y1="14"
                x2={BUS_WIDTH}
                y2="14"
                stroke="var(--accent-primary)"
                strokeWidth="1"
                strokeOpacity={active !== null ? 0.45 : 0.18}
                className={!reducedMotion ? "contact-bus-line" : undefined}
              />
              {NODE_X.map((rx, index) => {
                const lit = active === index;
                return (
                  <circle
                    key={CHANNELS[index].id}
                    cx={rx * BUS_WIDTH}
                    cy="14"
                    r={lit ? 4 : 2.5}
                    fill="var(--accent-primary)"
                    fillOpacity={lit ? 0.95 : 0.3}
                  />
                );
              })}
              {active !== null && !reducedMotion && (
                <circle r="2" fill="var(--accent-primary)">
                  <animateMotion
                    dur="0.9s"
                    repeatCount="indefinite"
                    path={`M ${NODE_X[0] * BUS_WIDTH} 14 L ${NODE_X[CHANNELS.length - 1] * BUS_WIDTH} 14`}
                  />
                </circle>
              )}
            </svg>
          </div>

          <div className="contact-bus-grid relative grid grid-cols-2 border-t border-[var(--border-subtle)]/40 lg:grid-cols-4">
            {CHANNELS.map((channel, index) => (
              <motion.a
                key={channel.id}
                href={channel.href}
                aria-label={t("openChannel", { channel: t(channel.labelKey) })}
                {...(channel.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                onMouseEnter={() => handleEnter(index)}
                onMouseLeave={handleLeave}
                onFocus={() => handleEnter(index)}
                onBlur={handleLeave}
                className={`contact-bus-node group cursor-pointer ${active === index ? "is-active" : ""} ${index > 0 ? "border-[var(--border-subtle)]/40 lg:border-l" : ""} ${index % 2 === 1 ? "border-l" : ""} ${index >= 2 ? "border-t lg:border-t-0" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]/40 transition-colors group-hover:text-[var(--accent-primary)]/65">
                    {t(channel.labelKey)}
                  </span>
                  <span className="contact-bus-open shrink-0 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.12em]">
                    {t("openLabel")}
                    <span aria-hidden>{channel.external ? " ↗" : " →"}</span>
                  </span>
                </div>
                <span className="contact-bus-value glitch-hover mt-1.5 block truncate text-sm font-medium text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]">
                  {channel.value}
                </span>
              </motion.a>
            ))}
          </div>

          <p className="border-t border-[var(--border-subtle)]/35 px-4 py-2 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]/35">
            <span className="text-[var(--accent-primary)]/45">{availability}</span>
            <span className="mx-2 opacity-30">·</span>
            {t("nodesConnected", { count: CHANNELS.length })}
            <span className="mx-2 opacity-30">·</span>
            <span className="text-[var(--text-muted)]/50">{t("selectHint")}</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
