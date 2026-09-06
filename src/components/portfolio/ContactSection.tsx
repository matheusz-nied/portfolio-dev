"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, type MouseEvent } from "react";
import profile from "../../../content/portfolio/profile.json";

type ChannelKey = "email" | "whatsapp" | "github" | "linkedin" | "schedule";

type Channel = {
  labelKey: ChannelKey;
  value: string;
  href: string;
  external: boolean;
  copyValue?: string;
};

const CHANNELS: Channel[] = [
  {
    labelKey: "email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    external: false,
    copyValue: profile.email,
  },
  {
    labelKey: "whatsapp",
    value: profile.whatsapp,
    href: `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`,
    external: true,
    copyValue: profile.whatsapp,
  },
  {
    labelKey: "github",
    value: profile.github.replace("https://github.com/", ""),
    href: profile.github,
    external: true,
  },
  {
    labelKey: "linkedin",
    value: profile.linkedin.replace("https://linkedin.com", ""),
    href: profile.linkedin,
    external: true,
  },
  ...(profile.meetingLink
    ? [
        {
          labelKey: "schedule" as const,
          value: profile.meetingLink.replace(/^https?:\/\//, ""),
          href: profile.meetingLink,
          external: true,
        },
      ]
    : []),
];

const BUS_WIDTH = 1000;
const NODE_X = CHANNELS.map((_, i) => (i + 0.5) / CHANNELS.length);
const desktopGridColumns = CHANNELS.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4";

export function ContactSection() {
  const t = useTranslations("contact");
  const locale = useLocale() as "pt" | "en";
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [copiedId, setCopiedId] = useState<ChannelKey | null>(null);

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

  useEffect(() => {
    if (!copiedId) return;
    const timer = window.setTimeout(() => setCopiedId(null), 1600);
    return () => window.clearTimeout(timer);
  }, [copiedId]);

  const handleEnter = (index: number) => {
    setPaused(true);
    setActive(index);
  };

  const handleLeave = () => {
    setPaused(false);
    setActive(null);
  };

  const handleCopy = async (event: MouseEvent, channel: Channel) => {
    if (!channel.copyValue) return;
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(channel.copyValue);
      setCopiedId(channel.labelKey);
    } catch {
      // Clipboard API unavailable (unsupported browser/context) — the
      // channel link itself (mailto:/wa.me) remains a working fallback.
    }
  };

  return (
    <section id="contact" className="px-6 py-14 pb-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">{t("title")}</h2>
            <p className="section-subtitle">{t("subtitle")}</p>
          </div>
          <p className="hud-label">
            <span className="inline-flex items-center gap-1.5 text-[var(--accent-primary)]">
              {!reducedMotion && (
                <span className="contact-sync-dot h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
              )}
              {t("syncTag")}
            </span>
            <span className="mx-2 text-[var(--text-muted)]/30">|</span>
            {location}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="contact-bus content-panel relative mt-8 overflow-hidden"
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
                    key={CHANNELS[index].labelKey}
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

          <div className={`contact-bus-grid relative grid grid-cols-2 gap-px border-t border-[var(--border-subtle)]/40 bg-[var(--border-subtle)]/30 ${desktopGridColumns}`}>
            {CHANNELS.map((channel, index) => {
              const isCopied = copiedId === channel.labelKey;
              return (
                <motion.div
                  key={channel.labelKey}
                  onMouseEnter={() => handleEnter(index)}
                  onMouseLeave={handleLeave}
                  className={`contact-bus-node group relative bg-[var(--bg-space)] ${active === index ? "is-active" : ""}`}
                >
                  <a
                    href={channel.href}
                    aria-label={t("openChannel", { channel: t(channel.labelKey) })}
                    {...(channel.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    onFocus={() => handleEnter(index)}
                    onBlur={handleLeave}
                    className="absolute inset-0 cursor-pointer"
                  />
                  <div className="pointer-events-none flex items-center justify-between gap-2">
                    <span className="hud-label transition-colors group-hover:text-[var(--accent-primary)]">
                      {t(channel.labelKey)}
                    </span>
                    <span className="flex items-center gap-2">
                      {channel.copyValue && (
                        <button
                          type="button"
                          onClick={(event) => handleCopy(event, channel)}
                          aria-label={t("copyValue", { channel: t(channel.labelKey) })}
                          className="pointer-events-auto relative z-10 hud-label shrink-0 transition-colors hover:text-[var(--accent-primary)]"
                        >
                          {isCopied ? t("copied") : t("copy")}
                        </button>
                      )}
                      <span className="contact-bus-open shrink-0 hud-label">
                        {t("openLabel")}
                        <span aria-hidden>{channel.external ? " ↗" : " →"}</span>
                      </span>
                    </span>
                  </div>
                  <span className="contact-bus-value glitch-hover pointer-events-none mt-1.5 block truncate text-sm font-medium text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]">
                    {channel.value}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <p className="border-t border-[var(--border-subtle)]/35 px-4 py-2.5 hud-label">
            <span className="text-[var(--accent-highlight)]/85">{availability}</span>
            <span className="mx-2 opacity-30">·</span>
            {t("nodesConnected", { count: CHANNELS.length })}
            <span className="mx-2 opacity-30">·</span>
            <span className="text-[var(--text-muted)]/80">{t("selectHint")}</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
