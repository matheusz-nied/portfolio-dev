import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getTechPosts, formatDate } from "@/lib/content";
import { getAlternates } from "@/lib/seo";
import { FrameRule } from "@/components/transmission/FrameRule";
import { SignalField, SignalStrip } from "@/components/transmission/SignalField";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tech" });
  return {
    title: t("siteName"),
    description: t("tagline"),
    alternates: getAlternates(locale as Locale, "/tech"),
  };
}

export default async function TechBlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("tech");
  const posts = getTechPosts(loc);
  const latest = posts[0];

  return (
    <>
      {latest && (
        <>
          <div className="tl-status">
            <div className="tl-status-left">
              <span className="tl-status-tag">
                <i className="tl-status-dot" aria-hidden="true" />
                SIGNAL LIVE
              </span>
              <Link href={`/tech/${latest.slug}`}>{latest.title}</Link>
            </div>
            <div className="tl-status-right">
              <span>{loc.toUpperCase()}</span>
            </div>
          </div>
          <FrameRule />
        </>
      )}

      <section className="tl-hero tl-grid">
        <SignalField />
        <div className="tl-hero-copy">
          <p className="tl-eyebrow">{t("heroEyebrow")}</p>
          <h1 className="tl-display">
            {t("heroLead")} <em>{t("heroAccent")}</em>.<span>{t("heroTag")}</span>
          </h1>
          <p className="tl-lede">{t("heroDescription")}</p>
          {latest && (
            <div className="tl-cta">
              <div className="tl-cta-main">
                <Link href={`/tech/${latest.slug}`}>
                  {t("ctaLatest")} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          )}
        </div>
        <SignalStrip />
      </section>

      <FrameRule />

      <section aria-labelledby="tl-index-title">
        <div className="tl-section-head">
          <h2 id="tl-index-title" className="tl-section-title">
            {t("allPosts")}
          </h2>
          <span className="tl-hud">{t("entries", { count: posts.length })}</span>
        </div>

        {posts.length === 0 ? (
          <p className="tl-row-main tl-hud">{t("noPosts")}</p>
        ) : (
          <>
            <div className="tl-cols tl-hud" aria-hidden="true">
              <span>ID</span>
              <span>{t("colTitle")}</span>
              <span>{t("colDate")}</span>
              <span />
            </div>
            <ul>
              {posts.map((post, index) => (
                <li key={post.slug}>
                  <Link href={`/tech/${post.slug}`} className="tl-row">
                    <div className="tl-row-id">
                      TX-{String(posts.length - index).padStart(3, "0")}
                                          </div>
                    <div className="tl-row-main">
                      <h3 className="tl-row-title">{post.title}</h3>
                      <p className="tl-row-desc">{post.description}</p>
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
                    <div className="tl-row-meta">
                      <time dateTime={post.date}>{formatDate(post.date, loc)}</time>
                      <span>{t("readTime", { minutes: post.readingTime })}</span>
                    </div>
                    <div className="tl-row-arrow" aria-hidden="true">
                      →
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}
