"use client";

import Image from "next/image";
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
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {items.map((project, i) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={`/projects/${project.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] transition-colors hover:border-[var(--accent-primary)]/25"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-surface)]">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)]/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 text-xs text-[var(--text-muted)]">
                  {project.year}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-medium text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]">
                  {project.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--text-muted)]">
                  {project.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-[var(--bg-surface)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
                    >
                      {s}
                    </span>
                  ))}
                  {project.stack.length > 4 && (
                    <span className="px-1 text-xs text-[var(--text-muted)]">
                      +{project.stack.length - 4}
                    </span>
                  )}
                </div>
                <span className="mt-5 text-sm text-[var(--accent-primary)]">
                  {t("viewProject")} →
                </span>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
