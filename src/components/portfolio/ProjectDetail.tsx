import { Link } from "@/i18n/navigation";
import { ProjectCarousel } from "@/components/portfolio/ProjectCarousel";
import { SignalMeshBackground } from "@/components/portfolio/SignalMeshBackground";
import type { getProject } from "@/lib/portfolio";

type Project = NonNullable<ReturnType<typeof getProject>>;

interface ProjectDetailProps {
  project: Project;
  labels: {
    backPrompt: string;
    backLabel: string;
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

const linkClass =
  "text-[var(--text-muted)] transition-colors hover:text-[var(--accent-primary)]";

export function ProjectDetail({ project, labels }: ProjectDetailProps) {
  const hasDemo = project.links.demo && project.links.demo !== "#";
  const hasLinks = hasDemo || project.links.github || project.relatedTechPost;

  return (
    <div className="theme-portfolio relative min-h-screen">
      <SignalMeshBackground />
      <div className="relative z-10">
      <nav className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-space)]/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-3.5">
          <Link
            href="/#projects"
            aria-label={labels.backLabel}
            className="group inline-flex min-w-0 items-center gap-2 font-[family-name:var(--font-mono)] text-xs transition-colors"
          >
            <span className="shrink-0 text-[var(--text-muted)] transition-transform group-hover:-translate-x-0.5 group-hover:text-[var(--accent-primary)]">
              ←
            </span>
            <span className="shrink-0 text-[var(--text-muted)]">$</span>
            <span className="truncate text-[var(--accent-primary)]/80 transition-colors group-hover:text-[var(--accent-primary)]">
              {labels.backPrompt}
            </span>
          </Link>
          <span className="shrink-0 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--text-muted)]/45">
            {project.year}
          </span>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-8 pb-12">
        <ProjectCarousel images={project.images} title={project.title} />

        <header className="mt-8">
          <h1
            className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl"
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
                  className="flex gap-2 leading-relaxed text-[var(--text-muted)]"
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

        {hasLinks && (
          <footer className="mt-10 flex flex-wrap items-center gap-x-1 border-t border-[var(--border-subtle)]/80 pt-5 font-[family-name:var(--font-mono)] text-xs">
            {hasDemo && (
              <>
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {labels.viewProject}
                </a>
                {(project.links.github || project.relatedTechPost) && (
                  <span className="mx-2 text-[var(--text-muted)]/25">/</span>
                )}
              </>
            )}
            {project.links.github && (
              <>
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {labels.viewCode}
                </a>
                {project.relatedTechPost && (
                  <span className="mx-2 text-[var(--text-muted)]/25">/</span>
                )}
              </>
            )}
            {project.relatedTechPost && (
              <Link href={`/tech/${project.relatedTechPost}`} className={linkClass}>
                {labels.readTechPost}
              </Link>
            )}
          </footer>
        )}
      </div>
      </div>
    </div>
  );
}
