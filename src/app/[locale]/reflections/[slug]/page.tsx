import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MDXContent } from "@/components/mdx-content";
import {
  getReflectionPost,
  formatDate,
  getAlternatePost,
} from "@/lib/content";
import { reflectionPosts } from "#site/content";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return reflectionPosts
    .filter((p) => p.published && !p.hidden)
    .map((post) => ({
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
  const post = getReflectionPost(slug, locale as Locale);
  if (!post) return {};
  return {
    title: `${post.title} — Cosmic Journal`,
    description: post.description,
  };
}

export default async function ReflectionPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const post = getReflectionPost(slug, loc);

  if (!post) notFound();

  const t = await getTranslations("reflections");
  const alternate = getAlternatePost(
    reflectionPosts,
    post.translationSlug,
    loc === "pt" ? "en" : "pt",
  );

  return (
    <article>
      <Link
        href="/reflections"
        className="text-sm text-[var(--refl-muted)] transition-colors hover:text-[var(--refl-text)]"
      >
        ← {t("allPosts")}
      </Link>
      <header className="mt-8 border-b border-[var(--refl-border)] pb-8">
        <time className="text-sm text-[var(--refl-muted)]">
          {formatDate(post.date, loc)} · {t("readTime", { minutes: post.readingTime })}
        </time>
        <h1
          className="mt-4 font-[family-name:var(--font-serif)] text-4xl font-medium leading-tight text-[var(--refl-text)]"
          style={{ textWrap: "balance" }}
        >
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--refl-muted)]">
          {post.description}
        </p>
        {alternate && (
          <Link
            href={`/reflections/${alternate.slug}`}
            locale={alternate.locale}
            className="mt-4 inline-block text-sm text-[var(--refl-accent)] hover:underline"
          >
            {alternate.locale.toUpperCase()} →
          </Link>
        )}
      </header>
      <MDXContent
        code={post.code}
        className="prose-reflections prose prose-lg mt-12 max-w-none prose-headings:font-[family-name:var(--font-serif)] prose-headings:font-medium prose-headings:text-[var(--refl-text)] prose-p:text-[var(--refl-muted)] prose-a:text-[var(--refl-accent)] prose-strong:text-[var(--refl-text)]"
      />
    </article>
  );
}
