import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MDXContent } from "@/components/mdx-content";
import {
  getTechPost,
  formatDate,
  getAlternatePost,
} from "@/lib/content";
import { techPosts } from "#site/content";
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
  const post = getTechPost(slug, locale as Locale);
  if (!post) return {};
  return {
    title: `${post.title} — Transmission Log`,
    description: post.description,
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

  return (
    <article>
      <Link
        href="/tech"
        className="text-sm text-[var(--tech-muted)] transition-colors hover:text-[var(--tech-text)]"
      >
        ← {t("allPosts")}
      </Link>
      <header className="mt-8 border-b border-[var(--tech-border)] pb-8">
        <time className="font-[family-name:var(--font-mono)] text-xs text-[var(--tech-muted)]">
          {formatDate(post.date, loc)} · {t("readTime", { minutes: post.readingTime })}
        </time>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-[var(--tech-text)]">
          {post.title}
        </h1>
        <p className="mt-3 leading-relaxed text-[var(--tech-muted)]">{post.description}</p>
        {alternate && (
          <Link
            href={`/tech/${alternate.slug}`}
            locale={alternate.locale}
            className="mt-4 inline-block text-xs text-[var(--tech-accent)] hover:underline"
          >
            {alternate.locale.toUpperCase()} →
          </Link>
        )}
      </header>
      <MDXContent
        code={post.code}
        className="prose-tech prose prose-neutral dark:prose-invert mt-10 max-w-none prose-headings:font-[family-name:var(--font-mono)] prose-headings:font-medium prose-headings:text-[var(--tech-text)] prose-p:text-[var(--tech-muted)] prose-a:text-[var(--tech-accent)] prose-strong:text-[var(--tech-text)] prose-code:text-[var(--tech-accent)] prose-pre:bg-[var(--tech-surface)] prose-pre:border prose-pre:border-[var(--tech-border)]"
      />
    </article>
  );
}
