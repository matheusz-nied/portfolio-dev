"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import profile from "../../../content/portfolio/profile.json";

interface RecruiterModeProps {
  locale: "pt" | "en";
}

export function RecruiterMode({ locale }: RecruiterModeProps) {
  const t = useTranslations("recruiter");
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "r" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        setActive((v) => {
          const next = !v;
          document.body.classList.toggle("recruiter-mode", next);
          return next;
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!active) return null;

  return (
    <div className="fixed right-4 top-4 z-[90] w-72 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 p-5 backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--text-primary)]">
          {t("title")}
        </h3>
        <button
          type="button"
          onClick={() => {
            setActive(false);
            document.body.classList.remove("recruiter-mode");
          }}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          {t("close")} (R)
        </button>
      </div>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-[var(--text-muted)]">{t("yearsExp")}</dt>
          <dd className="font-medium text-[var(--text-primary)]">
            {profile.yearsExperience}+
          </dd>
        </div>
        <div>
          <dt className="text-[var(--text-muted)]">{t("topStack")}</dt>
          <dd className="text-[var(--text-primary)]">{profile.topStack.join(" · ")}</dd>
        </div>
        <div>
          <dt className="text-[var(--text-muted)]">{t("languages")}</dt>
          <dd className="text-[var(--text-primary)]">{profile.languages[locale]}</dd>
        </div>
        <div>
          <dt className="text-[var(--text-muted)]">{t("availability")}</dt>
          <dd className="text-[var(--text-primary)]">{profile.availability[locale]}</dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-col gap-2">
        <a
          href="/resume.pdf"
          download
          className="rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-center text-xs text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)]/30"
        >
          {t("downloadCv")}
        </a>
        <Link
          href="/resume"
          className="rounded-lg px-3 py-2 text-center text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          {t("viewResume")}
        </Link>
      </div>
    </div>
  );
}
