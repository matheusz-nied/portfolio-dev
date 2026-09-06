import { getProfile } from "@/lib/portfolio";
import {
  getOgEyebrow,
  getOgLocale,
  renderOgImage,
  ogSize,
  ogContentType,
} from "@/lib/og";
import { routing } from "@/i18n/routing";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Matheus Fernandes — Full-Stack Developer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = getOgLocale(locale);
  const profile = getProfile(loc);

  return renderOgImage({
    eyebrow: getOgEyebrow("portfolio", loc),
    title: `${profile.displayName} — ${profile.title}`,
    subtitle: profile.summary,
    footerLeft: profile.name,
    footerRight: profile.availability,
  });
}
