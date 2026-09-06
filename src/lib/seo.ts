import profile from "../../content/portfolio/profile.json";
import { routing, type Locale } from "@/i18n/routing";

const fallbackSiteUrl = "https://portfolio-dev-lake-pi.vercel.app";

function normalizeSiteUrl(value: string) {
  const url = new URL(value);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use http:// or https://");
  }

  url.search = "";
  url.hash = "";
  url.pathname = url.pathname.replace(/\/+$/, "");

  return url.toString().replace(/\/$/, "");
}

const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl,
);

export function getPersonJsonLd(locale: "pt" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title[locale],
    email: profile.email,
    url: siteUrl,
    sameAs: [profile.github, profile.linkedin],
    knowsAbout: profile.topStack,
    description: profile.summary[locale],
  };
}

export function getSiteUrl() {
  return siteUrl;
}

/**
 * Builds `alternates.canonical` + `alternates.languages` for a route so
 * every page tells search engines about its pt/en counterparts (hreflang).
 *
 * @param locale locale of the page this metadata belongs to
 * @param path route path *without* the locale prefix, e.g. "/tech/my-post"
 */
type LocalizedPaths = Partial<Record<Locale, string>>;

function getLocalizedUrl(locale: Locale, path: string) {
  const url = new URL(getSiteUrl());
  const basePath = url.pathname.replace(/\/$/, "");
  const routePath = path === "" || path.startsWith("/") ? path : `/${path}`;

  url.pathname = `${basePath}/${locale}${routePath}`;
  return url.toString();
}

export function getAlternates(
  locale: Locale,
  path: string | LocalizedPaths = "",
) {
  const languages: Record<string, string> = {};
  const canonicalPath = typeof path === "string" ? path : (path[locale] ?? "");
  const canonical = getLocalizedUrl(locale, canonicalPath);

  for (const l of routing.locales) {
    const localizedPath = typeof path === "string" ? path : path[l];
    if (localizedPath === undefined) continue;
    languages[l] = getLocalizedUrl(l, localizedPath);
  }
  languages["x-default"] = languages[routing.defaultLocale] ?? canonical;

  return {
    canonical,
    languages,
  };
}
