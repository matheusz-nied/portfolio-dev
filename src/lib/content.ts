import { techPosts, reflectionPosts } from "#site/content";
import type { Locale } from "@/i18n/routing";

export type BlogPost = (typeof techPosts)[number];

export function getTechPosts(locale: Locale, includeHidden = false) {
  return techPosts
    .filter(
      (p) =>
        p.locale === locale &&
        (includeHidden ? p.hidden : p.published && !p.hidden),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getTechPost(slug: string, locale: Locale) {
  return techPosts.find((p) => p.slug === slug && p.locale === locale);
}

export function getHiddenTechPost(locale: Locale) {
  return techPosts.find(
    (p) => p.locale === locale && p.hidden && p.translationSlug === "hidden-transmission",
  );
}

export function getReflectionPosts(locale: Locale) {
  return reflectionPosts
    .filter((p) => p.locale === locale && p.published && !p.hidden)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getReflectionPost(slug: string, locale: Locale) {
  return reflectionPosts.find((p) => p.slug === slug && p.locale === locale);
}

export function getAlternatePost(
  posts: BlogPost[],
  translationSlug: string,
  targetLocale: Locale,
) {
  return posts.find(
    (p) => p.translationSlug === translationSlug && p.locale === targetLocale,
  );
}

export function formatDate(date: string, locale: Locale) {
  return new Date(date).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
