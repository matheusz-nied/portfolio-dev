"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import profile from "../../../content/portfolio/profile.json";

type ChannelKey = "email" | "whatsapp" | "github" | "linkedin" | "schedule";

type ChannelIcon = ChannelKey;

type Channel = {
  labelKey: ChannelKey;
  /** Linha de contexto — nunca expõe e-mail ou telefone crus. */
  hint: string;
  href: string;
  external: boolean;
  copyValue: string;
  /** Rótulo acessível dedicado para a ação de copiar (ex.: link vs. e-mail). */
  copyAriaKey: "copyValue" | "copyLink";
  icon: ChannelIcon;
};

const GITHUB_HANDLE = profile.github.replace("https://github.com/", "").replace(/\/$/, "");
const LINKEDIN_HANDLE = profile.linkedin
  .replace(/^https?:\/\/(www\.)?linkedin\.com/, "")
  .replace(/^\//, "")
  .replace(/\/$/, "");
const WHATSAPP_DIGITS = profile.whatsapp.replace(/\D/g, "");

const CHANNELS: Channel[] = [
  {
    labelKey: "email",
    hint: "emailHint",
    href: `mailto:${profile.email}`,
    external: false,
    copyValue: profile.email,
    copyAriaKey: "copyValue",
    icon: "email",
  },
  {
    labelKey: "whatsapp",
    hint: "whatsappHint",
    href: `https://wa.me/${WHATSAPP_DIGITS}`,
    external: true,
    copyValue: profile.whatsapp,
    copyAriaKey: "copyValue",
    icon: "whatsapp",
  },
  {
    labelKey: "github",
    hint: `@${GITHUB_HANDLE}`,
    href: profile.github,
    external: true,
    copyValue: profile.github,
    copyAriaKey: "copyLink",
    icon: "github",
  },
  {
    labelKey: "linkedin",
    hint: `/${LINKEDIN_HANDLE}`,
    href: profile.linkedin,
    external: true,
    copyValue: profile.linkedin,
    copyAriaKey: "copyLink",
    icon: "linkedin",
  },
  ...(profile.meetingLink
    ? [
        {
          labelKey: "schedule" as const,
          hint: "scheduleHint",
          href: profile.meetingLink,
          external: true,
          copyValue: profile.meetingLink,
          copyAriaKey: "copyLink" as const,
          icon: "schedule" as const,
        },
      ]
    : []),
];

function ChannelGlyph({ icon }: { icon: ChannelIcon }) {
  const common = "h-4 w-4";
  switch (icon) {
    case "email":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className={common}>
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className={common}>
          <path
            d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9 9.5c.5 2.5 3 5 5.5 5.5l1-1.5 2 1c-.5 1.5-1.5 2-3 1.5-3-1-6-4-7-7-.5-1.5 0-2.5 1.5-3l1 2L9 9.5Z"
            fill="currentColor"
          />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className={common}>
          <path
            fill="currentColor"
            d="M12 2.75a9.5 9.5 0 0 0-3 18.52c.48.09.65-.2.65-.46v-1.67c-2.66.58-3.22-1.13-3.22-1.13-.43-1.1-1.06-1.4-1.06-1.4-.87-.59.07-.58.07-.58.96.07 1.47.99 1.47.99.85 1.46 2.24 1.04 2.79.8.09-.62.33-1.04.6-1.28-2.12-.24-4.35-1.06-4.35-4.7 0-1.04.37-1.89.98-2.56-.1-.24-.43-1.21.09-2.52 0 0 .8-.26 2.61.98A9.07 9.07 0 0 1 12 6.42a9.1 9.1 0 0 1 2.38.32c1.81-1.24 2.61-.98 2.61-.98.52 1.31.19 2.28.09 2.52.61.67.98 1.52.98 2.56 0 3.65-2.23 4.45-4.36 4.69.34.3.65.88.65 1.78v3.5c0 .26.17.56.66.46A9.5 9.5 0 0 0 12 2.75Z"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className={common}>
          <path
            fill="currentColor"
            d="M6.94 8.5H3.56V19h3.38V8.5ZM5.25 3A1.96 1.96 0 1 0 5.25 6.92 1.96 1.96 0 0 0 5.25 3ZM19 13.24c0-3.16-1.69-4.63-3.94-4.63a3.39 3.39 0 0 0-3.08 1.7V8.5H8.6V19h3.38v-5.2c0-1.37.26-2.7 1.96-2.7 1.68 0 1.7 1.57 1.7 2.79V19H19v-5.76Z"
          />
        </svg>
      );
    case "schedule":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className={common}>
          <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="m10.5 13.5 2 2 3.5-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

function CopyGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3.5 w-3.5">
      <rect x="8.5" y="8.5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.5 5.5v-1a2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h1" stroke="currentColor" strokeWidth="1.6" transform="translate(1 1)" />
    </svg>
  );
}

function OpenGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3.5 w-3.5">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3.5 w-3.5">
      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

  const handleCopy = async (channel: Channel) => {
    try {
      await navigator.clipboard.writeText(channel.copyValue);
      setCopiedId(channel.labelKey);
    } catch {
      // Clipboard API unavailable (unsupported browser/context) — the
      // channel link itself (mailto:/wa.me) remains a working fallback.
    }
  };

  const resolveHint = (channel: Channel) =>
    channel.hint.endsWith("Hint") ? t(channel.hint) : channel.hint;

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
                  onFocus={() => handleEnter(index)}
                  onBlur={handleLeave}
                  className={`contact-bus-node group relative bg-[var(--bg-space)] ${active === index ? "is-active" : ""}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="contact-icon-badge" aria-hidden>
                      <ChannelGlyph icon={channel.icon} />
                    </span>
                    <span className="min-w-0">
                      <span className="hud-label block transition-colors group-hover:text-[var(--accent-primary)]">
                        {t(channel.labelKey)}
                      </span>
                      <span className="contact-hint block truncate text-[13px] font-medium text-[var(--text-primary)]/90">
                        {resolveHint(channel)}
                      </span>
                    </span>
                  </div>
                  <div className="contact-actions mt-2.5 flex items-stretch gap-1.5">
                    <button
                      type="button"
                      onClick={() => void handleCopy(channel)}
                      aria-label={t(channel.copyAriaKey, { channel: t(channel.labelKey) })}
                      aria-live="polite"
                      className={`contact-action contact-action-copy ${isCopied ? "is-copied" : ""}`}
                    >
                      {isCopied ? <CheckGlyph /> : <CopyGlyph />}
                      <span>{isCopied ? t("copied") : t("copy")}</span>
                    </button>
                    <a
                      href={channel.href}
                      aria-label={t("openChannel", { channel: t(channel.labelKey) })}
                      {...(channel.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="contact-action contact-action-open"
                    >
                      <span>{t("openLabel")}</span>
                      <OpenGlyph />
                    </a>
                  </div>
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
