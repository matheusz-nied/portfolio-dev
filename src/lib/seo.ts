import profile from "../../content/portfolio/profile.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kaizen.dev";

export function getPersonJsonLd(locale: "pt" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
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
