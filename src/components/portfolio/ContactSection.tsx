"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import profile from "../../../content/portfolio/profile.json";

const CHANNELS = [
  {
    id: "email",
    code: "CH-01",
    labelKey: "email" as const,
    value: profile.email,
    href: `mailto:${profile.email}`,
    external: false,
  },
  {
    id: "github",
    code: "CH-02",
    labelKey: "github" as const,
    value: profile.github.replace("https://github.com/", ""),
    href: profile.github,
    external: true,
  },
  {
    id: "linkedin",
    code: "CH-03",
    labelKey: "linkedin" as const,
    value: profile.linkedin.replace("https://linkedin.com", ""),
    href: profile.linkedin,
    external: true,
  },
] as const;

export function ContactSection() {
  const t = useTranslations("contact");
  const locale = useLocale() as "pt" | "en";
  const reducedMotion = useReducedMotion();
  const availability = profile.availability[locale];
  const location = profile.location[locale];

  return (
    <section id="contact" className="px-6 py-20 pb-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="section-title">{t("title")}</h2>
        <p className="mt-4 max-w-2xl text-[var(--text-muted)]">{t("subtitle")}</p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12"
        >
          <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--accent-primary)]">
            <span className="text-[var(--text-muted)]">$</span> {t("contactPrompt")}
          </p>

          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14 lg:items-start">
            {/* Uplink status */}
            <div className="border-l border-[var(--border-subtle)] pl-5 sm:pl-6">
              <div className="space-y-3 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider">
                <p className="text-[var(--text-muted)]/45">
                  {t("statusLabel")}{" "}
                  <span className="inline-flex items-center gap-1.5 normal-case tracking-normal text-[var(--accent-primary)]">
                    <span className="relative flex h-1.5 w-1.5">
                      {!reducedMotion && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-primary)] opacity-40" />
                      )}
                      <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
                    </span>
                    {availability}
                  </span>
                </p>
                <p className="text-[var(--text-muted)]/45">
                  {t("locationLabel")}{" "}
                  <span className="normal-case tracking-normal text-[var(--text-primary)]/80">
                    {location}
                  </span>
                </p>
                <p className="text-[var(--text-muted)]/45">
                  {t("channelsLabel")}{" "}
                  <span className="text-[var(--accent-primary)]/80">
                    {CHANNELS.length} {t("channelsActive")}
                  </span>
                </p>
              </div>

              <div className="contact-uplink-scan mt-6 h-px w-full overflow-hidden bg-[var(--border-subtle)]/40">
                {!reducedMotion && (
                  <span className="contact-uplink-beam block h-full w-1/4 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent" />
                )}
              </div>

              <ul className="mt-5 space-y-2" aria-hidden>
                {CHANNELS.map((channel) => (
                  <li
                    key={channel.id}
                    className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-muted)]/35"
                  >
                    <span className="text-[var(--accent-primary)]/50">{channel.code}</span>
                    <span className="h-px flex-1 bg-[var(--border-subtle)]/50" />
                    <span className="text-[var(--accent-primary)]/40">{t("channelReady")}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Channel list */}
            <ul className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
              {CHANNELS.map((channel, i) => (
                <motion.li
                  key={channel.id}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={channel.href}
                    {...(channel.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group contact-channel-row flex items-center gap-3 py-5 transition-colors hover:bg-[var(--bg-card)]/40 sm:gap-5 sm:py-6"
                  >
                    <span className="w-10 shrink-0 font-[family-name:var(--font-mono)] text-[10px] text-[var(--accent-primary)]/55 transition-colors group-hover:text-[var(--accent-primary)]">
                      {channel.code}
                    </span>
                    <span className="w-14 shrink-0 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent-primary)] sm:w-16">
                      {t(channel.labelKey)}
                    </span>
                    <span className="hidden min-w-0 flex-1 border-b border-dotted border-[var(--border-subtle)] sm:block" />
                    <span className="min-w-0 truncate font-[family-name:var(--font-mono)] text-sm text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)] sm:text-base">
                      {channel.value}
                    </span>
                    <span className="shrink-0 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--text-muted)]/0 transition-all group-hover:text-[var(--accent-primary)]/70 group-hover:opacity-100 sm:text-[var(--text-muted)]/30">
                      {t("openLabel")}
                    </span>
                    <span className="shrink-0 text-[var(--text-muted)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-[var(--accent-primary)] group-hover:opacity-100">
                      →
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          <p className="contact-cursor mt-6 font-[family-name:var(--font-mono)] text-xs text-[var(--text-muted)]/50">
            <span className="text-[var(--text-muted)]">$</span> {t("pingPrompt")}{" "}
            <span className="text-[var(--accent-primary)]/60">{t("pingOk")}</span>
            <span className="contact-cursor-blink ml-0.5">_</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
