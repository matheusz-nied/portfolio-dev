"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BlogPortalLinks } from "@/components/portfolio/BlogPortalLinks";
import type { getProjects } from "@/lib/portfolio";

type Project = ReturnType<typeof getProjects>[number];

interface ProjectsSectionProps {
  items: Project[];
}

export function ProjectsSection({ items }: ProjectsSectionProps) {
  const t = useTranslations("projects");
  const reducedMotion = useReducedMotion();

  return (
    <section id="projects" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">{t("title")}</h2>
            <p className="mt-2 max-w-lg text-sm text-[var(--text-muted)]">{t("subtitle")}</p>
          </div>
          <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]/45">
            <span className="text-[var(--accent-primary)]/55">{t("registryTag")}</span>
            <span className="mx-2 text-[var(--text-muted)]/20">|</span>
            {t("modulesCount", { count: items.length })}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="project-registry relative mt-10 overflow-hidden border border-[var(--border-subtle)]/60 bg-[var(--bg-card)]/20"
        >
          <div className="project-registry-scanlines pointer-events-none absolute inset-0" aria-hidden />
          {!reducedMotion && (
            <div className="project-registry-sweep pointer-events-none absolute inset-y-0 w-28" aria-hidden />
          )}

          <div className="grid gap-px bg-[var(--border-subtle)]/30 md:grid-cols-2">
            {items.map((project, i) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className={`bg-[var(--bg-space)] ${project.featured && i === 0 ? "md:col-span-2" : ""}`}
              >
                <Link
                  href={`/projects/${project.id}`}
                  aria-label={t("accessModule", { title: project.title })}
                  className="project-module group flex h-full cursor-pointer flex-col"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)]/35 px-4 py-2 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.14em]">
                    <span className="text-[var(--accent-primary)]/55">
                      PRJ-{String(i + 1).padStart(2, "0")}
                    </span>
                    {project.featured ? (
                      <span className="project-live-badge inline-flex items-center gap-1.5 text-[var(--accent-primary)]">
                        {!reducedMotion && (
                          <span className="h-1 w-1 rounded-full bg-[var(--accent-primary)]" />
                        )}
                        {t("liveTag")}
                      </span>
                    ) : (
                      <span className="text-[var(--text-muted)]/30">{t("archivedTag")}</span>
                    )}
                    <span className="text-[var(--text-muted)]/35">[{project.year}]</span>
                  </div>

                  <div className="project-module-preview relative aspect-[16/10] overflow-hidden bg-[var(--bg-surface)]">
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-space)]/90 via-[var(--bg-space)]/20 to-transparent" />
                    {!reducedMotion && (
                      <div className="project-module-scan pointer-events-none absolute inset-y-0 w-16 opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                    <div className="project-module-corners pointer-events-none absolute inset-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]">
                      {project.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--text-muted)]">
                      {project.summary}
                    </p>
                    <p className="mt-4 font-[family-name:var(--font-mono)] text-[10px] tracking-wide text-[var(--text-muted)]/50">
                      {project.stack.slice(0, 5).join(" · ")}
                      {project.stack.length > 5 && ` · +${project.stack.length - 5}`}
                    </p>
                    <span className="project-module-access mt-5 inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--accent-primary)]">
                      {t("accessLabel")}
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[var(--border-subtle)]/35 px-4 py-2.5">
            <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]/40">
              <span className="text-[var(--text-muted)]/55">$</span> {t("blogsPrompt")}
            </p>
            <BlogPortalLinks />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
