"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  getExperience,
  getProfile,
  getSkills,
} from "@/lib/portfolio";
import type { Locale } from "@/i18n/routing";

export function ResumeView({ locale }: { locale: Locale }) {
  const t = useTranslations("resume");
  const profile = getProfile(locale);
  const experience = getExperience(locale);
  const skills = getSkills(locale);

  return (
    <div className="theme-portfolio min-h-screen px-6 py-12 print:bg-white print:text-black">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Link
            href="/"
            className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            ← Command Center
          </Link>
          <div className="flex gap-3">
            <a
              href="/resume.pdf"
              download
              className="rounded-lg border border-[var(--border-subtle)] px-4 py-2 text-sm text-[var(--text-primary)]"
            >
              {t("download")}
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg border border-[var(--border-subtle)] px-4 py-2 text-sm text-[var(--text-muted)]"
            >
              {t("print")}
            </button>
          </div>
        </div>

        <header className="border-b border-[var(--border-subtle)] pb-6">
          <h1 className="text-3xl font-semibold">{profile.name}</h1>
          <p className="mt-1 text-lg text-[var(--accent-primary)]">{profile.title}</p>
          <p className="mt-2 text-[var(--text-muted)]">
            {profile.email} · {profile.location}
          </p>
        </header>

        <section className="mt-8">
          <h2 className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
            {t("summary")}
          </h2>
          <p className="mt-2 leading-relaxed">{profile.summary}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
            {t("experience")}
          </h2>
          <div className="mt-4 space-y-6">
            {experience.map((item) => (
              <article key={item.id}>
                <div className="flex flex-wrap justify-between gap-2">
                  <h3 className="font-medium">
                    {item.role} — {item.company}
                  </h3>
                  <span className="text-sm text-[var(--text-muted)]">
                    {item.period.start} — {item.period.end ?? "Present"}
                  </span>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--text-muted)]">
                  {item.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
            {t("education")}
          </h2>
          {profile.education.map((edu, i) => (
            <div key={i} className="mt-2">
              <p className="font-medium">{edu.degree}</p>
              <p className="text-[var(--text-muted)]">
                {edu.institution} · {edu.period}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8">
          <h2 className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
            {t("skills")}
          </h2>
          <div className="mt-3 space-y-2">
            {skills.map((group) => (
              <p key={group.category}>
                <span className="font-medium">{group.category}:</span>{" "}
                {group.items.join(", ")}
              </p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
