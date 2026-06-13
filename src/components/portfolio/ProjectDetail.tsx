import { Link } from "@/i18n/navigation";
import { ProjectCarousel } from "@/components/portfolio/ProjectCarousel";
import type { getProject } from "@/lib/portfolio";

type Project = NonNullable<ReturnType<typeof getProject>>;

interface ProjectDetailProps {
  project: Project;
  labels: {
    back: string;
    problem: string;
    solution: string;
    role: string;
    highlights: string;
    stack: string;
    result: string;
    viewProject: string;
    viewCode: string;
    readTechPost: string;
  };
}

export function ProjectDetail({ project, labels }: ProjectDetailProps) {
  return (
    <div className="theme-portfolio min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/#projects"
          className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        >
          {labels.back}
        </Link>

        <ProjectCarousel images={project.images} title={project.title} />

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
            <span>{project.year}</span>
          </div>
          <h1
            className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl"
            style={{ textWrap: "balance" }}
          >
            {project.title}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-[var(--text-muted)]">
            {project.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-[var(--border-subtle)] px-2.5 py-1 text-xs text-[var(--text-muted)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        <div className="mt-10 space-y-10">
          <section>
            <h2 className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
              {labels.problem}
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--text-primary)]">
              {project.problem}
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
              {labels.solution}
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--text-primary)]">
              {project.solution}
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
              {labels.role}
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--text-primary)]">
              {project.role}
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
              {labels.highlights}
            </h2>
            <ul className="mt-3 space-y-2">
              {project.highlights.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-[var(--text-muted)] leading-relaxed"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent-primary)]" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5">
            <h2 className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
              {labels.result}
            </h2>
            <p className="mt-2 text-lg font-medium text-[var(--accent-primary)]">
              {project.result}
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 border-t border-[var(--border-subtle)] pt-8">
          {project.links.demo && project.links.demo !== "#" && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[var(--border-subtle)] px-5 py-2.5 text-sm text-[var(--text-primary)] transition-colors hover:border-[var(--accent-primary)]/30"
            >
              {labels.viewProject}
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[var(--border-subtle)] px-5 py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              {labels.viewCode}
            </a>
          )}
          {project.relatedTechPost && (
            <Link
              href={`/tech/${project.relatedTechPost}`}
              className="rounded-lg px-5 py-2.5 text-sm text-[var(--accent-primary)] hover:underline"
            >
              {labels.readTechPost} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
