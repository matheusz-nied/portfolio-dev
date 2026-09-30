import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getReflectionPosts, formatDate } from "@/lib/content";
import { getAlternates } from "@/lib/seo";
import { Armillary } from "@/components/journal/Armillary";
import { Plate, plateVariantFor } from "@/components/journal/Plate";
import { toRoman, toRomanDate } from "@/lib/roman";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reflections" });
  return {
    title: t("siteName"),
    description: t("tagline"),
    alternates: getAlternates(locale as Locale, "/reflections"),
  };
}

export default async function ReflectionsBlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("reflections");
  const posts = getReflectionPosts(loc);
  const latest = posts[0];

  return (
    <>
      <section className="cj-hero">
        <div className="cj-hero-copy">
          <p className="cj-label cj-label-gold">
            {t("heroKicker")} · {toRoman(new Date().getFullYear())}
          </p>
          <h1 className="cj-display">
            {t("heroLead")} <em>{t("heroAccent")}</em>
          </h1>
          <div className="cj-cta">
            {latest && (
              <Link href={`/reflections/${latest.slug}`} className="cj-btn cj-btn-solid">
                {t("ctaLatest")} <span aria-hidden="true">→</span>
              </Link>
            )}
            <Link href="/" className="cj-btn cj-btn-ghost">
              {t("backToPortfolio").replace(/^←\s*/, "")}
            </Link>
          </div>
          <p className="cj-label cj-motto">{t("motto")}</p>
        </div>

        <Plate variant={0} figure={1} className="cj-hero-plate">
          <Armillary className="cj-plate-armillary" />
        </Plate>
      </section>

      <section className="cj-section" aria-labelledby="cj-index-title">
        <header className="cj-section-head">
          <h2 id="cj-index-title" className="cj-h2">
            {t("indexLabel")}
          </h2>
          <span className="cj-label">{t("entriesCount", { count: posts.length })}</span>
        </header>

        {posts.length === 0 ? (
          <p className="cj-card-desc">{t("noPosts")}</p>
        ) : (
          <ul
            className="cj-cards"
            style={
              {
                "--cj-cols": Math.min(posts.length, 3),
                "--cj-cols-md": Math.min(posts.length, 2),
              } as React.CSSProperties
            }
          >
            {posts.map((post, index) => {
              const number = posts.length - index;
              return (
                <li key={post.slug}>
                  <Link href={`/reflections/${post.slug}`} className="cj-card">
                    <span className="cj-label cj-label-gold">
                      № {toRoman(number)} · {toRomanDate(post.date)}
                    </span>
                    <h3 className="cj-card-title">{post.title}</h3>
                    <p className="cj-card-desc">{post.description}</p>
                    <Plate
                      variant={plateVariantFor(number)}
                      figure={number + 1}
                      className="cj-card-plate"
                    />
                    <span className="cj-card-foot">
                      <span className="cj-label">
                        {formatDate(post.date, loc)} · {t("readTime", { minutes: post.readingTime })}
                      </span>
                      <span className="cj-label cj-card-go">
                        {t("readEntry")} <span aria-hidden="true">→</span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
