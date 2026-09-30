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
    <nav aria-label={labels.nav ?? "Adjacent entries"} className="cj-adjacent">
      {prev ? (
        <Link href={`${basePath}/${prev.slug}`} className="cj-adjacent-cell" data-side="prev">
          <span className="cj-adjacent-label">
            <span className="cj-manicule" aria-hidden="true">
              {"\u261C\uFE0E"}
            </span>
            {labels.prev}
          </span>
          <span className="cj-adjacent-title line-clamp-2">{prev.title}</span>
        </Link>
      ) : (
        <div className="hidden sm:block" aria-hidden="true" />
      )}

      {next && (
        <Link href={`${basePath}/${next.slug}`} className="cj-adjacent-cell" data-side="next">
          <span className="cj-adjacent-label">
            {labels.next}
            <span className="cj-manicule" aria-hidden="true">
              {"\u261E\uFE0E"}
            </span>
          </span>
          <span className="cj-adjacent-title line-clamp-2">{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
