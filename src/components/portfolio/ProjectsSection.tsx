"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { getProjects } from "@/lib/portfolio";

type Project = ReturnType<typeof getProjects>[number];

interface ProjectsSectionProps {
  items: Project[];
}

export function ProjectsSection({ items }: ProjectsSectionProps) {
  const t = useTranslations("projects");

  return (
    <section id="projects" className="px-6 py-20">
      <h2 className="section-title">{t("title")}</h2>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {items.map((project, i) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="group rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 transition-colors hover:border-[var(--accent-primary)]/25"
          >
            <h3 className="text-lg font-medium text-[var(--text-primary)]">
              {project.title}
            </h3>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  {t("problem")}
                </span>
                <p className="mt-1.5 leading-relaxed text-[var(--text-muted)]">
                  {project.problem}
                </p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  {t("stack")}
                </span>
                <p className="mt-1.5 flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-[var(--bg-surface)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
                    >
                      {s}
                    </span>
                  ))}
                </p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  {t("result")}
                </span>
                <p className="mt-1.5 text-[var(--text-primary)]">{project.result}</p>
              </div>
            </div>
            <div className="mt-5 flex gap-4 text-xs">
              {project.relatedTechPost && (
                <Link
                  href={`/tech/${project.relatedTechPost}`}
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  Tech Log →
                </Link>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {t("viewCode")}
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
