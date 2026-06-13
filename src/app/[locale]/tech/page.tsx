import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getTechPosts, formatDate } from "@/lib/content";
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

  return (
    <div>
      <h1 className="section-title">{t("allPosts")}</h1>
      {posts.length === 0 ? (
        <p className="mt-10 text-[var(--tech-muted)]">{t("noPosts")}</p>
      ) : (
        <ul className="mt-12 space-y-8">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-[var(--tech-border)] pb-8 last:border-0">
              <Link href={`/tech/${post.slug}`} className="group block">
                <time className="font-[family-name:var(--font-mono)] text-xs text-[var(--tech-muted)]">
                  {formatDate(post.date, loc)} ·{" "}
                  {t("readTime", { minutes: post.readingTime })}
                </time>
                <h2 className="mt-2 text-xl font-medium text-[var(--tech-text)] transition-colors group-hover:text-[var(--tech-accent)]">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--tech-muted)]">
                  {post.description}
                </p>
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-[var(--tech-accent-soft)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
