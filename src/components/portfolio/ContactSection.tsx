"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import profile from "../../../content/portfolio/profile.json";

const LINKS = [
  {
    id: "email",
    labelKey: "email" as const,
    value: profile.email,
    href: `mailto:${profile.email}`,
    external: false,
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
];

export function ContactSection() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="px-6 py-20 pb-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="section-title">{t("title")}</h2>
        <p className="mt-4 max-w-lg text-[var(--text-muted)]">{t("subtitle")}</p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12"
        >
          <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--accent-primary)]">
            <span className="text-[var(--text-muted)]">$</span> contact
          </p>

          <ul className="mt-4 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
            {LINKS.map((link, i) => (
              <motion.li
                key={link.id}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex items-center gap-4 py-5 transition-colors hover:bg-[var(--bg-card)]/40 sm:gap-8"
                >
                  <span className="w-16 shrink-0 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent-primary)]">
                    {t(link.labelKey)}
                  </span>
                  <span className="hidden flex-1 border-b border-dotted border-[var(--border-subtle)] sm:block" />
                  <span className="font-[family-name:var(--font-mono)] text-sm text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)] sm:text-base">
                    {link.value}
                  </span>
                  <span className="text-[var(--text-muted)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-[var(--accent-primary)] group-hover:opacity-100">
                    →
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>

          <p className="contact-cursor mt-4 font-[family-name:var(--font-mono)] text-xs text-[var(--text-muted)]/50">
            <span className="text-[var(--text-muted)]">$</span>{" "}
            <span className="contact-cursor-blink">_</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
