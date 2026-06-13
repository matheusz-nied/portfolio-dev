"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Constellation } from "@/components/easter-eggs/Constellation";
import profile from "../../../content/portfolio/profile.json";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-[80vh] flex-col justify-center px-6 py-24">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="text-sm tracking-wide text-[var(--accent-primary)]"
      >
        {t("greeting")}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="glitch-hover mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--text-primary)] md:text-6xl"
        style={{ textWrap: "balance" }}
      >
        {profile.name}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 max-w-2xl text-xl leading-snug text-[var(--text-muted)] md:text-2xl"
        style={{ textWrap: "balance" }}
      >
        {t("headline")}{" "}
        <span className="text-[var(--accent-primary)]">{t("headlineAccent")}</span>
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-muted)]"
        style={{ textWrap: "pretty" }}
      >
        {t("subtitle")}
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex flex-wrap items-center gap-3 text-sm"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-1.5 text-[var(--text-primary)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
          {t("available")}
        </span>
        <span className="text-[var(--text-muted)]">{t("location")}</span>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="mt-6 text-xs text-[var(--text-muted)]/70"
      >
        {t("pressR")}
      </motion.p>
      <div className="mt-10">
        <Constellation />
      </div>
    </section>
  );
}
