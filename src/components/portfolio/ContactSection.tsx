"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import profile from "../../../content/portfolio/profile.json";

export function ContactSection() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="px-6 py-20 pb-28">
      <h2 className="section-title">{t("title")}</h2>
      <p className="mt-4 max-w-lg text-[var(--text-muted)]">{t("subtitle")}</p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 flex flex-wrap gap-3"
      >
        <a
          href={`mailto:${profile.email}`}
          className="rounded-lg border border-[var(--border-subtle)] px-5 py-2.5 text-sm text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)]/30 hover:bg-[var(--bg-card)]"
        >
          {t("email")}
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-[var(--border-subtle)] px-5 py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
        >
          {t("github")}
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-[var(--border-subtle)] px-5 py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
        >
          {t("linkedin")}
        </a>
      </motion.div>
    </section>
  );
}
