import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MDXContent } from "@/components/mdx-content";
import {
  getReflectionPost,
  formatDate,
  getAlternatePost,
  getAdjacentReflectionPosts,
  getReflectionNumber,
} from "@/lib/content";
import { reflectionPosts } from "#site/content";
import { getAlternates } from "@/lib/seo";
import { ReadingProgressBar } from "@/components/article/ReadingProgressBar";
import { ArticleActions } from "@/components/article/ArticleActions";
import { AdjacentPosts } from "@/components/article/AdjacentPosts";
import { ArticleToc } from "@/components/transmission/ArticleToc";
import { Ornament } from "@/components/journal/Ornament";
import { Plate, plateVariantFor } from "@/components/journal/Plate";
import { toRoman, toRomanDate } from "@/lib/roman";
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
  const loc = locale as Locale;
  const post = getReflectionPost(slug, loc);
  if (!post) return {};
  const alternate = getAlternatePost(
    reflectionPosts,
    post.translationSlug,
    loc === "pt" ? "en" : "pt",
  );
  const paths = {
    [loc]: `/reflections/${post.slug}`,
    ...(alternate ? { [alternate.locale]: `/reflections/${alternate.slug}` } : {}),
  };

  return {
    title: `${post.title} — Cosmic Journal`,
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
  const { prev, next } = getAdjacentReflectionPosts(post.slug, loc);
  const number = getReflectionNumber(post.slug, loc);
  const roman = number > 0 ? toRoman(number) : "—";

  return (
    <>
      <ReadingProgressBar variant="reflections" />

      <div className="cj-crumbs">
        <Link href="/reflections" className="cj-crumb">
          <span aria-hidden="true">←</span>
          <span>{t("siteName")}</span>
        </Link>

        {alternate && (
          <Link
            href={`/reflections/${alternate.slug}`}
            locale={alternate.locale}
            className="cj-crumb"
          >
            <b>{alternate.locale.toUpperCase()}</b>
            <span>
              {alternate.locale === "pt" ? "Versão em Português" : "English version"}
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      <article>
        <header className="cj-entry-head">
          <div className="cj-entry-copy">
            <p className="cj-label cj-label-gold">
              {t("entryLabel")} № {roman} · {toRomanDate(post.date)}
            </p>
            <h1 className="cj-entry-title">{post.title}</h1>
            <p className="cj-entry-lead">{post.description}</p>
          </div>
          <Plate
            variant={plateVariantFor(number)}
            figure={number + 1}
            className="cj-entry-plate"
          />
        </header>

        <dl className="cj-spec">
          <div>
            <dt className="cj-label">{t("entryLabel")}</dt>
            <dd>№ {roman}</dd>
          </div>
          <div>
            <dt className="cj-label">{t("marginDate")}</dt>
            <dd>
              <time dateTime={post.date}>{formatDate(post.date, loc)}</time>
            </dd>
          </div>
          <div>
            <dt className="cj-label">{t("marginRead")}</dt>
            <dd>{t("readTime", { minutes: post.readingTime })}</dd>
          </div>
          <div>
            <dt className="cj-label">{t("marginTopics")}</dt>
            <dd>{post.tags.length > 0 ? post.tags.join(" · ") : "—"}</dd>
          </div>
        </dl>

        <div className="cj-entry-layout">
          <aside className="cj-margin">
            <div className="cj-margin-inner">
              <ArticleToc items={post.toc} label={t("onThisEntry")} classPrefix="cj" />
            </div>
          </aside>

          <div>
            <MDXContent code={post.code} className="cj-prose" />

            <div className="cj-finis">
              <Ornament />
              <span className="cj-finis-label">{t("endOfPost")}</span>
              <span className="cj-finis-sign">Matheus Fernandes</span>
            </div>

            <ArticleActions
              variant="reflections"
              labels={{
                copyLink: t("copyLink"),
                copiedLink: t("copiedLink"),
                backToTop: t("backToTop"),
              }}
            />
          </div>
        </div>
      </article>

      <AdjacentPosts
        prev={prev}
        next={next}
        basePath="/reflections"
        variant="reflections"
        labels={{
          prev: t("previousPost"),
          next: t("nextPost"),
          nav: t("articleNav"),
        }}
      />
    </>
  );
}
