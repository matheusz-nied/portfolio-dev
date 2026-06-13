import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getReflectionPosts, formatDate } from "@/lib/content";
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

  return (
    <div>
      <h1 className="section-title font-[family-name:var(--font-serif)]">
        {t("allPosts")}
      </h1>
      {posts.length === 0 ? (
        <p className="mt-10 text-[var(--refl-muted)]">{t("noPosts")}</p>
      ) : (
        <ul className="mt-14 space-y-14">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/reflections/${post.slug}`} className="group block">
                <time className="text-sm text-[var(--refl-muted)]">
                  {formatDate(post.date, loc)} ·{" "}
                  {t("readTime", { minutes: post.readingTime })}
                </time>
                <h2 className="mt-3 font-[family-name:var(--font-serif)] text-2xl font-medium text-[var(--refl-text)] transition-colors group-hover:text-[var(--refl-accent)]">
                  {post.title}
                </h2>
                <p className="mt-3 leading-relaxed text-[var(--refl-muted)]">
                  {post.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
