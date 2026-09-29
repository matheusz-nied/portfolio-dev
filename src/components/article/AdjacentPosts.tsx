import { Link } from "@/i18n/navigation";

interface PostSummary {
  slug: string;
  title: string;
  readingTime?: number;
}

interface AdjacentPostsProps {
  prev: PostSummary | null;
  next: PostSummary | null;
  basePath: "/tech" | "/reflections";
  variant: "tech" | "reflections";
  labels: {
    prev: string;
    next: string;
    nav?: string;
  };
}

export function AdjacentPosts({
  prev,
  next,
  basePath,
  variant,
  labels,
}: AdjacentPostsProps) {
  if (!prev && !next) return null;

  const isTech = variant === "tech";

  if (isTech) {
    return (
      <nav aria-label={labels.nav ?? "Artigos adjacentes"} className="tl-adjacent">
        {prev ? (
          <Link href={`${basePath}/${prev.slug}`} className="tl-adjacent-cell" data-side="prev">
            <span className="tl-hud">
              <span aria-hidden="true">←</span>
              {labels.prev}
            </span>
            <span className="tl-adjacent-title line-clamp-2">{prev.title}</span>
          </Link>
        ) : (
          <div className="tl-adjacent-cell hidden sm:flex" aria-hidden="true" />
        )}

        {next && (
          <Link href={`${basePath}/${next.slug}`} className="tl-adjacent-cell" data-side="next">
            <span className="tl-hud">
              {labels.next}
              <span aria-hidden="true">→</span>
            </span>
            <span className="tl-adjacent-title line-clamp-2">{next.title}</span>
          </Link>
        )}
      </nav>
    );
  }

  return (
    <nav
      aria-label={labels.nav ?? "Artigos adjacentes"}
      className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`${basePath}/${prev.slug}`}
          className={`group relative flex flex-col justify-between rounded-xl p-5 transition-all duration-200 ${
            isTech
              ? "border border-white/[0.08] bg-[#0c120e]/60 hover:border-[#6ec492]/40 hover:bg-[#0c120e]"
              : "border border-[var(--refl-border)] bg-[var(--refl-surface)]/60 hover:border-[var(--refl-accent)]/40 hover:bg-[var(--refl-surface)]"
          }`}
        >
          <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-white/50 group-hover:text-white/80 transition-colors">
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            {labels.prev}
          </span>
          <h4
            className={`mt-2.5 text-base font-medium line-clamp-2 transition-colors ${
              isTech
                ? "text-slate-200 group-hover:text-[#6ec492]"
                : "text-[var(--refl-text)] group-hover:text-[var(--refl-accent)]"
            }`}
          >
            {prev.title}
          </h4>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next && (
        <Link
          href={`${basePath}/${next.slug}`}
          className={`group relative flex flex-col justify-between rounded-xl p-5 text-right transition-all duration-200 ${
            isTech
              ? "border border-white/[0.08] bg-[#0c120e]/60 hover:border-[#6ec492]/40 hover:bg-[#0c120e]"
              : "border border-[var(--refl-border)] bg-[var(--refl-surface)]/60 hover:border-[var(--refl-accent)]/40 hover:bg-[var(--refl-surface)]"
          }`}
        >
          <span className="flex items-center justify-end gap-1.5 font-mono text-xs uppercase tracking-wider text-white/50 group-hover:text-white/80 transition-colors">
            {labels.next}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
          <h4
            className={`mt-2.5 text-base font-medium line-clamp-2 transition-colors ${
              isTech
                ? "text-slate-200 group-hover:text-[#6ec492]"
                : "text-[var(--refl-text)] group-hover:text-[var(--refl-accent)]"
            }`}
          >
            {next.title}
          </h4>
        </Link>
      )}
    </nav>
  );
}
