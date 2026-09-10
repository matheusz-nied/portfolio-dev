import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MDXContent } from "@/components/mdx-content";
import {
  getTechPost,
  formatDate,
  getAlternatePost,
  getAdjacentTechPosts,
} from "@/lib/content";
import { techPosts } from "#site/content";
import { getAlternates } from "@/lib/seo";
import { ReadingProgressBar } from "@/components/article/ReadingProgressBar";
import { ArticleActions } from "@/components/article/ArticleActions";
import { AdjacentPosts } from "@/components/article/AdjacentPosts";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return techPosts.map((post) => ({
    locale: post.locale,
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const post = getTechPost(slug, loc);
  if (!post) return {};
  const alternate = getAlternatePost(
    techPosts,
    post.translationSlug,
    loc === "pt" ? "en" : "pt",
  );
  const paths = {
    [loc]: `/tech/${post.slug}`,
    ...(alternate ? { [alternate.locale]: `/tech/${alternate.slug}` } : {}),
  };

  return {
    title: `${post.title} — Transmission Log`,
    description: post.description,
    alternates: getAlternates(loc, paths),
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function TechPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const post = getTechPost(slug, loc);

  if (!post) notFound();
  if (!post.published && !post.hidden) notFound();

  const t = await getTranslations("tech");
  const alternate = getAlternatePost(
    techPosts,
    post.translationSlug,
    loc === "pt" ? "en" : "pt",
  );
  const { prev, next } = getAdjacentTechPosts(post.slug, loc);

  return (
    <>
      <ReadingProgressBar variant="tech" />

      <article className="mx-auto w-full max-w-3xl">
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/tech"
            className="group inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs text-[var(--tech-muted)] transition-all hover:border-[var(--tech-accent)] hover:bg-white/[0.06] hover:text-white"
          >
            <span className="transition-transform duration-150 group-hover:-translate-x-1">
              ←
            </span>
            <span>{t("backToBlog")}</span>
          </Link>

          {alternate && (
            <Link
              href={`/tech/${alternate.slug}`}
              locale={alternate.locale}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--tech-border)] bg-[var(--tech-surface)]/80 px-3.5 py-1.5 font-mono text-xs text-[var(--tech-accent)] transition-colors hover:bg-[var(--tech-surface)] hover:text-emerald-300"
            >
              <span>
                {alternate.locale === "pt"
                  ? "🇧🇷 Versão em Português"
                  : "🇺🇸 English version"}
              </span>
              <span>→</span>
            </Link>
          )}
        </div>

        {/* Article Header */}
        <header className="mt-8 border-b border-[var(--tech-border)] pb-8">
          {/* Metadata telemetry line */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--tech-muted)]">
            <span className="inline-flex items-center gap-1.5 rounded bg-[var(--tech-accent)]/10 px-2.5 py-0.5 font-semibold uppercase tracking-wider text-[var(--tech-accent)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--tech-accent)] animate-pulse" />
              Transmission
            </span>
            <span className="opacity-40">/</span>
            <time dateTime={post.date} className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="h-3.5 w-3.5 opacity-60"
                aria-hidden="true"
              >
                <rect
                  x="2"
                  y="3"
                  width="12"
                  height="11"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
                <path
                  d="M2 6.5H14M5 1.5V3.5M11 1.5V3.5"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
              {formatDate(post.date, loc)}
            </time>
            <span className="opacity-40">/</span>
            <span className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="h-3.5 w-3.5 opacity-60"
                aria-hidden="true"
              >
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.25" />
                <path
                  d="M8 4.5V8L10.5 9.5"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
              {t("readTime", { minutes: post.readingTime })}
            </span>
          </div>

          {/* Title */}
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl leading-[1.2]">
            {post.title}
          </h1>

          {/* Description / Lead */}
          <p className="article-copy article-description mt-4 text-slate-300">
            {post.description}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-[var(--tech-border)] bg-white/[0.02] px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-[var(--tech-accent-soft)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content Body */}
        <div className="mt-10">
          <MDXContent code={post.code} className="article-copy prose-tech" />
        </div>

        {/* Article Footer */}
        <footer className="mt-16">
          {/* Telemetry signature */}
          <div className="mb-8 flex items-center justify-between text-xs font-mono text-white/40">
            <span className="text-[var(--tech-accent)]">{t("endOfPost")}</span>
            <span className="opacity-60">AUTH: MATHEUS FERNANDES</span>
          </div>

          {/* Actions: Copy Link + Back to Top */}
          <ArticleActions
            variant="tech"
            labels={{
              copyLink: t("copyLink"),
              copiedLink: t("copiedLink"),
              backToTop: t("backToTop"),
            }}
          />

          {/* Adjacent Posts Navigation */}
          <AdjacentPosts
            prev={prev}
            next={next}
            basePath="/tech"
            variant="tech"
            labels={{
              prev: t("previousPost"),
              next: t("nextPost"),
            }}
          />
        </footer>
      </article>
    </>
  );
}
