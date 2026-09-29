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
  getTechPostNumber,
} from "@/lib/content";
import { techPosts } from "#site/content";
import { getAlternates } from "@/lib/seo";
import { ReadingProgressBar } from "@/components/article/ReadingProgressBar";
import { ArticleActions } from "@/components/article/ArticleActions";
import { AdjacentPosts } from "@/components/article/AdjacentPosts";
import { ArticleToc } from "@/components/transmission/ArticleToc";
import { FrameRule } from "@/components/transmission/FrameRule";
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

      <div className="tl-crumbs">
        <Link href="/tech" className="tl-crumb-link">
          <span className="tl-arrow" aria-hidden="true">
            ←
          </span>
          <span>{t("siteName")}</span>
        </Link>

        {alternate && (
          <Link
            href={`/tech/${alternate.slug}`}
            locale={alternate.locale}
            className="tl-alt-link"
          >
            <b>{alternate.locale.toUpperCase()}</b>
            <span>
              {alternate.locale === "pt" ? "Versão em Português" : "English version"}
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      <header className="tl-article-head">
        <div className="tl-article-head-copy">
          <div className="tl-meta">
            <span className="tl-meta-id">TX-{getTechPostNumber(post.slug, loc)}</span>
            <time dateTime={post.date}>{formatDate(post.date, loc)}</time>
            <span className="tl-meta-sep" aria-hidden="true">
              /
            </span>
            <span>{t("readTime", { minutes: post.readingTime })}</span>
          </div>

          <h1 className="tl-article-title">{post.title}</h1>
          <p className="tl-article-lead">{post.description}</p>

          {post.tags.length > 0 && (
            <div className="tl-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="tl-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <FrameRule />

      <div className="tl-article-layout">
        <aside className="tl-rail">
          <div className="tl-rail-inner">
            <ArticleToc items={post.toc} label={t("onThisPage")} />
          </div>
        </aside>

        <article className="tl-article">
          <MDXContent code={post.code} className="tl-article-body tl-prose" />

          <div className="tl-signature">
            <span>{t("endOfPost")}</span>
            <span>AUTH: MATHEUS FERNANDES</span>
          </div>
        </article>
      </div>

      <FrameRule />

      <ArticleActions
        variant="tech"
        labels={{
          copyLink: t("copyLink"),
          copiedLink: t("copiedLink"),
          backToTop: t("backToTop"),
        }}
      />

      <AdjacentPosts
        prev={prev}
        next={next}
        basePath="/tech"
        variant="tech"
        labels={{
          prev: t("previousPost"),
          next: t("nextPost"),
          nav: t("articleNav"),
        }}
      />
    </>
  );
}
